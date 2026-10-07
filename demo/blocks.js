import {fillCampaignSelector,difficultyText} from './campaigns.js';
import {refreshAppearanceLanguage} from './appearance.js';
import {syncAuthoredSettings,readFreeSettings,restoreFreeSettings} from './settings.js';
import {updateEnding} from './ending.js';
import { soundEnabled, setSound, unlockSound, playTone } from './audio.js';
import { positions, settle, animationEnabled, setAnimations } from './animation.js';
import { advanceTicks, applyAction, blockCells, createGame, createLesson, createLevel, decodeGame, encodeGame, lessonManifest, levelManifest, restartGame } from './dist/magnetic-blocks.js';
import { pageWords } from './words.js';
import { newSeed } from './seed.js';

const $ = selector => document.querySelector(selector);
const symbols = { red: '●', blue: '◆', green: '▲', gold: '■', purple: '+', teal: '☾' };
const text = {
  en: {
    settings:'Settings', mode:'Mode', board:'Board preset', width:'Width', height:'Height', colours:'Colours', schedule:'Magnetic floor schedule', impact:'Magnetic Impact on hard drop',
    new:'New game', restart:'Restart', help:'Rotate the 2×2 block. Calm keeps bonded gems together; Pull separates them into columns.', material:'Board material', animations:'Animation', reduced:'Reduce motion', sound:'Sound effects',
    title:'Magnetic Blocks', score:'Score', bestChain:'Best chain', placed:'Placed', campaign:'Campaign level', lessonLabel:'Lesson', freePlay:'Free play', noLesson:'No lesson', next:'Next', nextFloor:'Next floor', currentFloor:'Current floor',
    floorSwitch:'Floor Switch', switchHelp:'Choose the floor for this block. Review its preview, then apply by placing or dropping.', calm:'Calm', pull:'Pull', cancel:'Cancel', apply:'Apply with this floor', rotateLeft:'Rotate left', rotateRight:'Rotate right',
    keys:'← → move · ↑/Z/X rotate · Space drop/place · keypad 4/6/7/9/5/2 · Esc pause', lock:'Landing',
    ready:'Move, rotate, and place the block', paused:'Paused', won:'Goal complete', lost:'The block could not spawn', finished:'Queue complete', scrollTop:'Top', scrollBottom:'Bottom', scrollLabel:'Board scroll position', boardLabel:'Magnetic Blocks board',
    floorCalm:'Calm · bonded blocks settle together', floorMagnetic:'Pull · bonds break and columns settle apart', previewCalm:'Preview: new gems will stay bonded during Calm settling.', previewMagnetic:'Preview: bonds will break and each column will settle on its own.', impactPreview:'Magnetic Impact will remove {n} support gem(s) on this hard drop.', noImpact:'No support gems are in contact for Magnetic Impact.',
    switchUsed:'Floor Switch used', switchAvailable:'1 Floor Switch available', switchSpent:'Floor Switch spent', override:'Selected for this block', scheduleNext:'Then scheduled floor', settingsPending:'Settings changed. Select New game to apply.',
    invalidSize:'Choose width 4–16 and height 4–32 (up to 512 cells).', blocked:'That move is blocked.', pausedHelp:'Resume when ready.', time:'Time', theme:'Theme', drop:'Hard drop', place:'Place', down:'Down', pause:'Pause', resume:'Continue',
    floorNameCalm:'Calm', floorNameMagnetic:'Pull', newSave:'A new game could not start: ',
  },
  ja: {
    settings:'設定', mode:'モード', board:'盤面プリセット', width:'幅', height:'高さ', colours:'色数', schedule:'床の磁気スケジュール', impact:'ハードドロップ時の磁気衝撃',
    new:'新しいゲーム', restart:'やり直す', help:'2×2ブロックを回転します。静穏では宝石が結合したまま落下し、引力では列ごとに分かれて落ちます。', material:'盤面の素材', animations:'アニメーション', reduced:'動きを減らす', sound:'効果音',
    title:'磁石ブロック', score:'得点', bestChain:'最大連鎖', placed:'配置数', campaign:'キャンペーン', lessonLabel:'レッスン', freePlay:'フリープレイ', noLesson:'レッスンなし', next:'次のブロック', nextFloor:'次の床', currentFloor:'現在の床',
    floorSwitch:'床スイッチ', switchHelp:'このブロックの床を選びます。プレビューを確認して、配置または落下で適用します。', calm:'静穏', pull:'引力', cancel:'取消', apply:'この床で配置', rotateLeft:'↶ 回転', rotateRight:'↷ 回転',
    keys:'← → 移動 · ↑/Z/X 回転 · Space 落下/配置 · テンキー 4/6/7/9/5/2 · Esc 一時停止', lock:'着地',
    ready:'移動・回転してブロックを配置します', paused:'一時停止中', won:'目標達成', lost:'ブロックを配置できません', finished:'キュー終了', scrollTop:'上へ', scrollBottom:'下へ', scrollLabel:'盤面のスクロール位置', boardLabel:'磁石ブロックの盤面',
    floorCalm:'静穏 · 結合したブロックが一緒に落ちます', floorMagnetic:'引力 · 結合が切れ、列ごとに落ちます', previewCalm:'プレビュー：静穏では新しい宝石の結合が保たれます。', previewMagnetic:'プレビュー：結合が切れ、それぞれの列が落下します。', impactPreview:'磁気衝撃で接触中の宝石を {n} 個取り除きます。',
    noImpact:'磁気衝撃で取り除く接触中の宝石はありません。', switchUsed:'床スイッチを使用', switchAvailable:'床スイッチ 1 回分', switchSpent:'床スイッチ使用済み', override:'このブロックに選択中', scheduleNext:'次は予定された床', settingsPending:'設定が変わりました。新しいゲームを始めて適用してください。',
    invalidSize:'幅は4〜16、高さは4〜32、合計512セル以内にしてください。', blocked:'その操作はできません。', pausedHelp:'準備ができたら続けてください。', time:'時間', theme:'テーマ', drop:'ハードドロップ', place:'配置', down:'下へ', pause:'一時停止', resume:'続ける',
    floorNameCalm:'静穏', floorNameMagnetic:'引力', newSave:'ゲームを開始できません：',
  }
};

