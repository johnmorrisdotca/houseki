// What a player sees and presses on the boards: the rules a level fixes are shown the moment it is chosen and given back
// on leaving it, a big board can be scrolled from the keyboard without moving the piece, Space does what the ghost showed,
// and a board keeps the rows and the square cells it was configured with.
import { serve, ORIGIN } from '../demo.mjs';
import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';

const browser = await chromium.launch();
const open = async (path, lang = 'en', viewport = { width: 1280, height: 900 }) => {
  const page = await browser.newPage({ viewport });
  await serve(page);
  const errors = [];
  page.on('pageerror', (error) => errors.push(String(error)));
  page.on('requestfailed', (request) => errors.push(request.url()));
  await page.goto(`${ORIGIN}/${path}?lang=${lang}`);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.locator('.game-screen .gem:not(.ghost)').first().waitFor();
  return { page, errors };
};
try {
  // Magnetic Blocks: a level or lesson shows its own board, colours and floor at once, and free play comes back.
  for (const lang of ['en', 'ja']) {
    const { page, errors } = await open('blocks.html', lang);
    await page.locator('#preset').selectOption('extraWide');
    await page.locator('#colours').selectOption('6');
    await page.locator('#schedule').selectOption('magnetic');
    await page.locator('#impact').check();
    const level = await page.evaluate(async () => { const m = await import('./dist/magnetic-blocks.js'); return m.levelManifest[3].options; });
    await page.locator('#level').selectOption({ index: 4 });
    assert.match(await page.locator('#preset option:checked').textContent(), new RegExp(`${level.width}\\s*×\\s*${level.height}`), 'the size is the level\'s as soon as it is chosen');
    assert.match(await page.locator('#preset option:checked').textContent(), lang === 'ja' ? /固定/ : /Fixed/);
    for (const id of ['#preset', '#width', '#height', '#colours', '#schedule', '#impact']) assert.equal(await page.locator(id).isDisabled(), true, `${id} is locked while a level is chosen`);
    assert.equal(await page.locator('#colours').inputValue(), String(level.colourCount));
    assert.equal(await page.locator('#schedule').inputValue(), level.schedule.floor);
    assert.equal(await page.locator('#impact').isChecked(), false);
    assert.equal(await page.locator('#well').getAttribute('data-width'), '8', 'the board in play is not relabelled before New');
    await page.locator('#new').click();
    assert.equal(await page.locator('#well').getAttribute('data-width'), String(level.width));
    assert.equal(await page.locator('#well').getAttribute('data-height'), String(level.height));
    assert.equal(await page.locator('#fixed-settings-note').isVisible(), true);
    await page.reload();
    await page.locator('#well').waitFor();
    assert.match(await page.locator('#preset option:checked').textContent(), new RegExp(`${level.width}\\s*×\\s*${level.height}`), 'the fixed rules are still shown after a reload');
    assert.equal(await page.locator('#preset').isDisabled(), true);
    await page.locator('#level').selectOption('');
    assert.equal(await page.locator('#preset').inputValue(), 'extraWide', 'free play gives its own choices back');
    assert.equal(await page.locator('#colours').inputValue(), '6');
    assert.equal(await page.locator('#schedule').inputValue(), 'magnetic');
    assert.equal(await page.locator('#impact').isChecked(), true);
    assert.equal(await page.locator('#preset').isEnabled(), true);
    assert.equal(await page.locator('#well').getAttribute('data-height'), String(level.height), 'and the level in play keeps its board until New');
    await page.locator('#lesson').selectOption({ index: 1 });
    assert.equal(await page.locator('#preset').isDisabled(), true, 'a lesson fixes its rules too');
    assert.match(await page.locator('#preset option:checked').textContent(), /×/);
    await page.locator('#mode').selectOption('arcade');
    assert.equal(await page.locator('#lesson').inputValue(), '', 'choosing a mode leaves the lesson');
    assert.equal(await page.locator('#preset').inputValue(), 'extraWide');
    await page.locator('#new').click();
    assert.equal(await page.locator('#well').getAttribute('data-width'), '16', 'a free game is made from the free choices');
    assert.deepEqual(errors, []);
    await page.close();
  }

  // Magnetic Blocks: in a level Space does what the ghost promised, and the two actions are not the same move.
  {
    const { page, errors } = await open('blocks.html');
    const found = await page.evaluate(async () => {
      const m = await import('./dist/magnetic-blocks.js');
      const board = (transition) => JSON.stringify((transition.state.gravityBoard ?? transition.state.board).map((gem) => gem?.id ?? null));
      for (const level of m.levelManifest) {
        let state = m.createLevel(level.id);
        for (const kind of ['left', 'left', 'rotate-clockwise', 'right', 'right', 'right', 'rotate-anticlockwise', 'left']) {
          state = m.applyAction(state, { kind }).state;
          if (board(m.applyAction(state, { kind: 'land' })) !== board(m.applyAction(state, { kind: 'hard-drop' }))) return { id: level.id, saved: m.encodeGame(state) };
        }
      }
      return null;
    });
    assert.ok(found, 'a level state where a gentle land and a hard drop differ');
    await page.addInitScript((saved) => localStorage.setItem('houseki-magnetic-blocks-save', saved), found.saved);
    await page.reload();
    await page.locator('#well .destination-ghost').first().waitFor();
    assert.equal(await page.locator('#level').inputValue(), found.id);
    const ghost = await page.locator('#well .destination-ghost').evaluateAll((gems) => gems.map((gem) => [Number(gem.dataset.id), Number(gem.closest('[data-cell]').dataset.cell)]).sort((a, b) => a[0] - b[0]));
    await page.locator('.game-screen').focus();
    await page.keyboard.press('Space');
    const placed = await page.evaluate((ids) => ids.map((id) => [id, Number(document.querySelector(`#well .gem[data-id="${id}"]:not(.ghost)`).closest('[data-cell]').dataset.cell)]), ghost.map(([id]) => id));
    assert.deepEqual(placed, ghost, 'the stones land where the ghost showed');
    assert.deepEqual(errors, []);
    await page.close();
  }

  // The three falling players: a big board is a labelled region the keyboard can scroll, and Top / Bottom speak both languages.
  const labels = {};
  for (const [path, preset] of [['index.html', 'deep'], ['chains.html', 'deep'], ['blocks.html', 'deep']]) {
    for (const lang of ['en', 'ja']) {
      const { page, errors } = await open(path, lang);
      const region = page.locator('.well-scroll');
      assert.equal(await region.getAttribute('data-oversized'), 'false');
      assert.equal(await region.getAttribute('tabindex'), null, 'a board that fits is not a place to tab to');
      await page.locator('#preset').selectOption(preset);
      await page.locator('#new').click();
      await page.waitForFunction(() => document.querySelector('.well-scroll').dataset.oversized === 'true');
      assert.equal(await region.getAttribute('role'), 'region');
      assert.equal(await region.getAttribute('tabindex'), '0');
      const name = await region.getAttribute('aria-label');
      assert.ok(name && name.length > 3 && !/scroll position|スクロール位置/.test(name), `the region is named for the board: ${name}`);
      const buttons = await page.locator('.board-nav button').allTextContents();
      (labels[path] ??= {})[lang] = buttons.join('/');
      const before = await page.evaluate(() => [...document.querySelectorAll('#well .gem.active')].map((gem) => gem.dataset.id ?? gem.textContent));
      const column = () => page.evaluate(() => [...document.querySelectorAll('#well .gem.active')].map((gem) => { const cell = gem.closest('[data-cell]') ?? gem.parentElement; return [...cell.parentElement.children].indexOf(cell) % Number(document.querySelector('#well').dataset.width); }));
      const columnBefore = await column();
      await region.focus();
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowRight');
      await page.keyboard.press('ArrowRight');
      await page.waitForFunction(() => document.querySelector('.well-scroll').scrollTop > 0);
      // The browser animates a key's scroll; let it come to rest before the buttons are pressed against it.
      await page.evaluate(() => new Promise((done) => { const area = document.querySelector('.well-scroll'); let last = -1, still = 0; const look = () => { still = area.scrollTop === last ? still + 1 : 0; last = area.scrollTop; if (still >= 6) done(); else requestAnimationFrame(look); }; look(); }));
      assert.deepEqual(await column(), columnBefore, 'arrow keys on the board region scroll it and do not move the piece');
      assert.deepEqual(await page.evaluate(() => [...document.querySelectorAll('#well .gem.active')].map((gem) => gem.dataset.id ?? gem.textContent)), before);
      assert.match(await page.locator('.scroll-position').textContent(), /^\d+%$/);
      assert.match(await page.locator('.scroll-position').getAttribute('aria-label'), lang === 'ja' ? /スクロール位置: \d+%/ : /scroll position: \d+%/i);
      await page.locator('[data-scroll="bottom"]').click();
      await page.waitForFunction(() => /^(9\d|100)%$/.test(document.querySelector('.scroll-position').textContent));
      await page.locator('[data-scroll="top"]').click();
      await page.waitForFunction(() => document.querySelector('.well-scroll').scrollTop === 0);
      assert.deepEqual(errors, []);
      await page.close();
    }
  }
  for (const [path, say] of Object.entries(labels)) assert.notEqual(say.en, say.ja, `${path}: Top / Bottom are translated`);

  // Geometry: a board has the rows and columns it was configured with and square cells, at every size it offers.
  for (const [path, game] of [['index.html', null], ['chains.html', null], ['tools.html', 'gem-swap'], ['tools.html', 'stone-collapse'], ['blocks.html', null]]) {
    const { page, errors } = await open(path, 'en', { width: 1280, height: 1000 });
    if (game) await page.locator('#game').selectOption(game);
    for (const preset of await page.locator('#preset option').evaluateAll((options) => options.map((option) => option.value).filter((value) => !['authored', 'custom'].includes(value)))) {
      await page.locator('#preset').selectOption(preset);
      await page.locator('#new').click();
      await page.waitForTimeout(120);
      const shape = await page.evaluate(() => {
        const board = document.querySelector('#well,#grid');
        const cells = [...board.querySelectorAll('[data-cell]:not(.masked):not(.hidden-row), .cell:not(.hidden-row), .full-cell')];
        const sides = cells.map((cell) => cell.getBoundingClientRect()).map((rect) => [Math.round(rect.width), Math.round(rect.height)]);
        const style = getComputedStyle(board);
        const gems = [...board.querySelectorAll('.gem:not(.ghost):not(.active)')].slice(0, 30).map((gem) => gem.getBoundingClientRect()).map((rect) => Math.abs(rect.width - rect.height));
        return { square: sides.every(([w, h]) => Math.abs(w - h) <= 1), columns: style.gridTemplateColumns.split(' ').length, rows: style.gridTemplateRows.split(' ').length, gemsRound: gems.every((gap) => gap <= 2), count: cells.length };
      });
      assert.equal(shape.square, true, `${path} ${game ?? ''} ${preset}: square cells`);
      assert.equal(shape.gemsRound, true, `${path} ${game ?? ''} ${preset}: stones are as wide as they are tall`);
      assert.equal(shape.count % shape.columns, 0, `${path} ${game ?? ''} ${preset}: whole rows`);
      assert.ok(shape.rows >= shape.count / shape.columns, `${path} ${game ?? ''} ${preset}: every row is drawn`);
    }
    assert.deepEqual(errors, []);
    await page.close();
  }
  console.log('PASS level rules shown and given back, the preview matches Space, big boards scroll from the keyboard in both languages, square cells at every size');
} finally {
  await browser.close();
}
