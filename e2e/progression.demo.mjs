import {test,expect} from '@playwright/test';
import {start,ORIGIN} from './demo.mjs';
import * as chains from '../dist/colour-chains.js';
import * as blocks from '../dist/magnetic-blocks.js';
const counts=[32,32,32,24,8],english=['Entry level','Easy','Intermediate','Hard','Expert'],japanese=['入門','初級','中級','上級','最上級'];
for(const campaign of ['shizen','arashi','blocks'])test(`${campaign}: all 128 levels display measured scores in five bilingual groups`,async({page})=>{
 const errors=await start(page);const levels=campaign==='blocks'?blocks.levelManifest:campaign==='shizen'?chains.shizenLevelManifest:chains.arashiLevelManifest;
 await page.goto(`${ORIGIN}/${campaign==='blocks'?'blocks':'chains'}.html`);if(campaign!=='blocks')await page.locator('#campaign').selectOption(campaign);
 await expect(page.locator('#level option')).toHaveCount(129);await expect(page.locator('#level optgroup')).toHaveCount(5);
 expect(await page.locator('#level optgroup').evaluateAll(groups=>groups.map(group=>group.label))).toEqual(english);expect(await page.locator('#level optgroup').evaluateAll(groups=>groups.map(group=>group.children.length))).toEqual(counts);
 for(const number of [1,33,65,97,121,128]){const level=levels[number-1];await page.locator('#level').selectOption(level.id);await page.locator('#new').click();await expect(page.locator('#level')).toHaveValue(level.id);const goal=level.options?.goal??level.goal;if(goal.kind==='clear-targets')await expect(page.locator('#well .gem.goal-target:not(.ghost)')).toHaveCount(goal.targetIds.length);await expect(page.locator(`#level option[value="${level.id}"]`)).toHaveText(`${level.number} · ${level.score}/100 · ${level.title.en}`);}
 await page.locator('[data-lang="ja"]').click();expect(await page.locator('#level optgroup').evaluateAll(groups=>groups.map(group=>group.label))).toEqual(japanese);await expect(page.locator('#level')).toHaveValue(levels[127].id);
 await page.reload();await expect(page.locator('#level')).toHaveValue(levels[127].id);expect(errors).toEqual([]);
});