const saveKey = 'houseki-magnetic-blocks-save';
const preferenceKey = 'houseki-ui';
const family=familyLanguage({id:'houseki',words:pageWords('blocks'),onChange:next=>setLanguage(next)});
let lang = family.lang, game, startOptions = null, selectedLevel = null, selectedLesson = null, lastFrame = 0, accumulator = 0, saveTimer = 0;
let boardKey = '', hudKey = '';
const capOversized = globalThis.housekiConfig?.oversizedUnlocked === false;

function t(key) { return text[lang][key] ?? text.en[key] ?? key; }
function setLanguage(value) { lang = value === 'ja' ? 'ja' : 'en'; populateCampaignSelectors(); syncSetup(); render(true); writePreferences(); }
function populateCampaignSelectors() {
  const selectedLevelId = $('#level').value, selectedLessonId = $('#lesson').value;
  fillCampaignSelector($('#level'), levelManifest, lang, t('freePlay'));
  $('#lesson').innerHTML = `<option value="">${t('noLesson')}</option>` + lessonManifest.map(lesson => `<option value="${lesson.id}">${lesson.title[lang]}</option>`).join('');
  $('#level').value = selectedLevelId; $('#lesson').value = selectedLessonId;
}
function readPreferences() {
  try {
    const pref = JSON.parse(localStorage.getItem(preferenceKey) || '{}');
    restoreFreeSettings(pref.freeSetup);
    if (pref.material) $('#material').value = pref.material;
    if (pref.motion) $('#motion').checked = true;
    document.documentElement.dataset.motion = pref.motion ? 'reduced' : 'full';
  } catch { /* Optional preferences do not block play. */ }
}
function writePreferences() {
  try { localStorage.setItem(preferenceKey, JSON.stringify({ freeSetup: readFreeSettings(), material: $('#material').value, motion: $('#motion').checked, sound: $('#sound').checked })); }
  catch { /* Optional preferences do not block play. */ }
}
function floorFromValue(value) {
  if (value === 'magnetic') return { kind: 'fixed', floor: 'magnetic' };
  if (value === 'frequent') return { kind: 'frequent' };
  if (value === 'rare') return { kind: 'infrequent' };
  return { kind: 'fixed', floor: 'calm' };
}
function presetSize(name) {
  return ({ standard: [8, 16], extraWide: [16, 16], deep: [8, 32], large: [16, 32] })[name] ?? null;
}
function optionsFromControls() {
  const width = Number($('#width').value), height = Number($('#height').value);
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 4 || width > 16 || height < 4 || height > 32 || width * height > 512) throw new RangeError(t('invalidSize'));
  if (capOversized && (width > 12 || height > 20)) throw new RangeError(lang === 'en' ? 'Large boards are locked in this host configuration.' : 'この環境では大型盤面がロックされています。');
  return { mode: $('#mode').value, width, height, colourCount: Number($('#colours').value), seed: newSeed(), pieceLimit: 200, schedule: floorFromValue($('#schedule').value), floorSwitch: true, magneticImpact: $('#impact').checked };
}
function changedSettings() { $('#pending').hidden = false; validateSize(); }
function validateSize() {
  const width = Number($('#width').value), height = Number($('#height').value);
  const valid = Number.isInteger(width) && Number.isInteger(height) && width >= 4 && width <= 16 && height >= 4 && height <= 32 && width * height <= 512 && !(capOversized && (width > 12 || height > 20));
  $('#size-error').hidden = valid;
  $('#size-error').textContent = capOversized && (width > 12 || height > 20) ? (lang === 'en' ? 'Large boards are locked in this host configuration.' : 'この環境では大型盤面がロックされています。') : t('invalidSize');
  $('#new').disabled = !valid;
}
function applySettingsToControls(settings) {
  $('#mode').value = settings.mode;
  $('#width').value = settings.width; $('#height').value = settings.height;
  $('#colours').value = settings.colourCount;
  $('#schedule').value = scheduleValue(settings.schedule);
  $('#impact').checked = settings.magneticImpact;
  const preset = Object.entries({ standard: [8,16], extraWide: [16,16], deep: [8,32], large: [16,32] }).find(([, size]) => size[0] === settings.width && size[1] === settings.height)?.[0] ?? 'custom';
  $('#preset').value = capOversized && (settings.width > 12 || settings.height > 20) ? 'custom' : preset;
  if (capOversized && (settings.width > 12 || settings.height > 20)) { $('#new').disabled = true; }
  validateSize();
}
/** The select value for a floor schedule, as the settings panel names it. */
function scheduleValue(schedule) {
  return schedule.kind === 'fixed' ? schedule.floor : schedule.kind === 'frequent' ? 'frequent' : schedule.kind === 'infrequent' || schedule.kind === 'occasional' ? 'rare' : schedule.kind === 'authored' && schedule.magneticPlacements.includes(1) ? 'magnetic' : 'calm';
}
/** What the panel must show for the level or lesson chosen, or null for free play: the chosen content's own rules, not the free choices. */
function setupConfig() {
  const lesson = lessonManifest.find(item => item.id === $('#lesson').value) ?? null;
  const level = lesson ? null : levelManifest.find(item => item.id === $('#level').value) ?? null;
  const options = (lesson ?? level)?.options;
  return options ? { mode: 'challenge', width: options.width, height: options.height, colourCount: options.colourCount, schedule: scheduleValue(options.schedule), magneticImpact: options.magneticImpact === true } : null;
}
/** Shows the chosen content's fixed rules and locks what it decides, or gives free play its own choices back. The board in play is not touched. */
function syncSetup() { syncAuthoredSettings(setupConfig(), lang); validateSize(); }
function syncCampaignControls() { $('#objective').hidden = !(selectedLevel || selectedLesson); }
function newGame(restart = false) {
  try {
    if (!restart || !game) {
      selectedLesson = lessonManifest.find(lesson => lesson.id === $('#lesson').value) ?? null;
      selectedLevel = selectedLesson ? null : levelManifest.find(level => level.id === $('#level').value) ?? null;
      $('#level').value = selectedLevel?.id ?? '';
      $('#lesson').value = selectedLesson?.id ?? '';
      startOptions = selectedLesson?.options ?? selectedLevel?.options ?? optionsFromControls();
    }
    game = restart && game ? restartGame(game) : selectedLesson ? createLesson(selectedLesson.id) : selectedLevel ? createLevel(selectedLevel.id) : createGame(startOptions);
    if (!restart) { if (selectedLevel || selectedLesson) syncSetup(); else applySettingsToControls(game.settings); $('#pending').hidden = true; }
    $('#status').textContent = '';
    syncCampaignControls();
    try { localStorage.removeItem(saveKey); } catch { /* Saving is optional. */ }
    render(true); if(!['won','lost','finished'].includes(game.phase))$('.game-screen').focus({ preventScroll: true }); queueSave();
  } catch (error) {
    $('#size-error').hidden = false;
    $('#size-error').textContent = `${t('newSave')}${error instanceof Error ? error.message : String(error)}`;
  }
}
function symbol(gem) { return symbols[gem.colour] ?? '◆'; }
function gemMarkup(gem, classes = '') {
  const target=game?.settings.goal?.kind==='clear-targets'&&game.settings.goal.targetIds.includes(gem.id);
  const colourLabel = { red: 'red', blue: 'blue', green: 'green', gold: 'gold', purple: 'purple', teal: 'teal' }[gem.colour] ?? 'gem';
  const overlay=classes.includes('destination-ghost')?' style="position:absolute;inset:6%;pointer-events:none"':'';
  return `<span class="gem ${gem.colour} ${target?'goal-target':''} ${classes}"${overlay}${gem.id !== undefined ? ` data-id="${gem.id}"` : ''} role="img" aria-label="${colourLabel} gem${target?(lang==='en'?', target':', 目標'):''}">${symbol(gem)}</span>`;
}
function previewDrop() {
  if (game.phase !== 'falling' || !game.active) return null;
  return applyAction(game, { kind: game.settings.mode === 'relaxed' ? 'land' : 'hard-drop' }).state;
}
function floorClasses(floor) { return floor === 'magnetic' ? 'magnetic' : 'calm'; }
function floorLabel(floor) { return floor === 'magnetic' ? t('floorNameMagnetic') : t('floorNameCalm'); }
function currentShownFloor() { return game.pendingFloorOverride ?? game.floor; }
function renderBoard(force = false) {
  const width = game.settings.width, height = game.settings.height;
  const board = game.phase === 'gravity' && game.gravityBoard ? game.gravityBoard : game.board;
  const blockPreview = previewDrop();
  const hitIds = new Set(blockPreview?.impactRemovedIds ?? []);
  const positionsById = new Map(board.flatMap((gem, index) => gem ? [[gem.id, index]] : []));
  const bonds = new Set();
  for (const edge of game.bonds) {
    const a = positionsById.get(edge.a), b = positionsById.get(edge.b);
    if (a === undefined || b === undefined) continue;
    const ax = a % width, ay = Math.floor(a / width), bx = b % width, by = Math.floor(b / width);
    if (bx === ax + 1) { bonds.add(`${a}:right`); bonds.add(`${b}:left`); }
    if (bx === ax - 1) { bonds.add(`${a}:left`); bonds.add(`${b}:right`); }
    if (by === ay + 1) { bonds.add(`${a}:down`); bonds.add(`${b}:up`); }
    if (by === ay - 1) { bonds.add(`${a}:up`); bonds.add(`${b}:down`); }
  }
  const contents = Array(width * height).fill('');
  const pending = new Set(game.pendingClear);
  board.forEach((gem, index) => {
    if (!gem) return;
    const edgeClasses = ['left','right','up','down'].filter(edge => bonds.has(`${index}:${edge}`)).map(edge => `bond-${edge}`).join(' ');
    contents[index] = gemMarkup(gem, `${edgeClasses}${pending.has(index) ? ' marked' : ''}${hitIds.has(gem.id) ? ' impact-hit' : ''}`);
  });
  if (game.active && game.phase === 'falling' && blockPreview) {
    const projected=blockPreview.gravityBoard??blockPreview.board;
    for(let index=0;index<projected.length;index++){
      const gem=projected[index];if(!gem||!game.active.gems.some(active=>active.id===gem.id))continue;
      contents[index]+=gemMarkup(gem,'ghost destination-ghost');
    }
    for (const entry of blockCells(game.active, width)) if (entry.index >= 0 && entry.index < contents.length) contents[entry.index] = gemMarkup(entry.gem, 'active');
  }
  const boardMarkup = contents.map((gem, index) => `<div class="cell${game.settings.mask[index] ? '' : ' masked'}" data-cell="${index}">${gem}</div>`).join('');
  const oversized=width>12||height>20;$('.well-scroll').dataset.oversized=String(oversized);$('.board-nav').hidden=!oversized;{const area=$('.well-scroll');if(oversized){area.setAttribute('tabindex','0');area.setAttribute('role','region');area.setAttribute('aria-label',t('boardLabel'));}else{area.removeAttribute('tabindex');area.removeAttribute('role');area.removeAttribute('aria-label');}}updateBoardScroll();
  const key = `${width}x${height}|${game.phase}|${boardMarkup}|${currentShownFloor()}|${game.pendingClear.join(',')}`;
  if (!force && key === boardKey) return;
  const well = $('#well'), previous = positions(well);
  well.style.setProperty('--cols', String(width)); well.style.setProperty('--rows', String(height));
  well.dataset.width = String(width); well.dataset.height = String(height); well.dataset.phase = game.phase;
  well.style.gridTemplateColumns = `repeat(${width}, var(--cell))`;
  well.style.gridTemplateRows = `repeat(${height}, var(--cell))`;
  well.innerHTML = boardMarkup; boardKey = key;
  settle(well, previous);
  $('#floor-line').className = `floor-line ${floorClasses(currentShownFloor())}`;
  $('#floor-line').textContent = currentShownFloor() === 'magnetic' ? '✧' : '●';
  if (blockPreview?.impactRemovedIds.length) {
    const message = t('impactPreview').replace('{n}', String(blockPreview.impactRemovedIds.length));
    $('#hits').textContent = message;
    $('#floor-preview').textContent = `${t(currentShownFloor() === 'magnetic' ? 'previewMagnetic' : 'previewCalm')} ${message}`;
  } else {
    $('#hits').textContent = '';
    $('#floor-preview').textContent = `${t(currentShownFloor() === 'magnetic' ? 'previewMagnetic' : 'previewCalm')}${currentShownFloor() !== game.floor ? ` ${t('override')}` : ''}`;
  }
}
function renderHud(force = false) {
  const floor = currentShownFloor();
  const key = [game.score, game.maxChain, game.moves, game.placements, game.phase, game.floor, game.nextFloor, floor, game.floorSwitchCharges, game.pendingFloorOverride, game.active?.lockTicks, game.elapsedTicks, game.queue.length, selectedLevel?.id, selectedLesson?.id].join('|');
  if (!force && key === hudKey) return;
  hudKey = key;
  $('#score').textContent = String(game.score); $('#chain').textContent = String(game.maxChain); $('#placed').textContent = String(game.placements);
  $('#piece-limit').textContent=String(game.settings.pieceLimit);$('#placement-progress').max=game.settings.pieceLimit;$('#placement-progress').value=Math.min(game.placements,game.settings.pieceLimit);$('#placement-progress').setAttribute('aria-label',`${t('placed')} ${game.placements}/${game.settings.pieceLimit}`);
  const current = $('#current-floor'); current.className = `floor-chip ${floorClasses(floor)}`; current.textContent = `${floor === 'magnetic' ? '✧' : '●'} ${floorLabel(floor)}`;
  const next = $('#next-floor'); next.className = `floor-chip ${floorClasses(game.nextFloor)}`; next.textContent = `${game.nextFloor === 'magnetic' ? '✧' : '●'} ${floorLabel(game.nextFloor)}`;
  $('#charges').textContent = game.floorSwitchCharges ? '1' : '0';
  $('#charges').dataset.tone = game.floorSwitchCharges ? 'good' : 'bad';
  $('#charges').setAttribute('aria-label', game.floorSwitchCharges ? t('switchAvailable') : t('switchSpent'));
  for (const button of document.querySelectorAll('[data-floor]')) {
    button.disabled = game.phase !== 'falling' || !game.floorSwitchCharges;
    button.setAttribute('aria-pressed', String(game.pendingFloorOverride === button.dataset.floor));
  }
  $('#cancel-floor').disabled = game.phase !== 'falling' || !game.pendingFloorOverride;
  $('#apply-floor').hidden = !game.pendingFloorOverride || game.phase !== 'falling';
  $('#apply-floor').textContent = t('apply');
  $('#lock-wrap').hidden = game.settings.mode !== 'arcade' || !game.active || game.phase !== 'falling';
  $('#lock-progress').value = game.active?.lockTicks ?? 0;
  $('#lock-progress').setAttribute('aria-label', `${t('lock')} ${game.active?.lockTicks ?? 0}/24`);
  const nextPieces = game.queue.slice(0, 3);
  $('#next').innerHTML = nextPieces.map((piece, index) => `<div class="next-piece" aria-label="${t('next')} ${index + 1}: ${piece.join(', ')}">${piece.map(colour => gemMarkup({ colour }, 'mini')).join('')}</div>`).join('') || `<span class="micro">—</span>`;
  const failedLevel = Boolean(selectedLevel && game.phase === 'finished');
  const phaseText = failedLevel ? t('lost') : game.phase === 'paused' ? t('paused') : game.phase === 'won' ? t('won') : game.phase === 'lost' ? t('lost') : game.phase === 'finished' ? t('finished') : game.phase === 'falling' ? t('ready') : `${game.phase === 'clear-mark' ? '✦' : '·'} ${game.chain > 1 ? `${game.chain}×` : ''}`;
  $('#status').textContent = phaseText;
  const campaignDrop = Boolean(selectedLevel || selectedLesson);
  $('.place').hidden = game.settings.mode !== 'relaxed'; $('.drop').hidden = game.settings.mode !== 'arcade' && !campaignDrop; $('.soft').hidden = game.settings.mode !== 'arcade';
  const level = selectedLevel, lesson = selectedLesson;
  $('#objective-title').textContent = level ? `${level.number} · ${level.title[lang]}` : lesson?.title[lang] ?? '';
  $('#objective-marks').hidden = !level; $('#objective-marks').textContent = level ? difficultyText(level) : '';
  $('#objective-copy').textContent = level?.objective[lang] ?? lesson?.objective[lang] ?? '';
  const goalHud = $('#goal-hud'); goalHud.hidden = !level;
  if (level) {
    const targets = level.options.goal?.kind === 'clear-targets' ? level.options.goal.targetIds : [];
    const remaining = new Set(game.board.flatMap(gem => gem ? [gem.id] : []));
    const cleared = targets.filter(id => !remaining.has(id)).length;
    const total = targets.length;
    $('#goal-progress').max = total; $('#goal-progress').value = cleared;
    $('#goal-text').textContent = lang === 'en' ? `Marked gems ${cleared}/${total}` : `目標の石 ${cleared}/${total}`;
    $('#goal-progress').setAttribute('aria-label', $('#goal-text').textContent);
  }
  $('.pause').hidden = game.phase === 'paused' || ['won', 'lost', 'finished'].includes(game.phase);
  $('.resume').hidden = game.phase !== 'paused';
  document.querySelectorAll('.controls button[data-action]').forEach(button => { const action = button.dataset.action; button.disabled = !game.active && ['left','right','soft-drop','hard-drop','land','rotate-clockwise','rotate-anticlockwise'].includes(action) || !['falling','paused','clear-mark','clear-remove','gravity'].includes(game.phase); });
  $('#well').parentElement.className = `well-wrap material-${$('#material').value}`;
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i]').forEach(element => { const value = t(element.dataset.i); if (value) element.textContent = value; });
  $('[data-action="hard-drop"]').textContent = t('drop'); $('[data-action="land"]').textContent = t('place'); $('[data-action="soft-drop"]').textContent = t('down');
  $('[data-action="pause"]').textContent = t('pause'); $('[data-action="resume"]').textContent = t('resume');
  const elapsed = Math.floor(game.elapsedTicks / 60); const time = `${String(Math.floor(elapsed / 60)).padStart(2, '0')}:${String(elapsed % 60).padStart(2, '0')}`;
  $('#elapsed').textContent = time;
  for (const option of $('#preset').options) if (['extraWide','deep','large'].includes(option.value)) {
    option.disabled = capOversized; option.textContent = `${option.dataset.base ?? option.textContent.replace(/ · Locked$/, '')}${capOversized ? ' · Locked' : ''}`;
    option.dataset.base ??= option.textContent.replace(/ · Locked$/, '');
  }
}
function render(force = false) {
  refreshAppearanceLanguage(lang); if (!game) return;
  renderBoard(force); renderHud(force); syncCampaignControls();
  const activeLevel = selectedLesson ? { ...selectedLesson, lesson: true } : selectedLevel;
  const activeLevels = levelManifest;
  const index = selectedLevel ? activeLevels.findIndex(level => level.id === selectedLevel.id) : -1;
  const next = index >= 0 ? activeLevels[index + 1] ?? null : null;
  const endingPhase = selectedLevel && game.phase === 'finished' ? 'lost' : game.phase;
  updateEnding({ phase: endingPhase, score: game.score, lang, mode: game.settings.mode, level: activeLevel, next,
    onRestart: () => newGame(true),
    onNext: next ? () => { $('#level').value = next.id; $('#lesson').value = ''; newGame(); } : undefined,
    detail: activeLevel?.objective?.[lang] ?? $('#status').textContent });
}

