import type { GameEvent, GameState, Gem, PlannedSpecial, SpecialKind } from './types.js';

interface Run { readonly cells: readonly number[]; readonly axis: 'horizontal' | 'vertical' }
interface ResolutionPlan {
  readonly cells: readonly number[];
  readonly specials: readonly PlannedSpecial[];
  readonly events: readonly GameEvent[];
}
interface Activation { readonly cell: number; readonly gemId: number; readonly kind: SpecialKind }

function runsOf(state: GameState): readonly Run[] {
  const { width, height, mask } = state.settings; const runs: Run[] = [];
  const scan = (cells: readonly number[], axis: Run['axis']) => {
    let at = 0;
    while (at < cells.length) {
      const gem = state.board[cells[at]!]; if (!gem) { at++; continue; }
      let end = at + 1;
      while (end < cells.length && state.board[cells[end]!]?.colour === gem.colour) end++;
      if (end - at >= 3) runs.push({ cells: cells.slice(at, end), axis });
      at = end;
    }
  };
  for (let y = 0; y < height; y++) {
    let segment: number[] = [];
    for (let x = 0; x <= width; x++) {
      const index = y * width + x;
      if (x < width && mask[index]) segment.push(index); else { scan(segment, 'horizontal'); segment = []; }
    }
  }
  for (let x = 0; x < width; x++) {
    let segment: number[] = [];
    for (let y = 0; y <= height; y++) {
      const index = y * width + x;
      if (y < height && mask[index]) segment.push(index); else { scan(segment, 'vertical'); segment = []; }
    }
  }
  return runs;
}

function compareRun(a: Run, b: Run, p: number | null, q: number | null, width: number): number {
  const hasQ = Number(b.cells.includes(q ?? -1)) - Number(a.cells.includes(q ?? -1));
  if (hasQ) return hasQ;
  const hasP = Number(b.cells.includes(p ?? -1)) - Number(a.cells.includes(p ?? -1));
  if (hasP) return hasP;
  const maxY = (run: Run) => Math.max(...run.cells.map(cell => Math.floor(cell / width)));
  const byMaxY = maxY(b) - maxY(a); if (byMaxY) return byMaxY;
  const minX = (run: Run) => Math.min(...run.cells.map(cell => cell % width));
  const byMinX = minX(a) - minX(b); if (byMinX) return byMinX;
  if (a.axis !== b.axis) return a.axis === 'horizontal' ? -1 : 1;
  return a.cells[0]! - b.cells[0]!;
}
function chooseAnchor(cells: readonly number[], state: GameState, p: number | null, q: number | null): number | null {
  const eligible = cells.filter(cell => state.board[cell] && !state.board[cell]!.kind);
  eligible.sort((a, b) => {
    const aQ = a === q ? 0 : 1; const bQ = b === q ? 0 : 1; if (aQ !== bQ) return aQ - bQ;
    const aP = a === p ? 0 : 1; const bP = b === p ? 0 : 1; if (aP !== bP) return aP - bP;
    const yDiff = Math.floor(b / state.settings.width) - Math.floor(a / state.settings.width); if (yDiff) return yDiff;
    return a % state.settings.width - b % state.settings.width;
  });
  return eligible[0] ?? null;
}

function planCreations(state: GameState, runs: readonly Run[], p: number | null, q: number | null): readonly PlannedSpecial[] {
  const parents = runs.map((_, index) => index);
  const root = (value: number): number => parents[value] === value ? value : (parents[value] = root(parents[value]!));
  const join = (a: number, b: number) => { const ra = root(a); const rb = root(b); if (ra !== rb) parents[rb] = ra; };
  const owner = new Map<number, number>();
  for (let i = 0; i < runs.length; i++) for (const cell of runs[i]!.cells) {
    const prior = owner.get(cell); if (prior === undefined) owner.set(cell, i); else join(i, prior);
  }
  const groups = new Map<number, Run[]>();
  for (let i = 0; i < runs.length; i++) { const key = root(i); const group = groups.get(key) ?? []; group.push(runs[i]!); groups.set(key, group); }
  const planned: PlannedSpecial[] = [];
  for (const group of groups.values()) {
    const burstRuns = group.filter(run => run.cells.length >= 5).sort((a, b) => b.cells.length - a.cells.length || compareRun(a, b, p, q, state.settings.width));
    if (burstRuns.length) {
      const run = burstRuns[0]!; const anchor = chooseAnchor(run.cells, state, p, q);
      if (anchor !== null) planned.push({ cell: anchor, kind: 'colour-burst' });
      continue;
    }
    const horizontal = group.filter(run => run.axis === 'horizontal'); const vertical = group.filter(run => run.axis === 'vertical');
    const intersections = [...new Set(horizontal.flatMap(h => vertical.flatMap(v => h.cells.filter(cell => v.cells.includes(cell)))))].sort((a, b) => a - b);
    if (intersections.length) {
      const anchor = chooseAnchor(intersections, state, p, q);
      if (anchor !== null) planned.push({ cell: anchor, kind: 'bomb' });
      continue;
    }
    const fourRuns = group.filter(run => run.cells.length === 4).sort((a, b) => compareRun(a, b, p, q, state.settings.width));
    if (fourRuns.length) {
      const run = fourRuns[0]!; const anchor = chooseAnchor(run.cells, state, p, q);
      if (anchor !== null) planned.push({ cell: anchor, kind: run.axis === 'horizontal' ? 'row-beam' : 'column-beam' });
    }
  }
  return Object.freeze(planned.sort((a, b) => a.cell - b.cell));
}

