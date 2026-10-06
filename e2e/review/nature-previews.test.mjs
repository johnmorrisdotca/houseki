import {serve,ORIGIN} from '../demo.mjs';
import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';

const url=ORIGIN;const browser=await chromium.launch();
try{
 const page=await browser.newPage({viewport:{width:390,height:844}});await serve(page);
 await page.goto(`${url}/chains.html`);
 await page.waitForSelector('#well .active');
 await page.evaluate(()=>localStorage.clear());await page.reload();
 await page.locator('#preset').selectOption('extraWide');await page.locator('#colours').selectOption('6');await page.locator('#nature').check();await page.locator('#weather').selectOption('frequent');
 const authored=await page.evaluate(async()=>{const m=await import('./dist/colour-chains.js');const level=m.levelManifest[4];return{id:level.id,width:level.width,height:level.height,colourCount:level.colourCount};});
 await page.locator('#level').selectOption(authored.id);
 assert.equal(await page.locator('#mode').inputValue(),'challenge');
 assert.equal(await page.locator('#preset').isDisabled(),true);assert.equal(await page.locator('#colours').isDisabled(),true);assert.equal(await page.locator('#nature').isDisabled(),true);assert.equal(await page.locator('#weather').isDisabled(),true);
 assert.match(await page.locator('#preset option:checked').textContent(),new RegExp(`${authored.width}\\s*×\\s*${authored.height}`));
 await page.locator('#mode').selectOption('arcade');
 assert.equal(await page.locator('#level').inputValue(),'');assert.equal(await page.locator('#lesson').inputValue(),'');assert.equal(await page.locator('#mode').inputValue(),'arcade');
 assert.equal(await page.locator('#preset').inputValue(),'extraWide');assert.equal(await page.locator('#colours').inputValue(),'6');assert.equal(await page.locator('#nature').isChecked(),true);assert.equal(await page.locator('#weather').inputValue(),'frequent');
 await page.locator('#nature').check();await page.locator('#new').click();
 for(let attempt=0;attempt<5;attempt++){
  await page.locator('[data-action="left"]').click();await page.waitForTimeout(70);
  const rebound=await page.evaluate(async()=>{const m=await import('./dist/colour-chains.js');const state=m.decodeGame(localStorage.getItem('houseki-colour-chains-save'));return Boolean(m.powerDropPreview(state)?.rebound);});
  if(rebound)break;
 }
 await page.locator('[data-action="pause"]').click();await page.waitForTimeout(400);
 const naturePreview=await page.evaluate(async()=>{
  const m=await import('./dist/colour-chains.js');const state=m.decodeGame(localStorage.getItem('houseki-colour-chains-save'));const preview=m.powerDropPreview(state);
  const actual=[...document.querySelectorAll('#well .power-drop-ghost')].map(gem=>({id:Number(gem.dataset.id),index:Number(gem.closest('[data-cell]').dataset.cell)})).sort((a,b)=>a.id-b.id);
  const offsets={up:[0,-1],right:[1,0],down:[0,1],left:[-1,0]};const [dx,dy]=offsets[state.active.orientation];const active=state.active.gems.map((gem,i)=>({id:gem.id,x:state.active.pivot.x+(i?dx:0),y:state.active.pivot.y+(i?dy:0)}));
  const resumed=m.applyAction(state,{kind:'resume'}).state;const dropped=m.applyAction(resumed,{kind:'hard-drop'}).state;const projected=dropped.gravityBoard??dropped.board;const ids=new Set(state.active.gems.map(gem=>gem.id));const expected=projected.flatMap((gem,index)=>gem&&ids.has(gem.id)&&!active.some(piece=>(piece.y+3)*state.settings.width+piece.x===index)?[{id:gem.id,index}]:[]).sort((a,b)=>a.id-b.id);
  return {rebound:preview.rebound,actual,expected};
 });
 assert.equal(naturePreview.rebound,true,'the fixture exercises an actual one-cell Shizen rebound');assert.deepEqual(naturePreview.actual,naturePreview.expected);
 await page.locator('#mode').selectOption('relaxed');await page.locator('#new').click();await page.waitForTimeout(350);
 assert.equal(await page.locator('#well .power-drop-ghost').count(),0,'gentle Place does not advertise a rebound');
 await page.locator('#mode').selectOption('daily');
 assert.equal(await page.locator('#preset').isDisabled(),true);assert.equal(await page.locator('#colours').isDisabled(),true);assert.equal(await page.locator('#nature').isDisabled(),true);assert.equal(await page.locator('#weather').isDisabled(),true);assert.match(await page.locator('#preset option:checked').textContent(),/6\s*×\s*12/);
 await page.locator('#new').click();
 assert.equal(await page.locator('#run-progress').isVisible(),true);assert.equal(await page.locator('#run-progress-count').textContent(),'0 / 60');assert.equal(await page.locator('#run-progress-bar').getAttribute('max'),'60');
 await page.reload();await page.waitForSelector('#well');assert.equal(await page.locator('#mode').inputValue(),'daily');assert.equal(await page.locator('#colours').inputValue(),'4');assert.equal(await page.locator('#preset').isDisabled(),true);assert.equal(await page.locator('#nature').isDisabled(),true);assert.match(await page.locator('#preset option:checked').textContent(),/6\s*×\s*12/);

 await page.goto(`${url}/blocks.html`);await page.evaluate(()=>localStorage.clear());await page.reload();await page.locator('#new').click();await page.waitForTimeout(400);
 const projected=await page.evaluate(async()=>{const m=await import('./dist/magnetic-blocks.js');const state=m.decodeGame(localStorage.getItem('houseki-magnetic-blocks-save'));const result=m.applyAction(state,{kind:state.settings.mode==='relaxed'?'land':'hard-drop'});const board=result.state.gravityBoard??result.state.board;const ids=new Set(state.active.gems.map(gem=>gem.id));return board.flatMap((gem,index)=>gem&&ids.has(gem.id)?[{id:gem.id,index}]:[]).sort((a,b)=>a.id-b.id);});
 const visibleProjection=await page.locator('#well .destination-ghost').evaluateAll(gems=>gems.map(gem=>({id:Number(gem.dataset.id),index:Number(gem.closest('[data-cell]').dataset.cell)})).sort((a,b)=>a.id-b.id));
 assert.deepEqual(visibleProjection,projected,'the Magnetic Blocks ghost marks the selected floor’s actual settled destinations');
 assert.equal(await page.locator('#placed').textContent(),'0');assert.equal(await page.locator('#piece-limit').textContent(),'200');assert.equal(await page.locator('#placement-progress').getAttribute('max'),'200');
 await page.locator('#preset').selectOption('large');await page.locator('#new').click();await page.waitForTimeout(100);
 assert.equal(await page.locator('.board-nav').isVisible(),true);const scroller=page.locator('.well-scroll');await scroller.focus();await page.keyboard.press('ArrowDown');await page.waitForFunction(()=>document.querySelector('.well-scroll').scrollTop>0);
 assert.ok(await scroller.evaluate(area=>area.scrollTop)>0,'focused board region scrolls with arrow keys');
 await page.locator('[data-scroll="bottom"]').click();assert.ok(await scroller.evaluate(area=>area.scrollTop)>0);assert.match(await page.locator('.scroll-position').textContent(),/%/);
 await page.locator('[data-scroll="top"]').click();assert.equal(await scroller.evaluate(area=>area.scrollTop),0);

 const lostSave=await page.evaluate(async()=>{const m=await import('./dist/magnetic-blocks.js');const width=8,height=16;const initialBoard=Array.from({length:width*height},(_,index)=>({id:index+1,colour:(index%width+Math.floor(index/width))%2?'red':'blue'}));return m.encodeGame(m.createGame({width,height,colourCount:4,initialBoard,seed:'terminal-controls'}));});
 await page.addInitScript(encoded=>localStorage.setItem('houseki-magnetic-blocks-save',encoded),lostSave);await page.reload();
 assert.equal(await page.locator('#well').getAttribute('data-phase'),'lost');assert.equal(await page.locator('.controls [data-action="left"]').isDisabled(),true);assert.equal(await page.locator('[data-floor="calm"]').isDisabled(),true);assert.equal(await page.locator('#new').isDisabled(),false);assert.equal(await page.locator('#restart').isDisabled(),false);
 console.log('Nature previews, authored settings, oversized-board navigation, and terminal controls passed.');
}finally{await browser.close();}
