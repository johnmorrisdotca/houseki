import {test,expect} from '@playwright/test';
import {start,ORIGIN} from './demo.mjs';
import * as chains from '../dist/colour-chains.js';
import * as blocks from '../dist/magnetic-blocks.js';

async function snapshot(page,entry){
 return page.evaluate(async entry=>{window.dispatchEvent(new window.Event('pagehide'));const engine=await import(`./dist/${entry}.js`);return engine.decodeGame(localStorage.getItem(`houseki-${entry}-save`));},entry);
}
async function command(page,entry,action){
 const before=await snapshot(page,entry);
 const key={left:'ArrowLeft',right:'ArrowRight','rotate-clockwise':'ArrowUp','rotate-anticlockwise':'z'}[action.kind];
 if(key){await page.locator('.game-screen').focus();await page.keyboard.press(key);}
 else if(action.kind==='set-floor-override')await page.locator(`[data-floor="${action.floor}"]`).click();
 else await page.locator(`[data-action="${action.kind}"]`).click();
 await expect.poll(async()=>(await snapshot(page,entry)).recording.length).toBeGreaterThan(before.recording.length);
 if(['hard-drop','land','place'].includes(action.kind))await expect.poll(async()=>(await snapshot(page,entry)).phase).not.toMatch(/^(clear-mark|clear-remove|gravity)$/);
}
async function playChains(page,level){
 for(const step of level.witness){let state=await snapshot(page,'colour-chains');
  for(let guard=0;state.active.pivot.x!==step.pivotX&&guard<16;guard++){await command(page,'colour-chains',{kind:state.active.pivot.x<step.pivotX?'right':'left'});state=await snapshot(page,'colour-chains');}
  for(let guard=0;state.active.orientation!==step.orientation&&guard<4;guard++){await command(page,'colour-chains',{kind:'rotate-clockwise'});state=await snapshot(page,'colour-chains');}
  await command(page,'colour-chains',{kind:'hard-drop'});
 }
}
for(const campaign of ['shizen','arashi'])test(`${campaign}: real witnessed play, fixed settings, pending selection, next level and exact recovery`,async({page},testInfo)=>{
 const errors=await start(page);const levels=campaign==='shizen'?chains.shizenLevelManifest:chains.arashiLevelManifest;const level=levels[0];
 await page.goto(`${ORIGIN}/chains.html`);await page.locator('#campaign').selectOption(campaign);await page.locator('#level').selectOption(level.id);await page.locator('#new').click();
 await expect(page.locator('#preset')).toBeDisabled();await expect(page.locator('#nature')).toBeChecked();await expect(page.locator('#nature')).toBeDisabled();await expect(page.locator('#weather')).toBeDisabled();
 let state=await snapshot(page,'colour-chains');expect(state.settings.challengeId).toBe(level.id);expect(state.settings.width).toBe(level.width);
 await page.locator('#campaign').selectOption(campaign==='shizen'?'arashi':'shizen');await page.reload();await expect(page.locator('#campaign')).toHaveValue(campaign);await expect(page.locator('#level')).toHaveValue(level.id);
 const restored=await snapshot(page,'colour-chains');expect(restored.settings).toEqual(state.settings);expect(restored.board).toEqual(state.board);
 await page.screenshot({path:testInfo.outputPath(`${campaign}-campaign.png`),fullPage:true});await page.evaluate(()=>window.scrollTo(0,0));const english=await page.locator('#well').boundingBox();await page.locator('[data-lang="ja"]').click();const japanese=await page.locator('#well').boundingBox();expect(japanese).toEqual(english);await page.locator('[data-lang="en"]').click();await playChains(page,level);await expect(page.locator('#ending-title')).toHaveText('Level complete');
 await expect(page.locator('.controls [data-action]:enabled:visible')).toHaveCount(0);await page.locator('.ending-next').click();await expect(page.locator('#campaign')).toHaveValue(campaign);await expect(page.locator('#level')).toHaveValue(levels[1].id);
 await page.locator('#restart').click();state=await snapshot(page,'colour-chains');expect(state.settings.challengeId).toBe(levels[1].id);expect(state.recording).toHaveLength(0);await page.reload();await expect(page.locator('#level')).toHaveValue(levels[1].id);
 expect(errors).toEqual([]);
});

test('Magnetic Blocks: real witnessed play, fixed goal, pending settings, next level and exact recovery',async({page},testInfo)=>{
 const errors=await start(page);const level=blocks.levelManifest[0];await page.goto(`${ORIGIN}/blocks.html`);await page.locator('#level').selectOption(level.id);await page.locator('#new').click();
 for(const id of ['width','height','colours','schedule','impact'])await expect(page.locator(`#${id}`)).toBeDisabled();
 await page.screenshot({path:testInfo.outputPath('magnetic-blocks-campaign.png'),fullPage:true});const before=await snapshot(page,'magnetic-blocks');expect(before.settings.seed).toBe(level.options.seed);await page.locator('#level').selectOption(blocks.levelManifest[1].id);await page.reload();await expect(page.locator('#level')).toHaveValue(level.id);
 expect((await snapshot(page,'magnetic-blocks')).board).toEqual(before.board);
 for(const action of level.witness)await command(page,'magnetic-blocks',action);
 await expect(page.locator('#ending-title')).toHaveText('Level complete');await expect(page.locator('.controls [data-action]:enabled:visible')).toHaveCount(0);await page.locator('.ending-next').click();await expect(page.locator('#level')).toHaveValue(blocks.levelManifest[1].id);
 await page.locator('#restart').click();expect((await snapshot(page,'magnetic-blocks')).recording).toHaveLength(0);await page.reload();await expect(page.locator('#level')).toHaveValue(blocks.levelManifest[1].id);expect(errors).toEqual([]);
});

for(const campaign of ['shizen','arashi','blocks'])test(`${campaign}: final challenge wins through real controls and remains complete after reload`,async({page})=>{
 const errors=await start(page);const level=(campaign==='blocks'?blocks.levelManifest:campaign==='shizen'?chains.shizenLevelManifest:chains.arashiLevelManifest).at(-1);
 await page.goto(`${ORIGIN}/${campaign==='blocks'?'blocks':'chains'}.html`);
 if(campaign!=='blocks')await page.locator('#campaign').selectOption(campaign);
 await page.locator('#level').selectOption(level.id);await page.locator('#new').click();
 if(campaign==='blocks')for(const action of level.witness)await command(page,'magnetic-blocks',action);
 else await playChains(page,level);
 await expect(page.locator('#ending-title')).toHaveText('Level complete');await expect(page.locator('.controls [data-action]:enabled:visible')).toHaveCount(0);
 await page.reload();await expect(page.locator('#ending-title')).toHaveText('Level complete');await expect(page.locator('#level')).toHaveValue(level.id);await expect(page.locator('.controls [data-action]:enabled:visible')).toHaveCount(0);expect(errors).toEqual([]);
});