function isBurst(kind: SpecialKind | undefined): boolean { return kind === 'colour-burst'; }
function isSpecial(gem: Gem | null | undefined): gem is Gem & { readonly kind: SpecialKind } { return Boolean(gem?.kind); }

/** Returns whether a swap is legal under ordinary-run and explicit-combination rules. */
export function isValidSpecialSwap(first: Gem, second: Gem, hasNaturalMatch: boolean): boolean {
  if (isSpecial(first) && isSpecial(second)) return true;
  if (isBurst(first.kind) || isBurst(second.kind)) return true;
  return first.colour !== second.colour && hasNaturalMatch;
}

function activeCells(state: GameState): number[] { return state.settings.mask.flatMap((on, index) => on && state.board[index] ? [index] : []); }
function comboPlan(state: GameState, p: number, q: number, protectedCells: ReadonlySet<number>, pairIds: ReadonlySet<number>): { readonly name: string; readonly direct: readonly number[]; readonly conversions: readonly { readonly cell: number; readonly kind: SpecialKind }[] } | null {
  const a = state.board[p]!; const b = state.board[q]!; const ak = a.kind; const bk = b.kind;
  if (!ak && !bk) return null;
  const centre = q; const { width, height } = state.settings; const direct = new Set<number>([p, q]); const conversions: { cell: number; kind: SpecialKind }[] = [];
  const row = (y: number) => activeCells(state).filter(cell => Math.floor(cell / width) === y);
  const column = (x: number) => activeCells(state).filter(cell => cell % width === x);
  const burst = ak === 'colour-burst' ? a : bk === 'colour-burst' ? b : null;
  if (ak && bk) {
    if (ak === 'colour-burst' && bk === 'colour-burst') return { name: 'burst-burst', direct: activeCells(state), conversions };
    if (ak === 'colour-burst' || bk === 'colour-burst') {
      const power = ak === 'colour-burst' ? bk : ak;
      if (power !== 'row-beam' && power !== 'column-beam' && power !== 'bomb') return null;
      const targetColour = ak === 'colour-burst' ? b.colour : a.colour;
      const conversionKind: SpecialKind = power;
      for (const cell of activeCells(state)) {
        const gem = state.board[cell]!;
        if (gem.colour === targetColour && !pairIds.has(gem.id) && !protectedCells.has(cell)) conversions.push({ cell, kind: conversionKind });
      }
      return { name: `burst-${power}`, direct: [...direct, ...conversions.map(item => item.cell)], conversions };
    }
    if (ak === 'bomb' && bk === 'bomb') {
      const x = centre % width; const y = Math.floor(centre / width);
      for (const cell of activeCells(state)) if (Math.abs(cell % width - x) <= 2 && Math.abs(Math.floor(cell / width) - y) <= 2) direct.add(cell);
      return { name: 'bomb-bomb', direct: [...direct], conversions };
    }
    if ((ak === 'row-beam' || ak === 'column-beam') && (bk === 'row-beam' || bk === 'column-beam')) {
      for (const cell of row(Math.floor(centre / width))) direct.add(cell);
      for (const cell of column(centre % width)) direct.add(cell);
      return { name: 'beam-beam', direct: [...direct], conversions };
    }
    const beam = ak === 'bomb' ? bk : bk === 'bomb' ? ak : null;
    if (beam === 'row-beam' || beam === 'column-beam') {
      const x = centre % width; const y = Math.floor(centre / width);
      for (let rowY = Math.max(0, y - 1); rowY <= Math.min(height - 1, y + 1); rowY++) for (const cell of row(rowY)) direct.add(cell);
      for (let columnX = Math.max(0, x - 1); columnX <= Math.min(width - 1, x + 1); columnX++) for (const cell of column(columnX)) direct.add(cell);
      return { name: 'beam-bomb', direct: [...direct], conversions };
    }
    if (ak === 'bomb' && bk === 'bomb') return { name: 'bomb-bomb', direct: [...direct], conversions };
  }
  if (burst) {
    const target = ak === 'colour-burst' ? b : a;
    for (const cell of activeCells(state)) if (state.board[cell]!.colour === target.colour) direct.add(cell);
    return { name: 'burst-normal', direct: [...direct], conversions };
  }
  return null;
}