function updateBoardScroll() {
  const area=$('.well-scroll');if(!area)return;
  const percent=Math.round(area.scrollTop/Math.max(1,area.scrollHeight-area.clientHeight)*100);
  $('.scroll-position').textContent=`${percent}%`;
  $('.scroll-position').setAttribute('aria-label',`${t('scrollLabel')}: ${percent}%`);
}

function queueSave() { if (!saveTimer) saveTimer = setTimeout(save, 350); }
function save() { clearTimeout(saveTimer); saveTimer = 0; try { if (game) localStorage.setItem(saveKey, encodeGame(game)); } catch { /* A save failure never interrupts play. */ } }
function dispatch(kind, extra = {}) {
  if (!game) return false;
  const result = applyAction(game, { kind, ...extra });
  if (!result.accepted) { if (result.reason === 'blocked') { $('#status').textContent = t('blocked'); setTimeout(() => renderHud(true), 600); } return false; }
  game = result.state; render(); queueSave();
  if (result.events.some(event => event.type === 'piece-locked')) playTone(1, true);
  if (result.events.some(event => event.type === 'cells-removed')) playTone(Math.max(1, game.chain));
  return true;
}
function simulateTick() {
  const before = game;
  const result = advanceTicks(game, 1);
  game = result.state;
  if (game.phase !== before.phase || game.score !== before.score || game.active?.y !== before.active?.y || game.active?.lockTicks !== before.active?.lockTicks || game.queue !== before.queue) { render(); queueSave(); }
  if (result.events.some(event => event.type === 'piece-locked')) playTone(1, true);
  if (result.events.some(event => event.type === 'cells-removed')) playTone(Math.max(1, game.chain));
}
function animate(timestamp) {
  if (!lastFrame) lastFrame = timestamp;
  accumulator += Math.min(100, timestamp - lastFrame); lastFrame = timestamp;
  const tickMs = 1000 / 60; let count = 0;
  while (accumulator >= tickMs && count < 6) { simulateTick(); accumulator -= tickMs; count++; }
  requestAnimationFrame(animate);
}
function activateAction(kind) {
  if (kind === 'apply-floor') return dispatch(game.settings.mode === 'relaxed' ? 'land' : 'hard-drop');
  return dispatch(kind);
}

