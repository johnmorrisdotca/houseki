import {serve,ORIGIN} from '../demo.mjs';
import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';

const url=ORIGIN;const browser=await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });await serve(page);
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  page.on('requestfailed', request => errors.push(`Failed resource: ${request.url()}`));
  await page.goto(`${url}/tools.html`);
  await page.waitForSelector('#grid .full-cell');
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  await page.locator('#game').selectOption('gem-swap');
  const firstLevel = await page.evaluate(async () => (await import('./dist/gem-swap.js')).GEM_SWAP_CAMPAIGN.find(level => level.number === 1).id);
  const level20 = await page.evaluate(async () => (await import('./dist/gem-swap.js')).GEM_SWAP_CAMPAIGN.find(level => level.number === 20).id);
  await page.locator('#level').selectOption(firstLevel);
  await page.locator('#new').click();
  const activeBeforePendingSelection = await page.locator('#objectives').innerHTML();
  await page.locator('#level').selectOption(level20);
  assert.equal(await page.locator('#objectives').innerHTML(), activeBeforePendingSelection, 'pending level does not relabel active objective');
  assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('houseki-gem-swap-ui')).content.id), firstLevel, 'pending level does not overwrite active save context');
  await page.locator('#mode').selectOption('daily');
  assert.equal(await page.locator('#objectives').innerHTML(), activeBeforePendingSelection, 'pending mode does not relabel active objective');
  assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('houseki-gem-swap-ui')).content.id), firstLevel, 'pending mode does not overwrite active save context');
  await page.locator('#new').click();
  assert.equal(await page.evaluate(async () => (await import('./dist/gem-swap.js')).decodeGame(localStorage.getItem('houseki-gem-swap-save')).mode), 'daily');

  await page.locator('#mode').selectOption('relaxed');
  await page.locator('#preset').selectOption('extraWide');
  await page.locator('#colours').selectOption('4');
  await page.locator('#code').fill('recovery-free-board');
  await page.locator('#tools').check();
  await page.locator('#advanced').check();
  const reusedSeedLevels = await page.evaluate(async () => {
    const { GEM_SWAP_CAMPAIGN } = await import('./dist/gem-swap.js');
    return [20, 24].map(number => GEM_SWAP_CAMPAIGN.find(level => level.number === number).id);
  });
  for (const id of reusedSeedLevels) {
    await page.locator('#level').selectOption(id);
    assert.equal(await page.locator('#mode').inputValue(), 'challenge');
    assert.equal(await page.locator('#preset').inputValue(), 'authored');
    assert.equal(await page.locator('#preset').isDisabled(), true);
    assert.equal(await page.locator('#colours').inputValue(), '5');
    assert.equal(await page.locator('#colours').isDisabled(), true);
    await page.locator('#new').click();
    await page.reload();
    assert.equal(await page.locator('#level').inputValue(), id, `level identity restored: ${id}`);
    assert.equal(await page.locator('#lesson').inputValue(), '');
    assert.equal(await page.locator('#mode').inputValue(), 'challenge');
    assert.equal(await page.locator('#preset').inputValue(), 'authored');
    assert.match(await page.locator('#preset option:checked').textContent(), /6\s*×\s*6/);
    await page.locator('#new').click();
    const levelMatches = await page.evaluate(async () => {
      const engine = await import('./dist/gem-swap.js');
      const state = engine.decodeGame(localStorage.getItem('houseki-gem-swap-save'));
      return engine.GEM_SWAP_CAMPAIGN.find(level => level.id === document.querySelector('#level').value).challenge.goals.every(goal => state.challenge.goals.some(actual => JSON.stringify(actual) === JSON.stringify(goal)));
    });
    assert.equal(levelMatches, true);
  }
  await page.locator('#mode').selectOption('daily');
  assert.equal(await page.locator('#level').inputValue(), '');
  assert.equal(await page.locator('#lesson').inputValue(), '');
  await page.locator('#new').click();
  assert.equal(await page.evaluate(async () => (await import('./dist/gem-swap.js')).decodeGame(localStorage.getItem('houseki-gem-swap-save')).mode), 'daily');
  await page.locator('#mode').selectOption('relaxed');
  await page.locator('#preset').selectOption('extraWide');
  await page.locator('#colours').selectOption('4');
  await page.locator('#shape').selectOption('star');
  await page.locator('#code').fill('restored-free-settings');
  await page.locator('#mode').selectOption('daily');
  assert.equal(await page.locator('#mode').inputValue(), 'daily');
  assert.equal(await page.locator('#preset').inputValue(), 'authored');
  assert.equal(await page.locator('#preset').isDisabled(), true);
  assert.match(await page.locator('#preset option:checked').textContent(), /Daily · \d+ × \d+/);
  assert.equal(await page.locator('#colours').isDisabled(), true);
  assert.equal(await page.locator('#tools').isDisabled(), true);
  assert.equal(await page.locator('#advanced').isDisabled(), true);
  await page.locator('#new').click();
  await page.reload();
  assert.equal(await page.locator('#mode').inputValue(), 'daily');
  assert.equal(await page.locator('#preset').inputValue(), 'authored');
  const dailyContext = await page.evaluate(() => JSON.parse(localStorage.getItem('houseki-gem-swap-ui')));
  assert.equal(dailyContext.mode, 'daily');
  assert.equal(dailyContext.freePreferences.preset, 'extraWide');
  assert.equal(dailyContext.freePreferences.shape, 'star');
  assert.equal(dailyContext.freePreferences.code, 'restored-free-settings');
  await page.locator('#mode').selectOption('relaxed');
  assert.equal(await page.locator('#preset').inputValue(), 'extraWide');
  assert.equal(await page.locator('#shape').inputValue(), 'star');
  assert.equal(await page.locator('#colours').inputValue(), '4');
  assert.equal(await page.locator('#code').inputValue(), 'restored-free-settings');
  await page.locator('#level').selectOption(reusedSeedLevels[0]);
  assert.equal(await page.locator('#preset').inputValue(), 'authored');
  await page.locator('#level').selectOption('');
  assert.equal(await page.locator('#mode').inputValue(), 'relaxed');
  assert.equal(await page.locator('#preset').inputValue(), 'extraWide');
  assert.equal(await page.locator('#shape').inputValue(), 'star');
  assert.equal(await page.locator('#colours').inputValue(), '4');
  assert.equal(await page.locator('#code').inputValue(), 'restored-free-settings');
  assert.equal(await page.locator('#tools').isEnabled(), true);

  for (const game of ['gem-swap', 'stone-collapse']) {
    await page.locator('#game').selectOption(game);
    await page.locator('#mode').selectOption('relaxed');
    const lessons = await page.evaluate(async gameName => {
      const module = await import(`./dist/${gameName}.js`);
      const list = module.GEM_SWAP_LESSONS ?? module.tutorialManifest;
      return list.map(lesson => lesson.id);
    }, game);
    for (const id of lessons) {
      await page.locator('#lesson').selectOption(id);
      const activeGuide = await page.locator('#lesson-guide').textContent();
      const activeGuideHidden = await page.locator('#lesson-guide').isHidden();
      const activeUiContent = await page.evaluate(gameName => JSON.parse(localStorage.getItem(`houseki-${gameName}-ui`))?.content?.id ?? null, game);
      const anotherLesson = lessons.find(candidate => candidate !== id);
      if (anotherLesson) {
        await page.locator('#lesson').selectOption(anotherLesson);
        assert.equal(await page.locator('#lesson-guide').textContent(), activeGuide, 'pending lesson does not replace active guide');
        assert.equal(await page.locator('#lesson-guide').isHidden(), activeGuideHidden, 'pending lesson does not change active guide visibility');
        assert.equal(await page.evaluate(gameName => JSON.parse(localStorage.getItem(`houseki-${gameName}-ui`))?.content?.id ?? null, game), activeUiContent, 'pending lesson does not overwrite active save context');
        await page.locator('#lesson').selectOption(id);
      }
      await page.locator('#new').click();
      assert.equal(await page.locator('#lesson-guide').isVisible(), true);
      await page.reload();
      assert.equal(await page.locator('#lesson').inputValue(), id, `${game} lesson identity restored: ${id}`);
      assert.equal(await page.locator('#lesson-guide').isVisible(), true);
      assert.ok((await page.locator('#lesson-guide').textContent()).trim().length > 10);
      await page.locator('#restart').click();
      assert.equal(await page.locator('#lesson-guide').isVisible(), true);
      await page.locator('#mode').selectOption('arcade');
      assert.equal(await page.locator('#lesson').inputValue(), '');
      assert.equal(await page.locator('#level').inputValue(), '');
      await page.locator('#new').click();
      assert.equal(await page.evaluate(async gameName => {
        const module = await import(`./dist/${gameName}.js`);
        const state = module.decodeGame(localStorage.getItem(`houseki-${gameName}-save`));
        return state.mode ?? state.settings.mode;
      }, game), 'arcade');
    }
  }

  for (const [game, preset, seed] of [['gem-swap', 'large', 'persist-gem-seed'], ['stone-collapse', 'deep', 'persist-stone-seed']]) {
    await page.locator('#game').selectOption(game);
    await page.locator('#mode').selectOption('relaxed');
    await page.locator('#preset').selectOption(preset);
    await page.locator('#shape').selectOption('');
    await page.locator('#colours').selectOption('6');
    await page.locator('#code').fill(seed);
    await page.locator('#new').click();
    await page.reload();
    assert.equal(await page.locator('#preset').inputValue(), preset);
    assert.equal(await page.locator('#shape').inputValue(), '');
    assert.equal(await page.locator('#colours').inputValue(), '6');
    assert.equal(await page.locator('#code').inputValue(), seed);
  }

  await page.locator('#game').selectOption('gem-swap');
  const gemFirst = await page.evaluate(async () => (await import('./dist/gem-swap.js')).GEM_SWAP_CAMPAIGN[0]);
  await page.locator('#level').selectOption(gemFirst.id);
  await page.locator('#new').click();
  const gemMove = gemFirst.witness.find(operation => operation.kind === 'action').action;
  await page.locator(`[data-cell="${gemMove.from}"]`).click();
  await page.locator(`[data-cell="${gemMove.to}"]`).click();
  await page.waitForFunction(() => document.querySelector('#grid').dataset.phase === 'finished');
  await page.waitForTimeout(600);
  await assertTerminalControls(page, 'gem-swap');

  await page.locator('#game').selectOption('stone-collapse');
  const stoneFirst = await page.evaluate(async () => (await import('./dist/stone-collapse.js')).levelManifest[0]);
  await page.locator('#level').selectOption(stoneFirst.id);
  await page.locator('#new').click();
  for (const ids of stoneFirst.witness) {
    await page.locator(`[data-gem-id="${ids[0]}"]`).click();
    await page.locator('#confirm').click();
    await page.waitForFunction(() => ['ready', 'won', 'lost', 'finished'].includes(document.querySelector('#grid').dataset.phase));
  }
  assert.equal(await page.locator('#grid').getAttribute('data-phase'), 'won');
  await page.waitForTimeout(600);
  await assertTerminalControls(page, 'stone-collapse');
  assert.deepEqual(errors, []);
  await page.close();
  console.log('PASS full-board recovery: reused-seed levels, all six lessons, settings restore, mode clearing, terminal action controls, BASE_PATH=/houseki');
} finally {
  await browser.close();
  
}

