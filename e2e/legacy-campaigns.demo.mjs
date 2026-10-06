import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
import {start,ORIGIN} from './demo.mjs';
const fixtures=JSON.parse(readFileSync(new URL('../test/fixtures/campaign-v1-saves.json',import.meta.url),'utf8'));
async function savedState(page,entry){return page.evaluate(async entry=>{window.dispatchEvent(new window.Event('pagehide'));const engine=await import(`./dist/${entry}.js`);return engine.decodeGame(localStorage.getItem(`houseki-${entry}-save`));},entry);}
for(const fixture of fixtures)test(`${fixture.campaign}: published level ${fixture.number} opens its original save and restarts the same puzzle`,async({page})=>{
 const errors=await start(page),entry=fixture.campaign==='blocks'?'magnetic-blocks':'colour-chains';
 await page.addInitScript(({entry,encoded})=>localStorage.setItem(`houseki-${entry}-save`,encoded),{entry,encoded:fixture.encoded});
 await page.goto(`${ORIGIN}/${fixture.campaign==='blocks'?'blocks':'chains'}.html`);
 await expect(page.locator('#level')).toHaveValue(fixture.id);
 if(fixture.campaign!=='blocks')await expect(page.locator('#campaign')).toHaveValue(fixture.campaign);
 let state=await savedState(page,entry);expect(state.settings).toEqual(fixture.expectedSettings);expect(state.board).toEqual(fixture.expectedBoard);expect(state.recording).toEqual(fixture.expectedRecording);
 await page.locator('#restart').click();state=await savedState(page,entry);expect(state.settings).toEqual(fixture.initialSettings);expect(state.board).toEqual(fixture.initialBoard);expect(state.recording).toHaveLength(0);
 await page.reload();await expect(page.locator('#level')).toHaveValue(fixture.id);state=await savedState(page,entry);expect(state.settings).toEqual(fixture.initialSettings);expect(state.board).toEqual(fixture.initialBoard);expect(errors).toEqual([]);
});