for (const button of document.querySelectorAll('[data-action]')) button.addEventListener('click', () => activateAction(button.dataset.action));
for (const button of document.querySelectorAll('[data-floor]')) button.addEventListener('click', () => dispatch('set-floor-override', { floor: button.dataset.floor }));
$('#cancel-floor').addEventListener('click', () => dispatch('cancel-floor-override'));
$('#apply-floor').addEventListener('click', () => activateAction('apply-floor'));
$('#new').addEventListener('click', () => newGame()); $('#restart').addEventListener('click', () => newGame(true));
$('#level').addEventListener('change', () => { $('#lesson').value = ''; $('#pending').hidden = false; syncSetup(); writePreferences(); });
$('#lesson').addEventListener('change', () => { $('#level').value = ''; $('#pending').hidden = false; syncSetup(); writePreferences(); });
$('#preset').addEventListener('change', () => { const size = presetSize($('#preset').value); if (size) { $('#width').value = size[0]; $('#height').value = size[1]; } changedSettings(); writePreferences(); });
$('#mode').addEventListener('change', () => { $('#level').value = ''; $('#lesson').value = ''; syncSetup(); changedSettings(); writePreferences(); });
for (const selector of ['#colours','#schedule','#impact','#width','#height']) $(selector).addEventListener('change', () => { if (selector === '#width' || selector === '#height') $('#preset').value = 'custom'; changedSettings(); writePreferences(); });
$('#width').addEventListener('input', changedSettings); $('#height').addEventListener('input', changedSettings);
$('#material').addEventListener('change', () => { boardKey = ''; render(true); writePreferences(); });
$('#motion').addEventListener('change', event => { document.documentElement.dataset.motion = event.target.checked ? 'reduced' : 'full'; writePreferences(); });
$('#animations').checked = animationEnabled(); $('#animations').addEventListener('change', event => setAnimations(event.target.checked));
$('#sound').checked = soundEnabled(); $('#sound').addEventListener('change', event => { setSound(event.target.checked); writePreferences(); });
document.addEventListener('pointerdown', unlockSound); document.addEventListener('keydown', unlockSound);