function effectCells(state: GameState, cell: number, kind: SpecialKind): readonly number[] {
  const { width } = state.settings; const x = cell % width; const y = Math.floor(cell / width);
  if (kind === 'row-beam') return activeCells(state).filter(index => Math.floor(index / width) === y);
  if (kind === 'column-beam') return activeCells(state).filter(index => index % width === x);
  if (kind === 'bomb') return activeCells(state).filter(index => Math.abs(index % width - x) <= 1 && Math.abs(Math.floor(index / width) - y) <= 1);
  const colour = state.board[cell]!.colour;
  return activeCells(state).filter(index => state.board[index]!.colour === colour);
}

/** Resolves one normal/special match wave into a unique clear set and protected creations. */
export function planWave(state: GameState, naturalCells: readonly number[], p: number | null, q: number | null, extraClearCells: readonly number[] = []): ResolutionPlan {
  const runs = runsOf(state); const specials = planCreations(state, runs, p, q); const protectedCells = new Set(specials.map(item => item.cell));
  const pairIds = new Set(p === null || q === null ? [] : [state.board[p]!.id, state.board[q]!.id]);
  const combo = p === null || q === null ? null : comboPlan(state, p, q, protectedCells, pairIds);
  const consumedPairIds = combo ? pairIds : new Set<number>();
  const conversionKinds = new Map((combo?.conversions ?? []).map(item => [state.board[item.cell]!.id, item.kind] as const));
  const cleared = new Set<number>(); const activations: Activation[] = []; const activationIds = new Set<number>(); const events: GameEvent[] = []; const activationEvents: GameEvent[] = [];
  const addActivation = (cell: number, kind: SpecialKind) => {
    const gem = state.board[cell]; if (!gem || protectedCells.has(cell) || consumedPairIds.has(gem.id) || activationIds.has(gem.id)) return;
    activationIds.add(gem.id); activations.push({ cell, gemId: gem.id, kind });
  };
  const addCell = (cell: number) => {
    const gem = state.board[cell]; if (!gem || protectedCells.has(cell)) return;
    cleared.add(cell);
    if (isSpecial(gem)) addActivation(cell, conversionKinds.get(gem.id) ?? gem.kind);
  };
  for (const cell of naturalCells) addCell(cell);
  for (const cell of extraClearCells) addCell(cell);
  if (combo) {
    events.push({ type: 'special-combination', combo: combo.name, centre: q });
    const convertedCells = new Set(combo.conversions.map(item => item.cell));
    for (const cell of combo.direct) {
      const gem = state.board[cell];
      if (gem && !protectedCells.has(cell) && (pairIds.has(gem.id) || convertedCells.has(cell))) cleared.add(cell);
      else addCell(cell);
    }
    for (const converted of combo.conversions) {
      const gem = state.board[converted.cell]; if (!gem || protectedCells.has(converted.cell)) continue;
      cleared.add(converted.cell); addActivation(converted.cell, converted.kind);
    }
  }
  while (activations.length) {
    activations.sort((a, b) => a.cell - b.cell || a.gemId - b.gemId);
    const current = activations.shift()!; const kind = current.kind;
    activationEvents.push({ type: 'special-activated', id: current.gemId, cell: current.cell, kind });
    for (const cell of effectCells(state, current.cell, kind)) addCell(cell);
  }
  activationEvents.sort((a, b) => Number(a.cell) - Number(b.cell) || Number(a.id) - Number(b.id));
  events.push(...activationEvents);
  for (const special of specials) events.push({ type: 'special-planned', cell: special.cell, kind: special.kind, id: state.board[special.cell]!.id });
  return { cells: Object.freeze([...cleared].sort((a, b) => a - b)), specials, events: Object.freeze(events) };
}

/** Materializes newly planned powers on surviving anchor gems after a wave's removal. */
export function materializeSpecials(board: readonly (Gem | null)[], specials: readonly PlannedSpecial[]): readonly (Gem | null)[] {
  const next = [...board];
  for (const planned of specials) {
    const gem = next[planned.cell]; if (gem) next[planned.cell] = Object.freeze({ ...gem, kind: planned.kind });
  }
  return Object.freeze(next);
}