async function assertTerminalControls(page, game) {
  const legal = await page.evaluate(async gameName => {
    const module = await import(`./dist/${gameName}.js`);
    const state = module.decodeGame(localStorage.getItem(`houseki-${gameName}-save`));
    return module.legalActions(state);
  }, game);
  const kinds = legal.map(action => action.kind);
  assert.equal(await page.locator('#confirm').isEnabled(), kinds.includes('confirm') || kinds.includes('confirm-tool'));
  assert.equal(await page.locator('#cancel').isEnabled(), kinds.includes('cancel') || kinds.includes('cancel-tool'));
  assert.equal(await page.locator('#undo').isVisible(), kinds.includes('undo'));
  if (kinds.includes('undo')) assert.equal(await page.locator('#undo').isEnabled(), true);
  assert.equal(await page.locator('#hint').isVisible(), kinds.includes('hint'));
  assert.equal(await page.locator('#reshuffle').isVisible(), kinds.includes('reshuffle'));
  for (const button of await page.locator('#inventory [data-tool]').all()) {
    const tool = await button.getAttribute('data-tool');
    assert.equal(await button.isEnabled(), legal.some(action => action.kind === 'select-tool' && action.tool === tool));
  }
  assert.equal(await page.locator('#grid .full-cell:not(:disabled)').count(), 0);
}