const keypad = { Numpad4: 'ArrowLeft', Numpad6: 'ArrowRight', Numpad7: 'z', Numpad9: 'x', Numpad5: 'ArrowDown', Numpad2: 'Space' };
document.addEventListener('keydown', event => {
  const target = event.target instanceof HTMLElement ? event.target : null;
  const inGame = target?.closest('.game-screen') || document.activeElement === document.body;
  if (!inGame || target?.closest('input,select,textarea,[contenteditable]:not([contenteditable="false"])')) return;
  if(target?.closest('.well-scroll')&&['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(event.key))return;
  const key = keypad[event.code] ?? event.key;
  let action;
  if (key === 'ArrowLeft') action = 'left';
  else if (key === 'ArrowRight') action = 'right';
  else if (key === 'ArrowDown') action = game.settings.mode === 'arcade' ? 'soft-drop' : null;
  else if (key === 'ArrowUp' || key.toLowerCase?.() === 'x') action = 'rotate-clockwise';
  else if (key.toLowerCase?.() === 'z') action = 'rotate-anticlockwise';
  else if (key === ' ' || key === 'Space') action = game.settings.mode === 'relaxed' ? 'land' : 'hard-drop';
  else if (key === 'Escape' || key.toLowerCase?.() === 'p') action = game.phase === 'paused' ? 'resume' : 'pause';
  if (!action) return;
  if ((key === ' ' || key === 'Space') && target?.closest('button')) return;
  event.preventDefault();
  if (event.repeat && !['left','right','soft-drop'].includes(action)) return;
  dispatch(action);
});
$('.game-screen').addEventListener('dragstart', event => event.preventDefault());
for(const button of document.querySelectorAll('[data-scroll]'))button.addEventListener('click',()=>{const area=$('.well-scroll');area.scrollTop=button.dataset.scroll==='top'?0:area.scrollHeight;updateBoardScroll();});
$('.well-scroll').addEventListener('scroll',updateBoardScroll,{passive:true});
window.addEventListener('blur', () => { if (game?.settings.mode === 'arcade' && !['paused','won','lost','finished'].includes(game.phase)) dispatch('pause'); save(); });
document.addEventListener('visibilitychange', () => { if (document.hidden && game?.settings.mode === 'arcade' && !['paused','won','lost','finished'].includes(game.phase)) dispatch('pause'); });
window.addEventListener('pagehide', () => { clearTimeout(saveTimer); save(); });

populateCampaignSelectors(); readPreferences();
for (const option of $('#preset').options) option.dataset.base = option.textContent;
try {
  const saved = localStorage.getItem(saveKey);
  if (saved) {
    game = decodeGame(saved); startOptions = null;
    selectedLevel = levelManifest.find(level => level.options.seed === game.settings.seed) ?? null;
    selectedLesson = lessonManifest.find(lesson => lesson.options.seed === game.settings.seed) ?? null;
    if(game.settings.goal&&!selectedLevel&&!selectedLesson)throw new Error('Unknown campaign revision');
    $('#level').value = selectedLevel?.id ?? ''; $('#lesson').value = selectedLesson?.id ?? '';
    if (selectedLevel || selectedLesson) syncSetup(); else applySettingsToControls(game.settings);
    syncCampaignControls();
  }
} catch { game = null; }
if (!game) newGame(); else { render(true); if(!['won','lost','finished'].includes(game.phase))$('.game-screen').focus({ preventScroll: true }); }
validateSize(); requestAnimationFrame(animate);
