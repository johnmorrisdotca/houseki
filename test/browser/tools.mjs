import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
const server = spawn(process.execPath, ['scripts/serve.mjs'], { env: { ...process.env, PORT: '0' }, stdio: ['ignore', 'pipe', 'pipe'] });
const url = await new Promise((resolve, reject) => {
 const timeout = setTimeout(() => { server.kill(); reject(new Error('Demo server startup timed out')); }, 10000);
 server.on('error', error => { clearTimeout(timeout); reject(error); });
 server.stdout.on('data', data => { const found = String(data).match(/http:\/\/127\.0\.0\.1:\d+/); if(found) { clearTimeout(timeout); resolve(found[0]); } });
 server.on('exit', code => { clearTimeout(timeout); reject(new Error(`Demo server exited: ${code}`)); });
});
let browser;
try { browser = await chromium.launch(); } catch(error) { server.kill(); throw error; }
try{
 for(const viewport of [{width:1280,height:900},{width:390,height:844}]){
  const page=await browser.newPage({viewport});const errors=[];page.on('pageerror',e=>errors.push(String(e)));
  await page.goto(`${url}/tools.html`);await page.waitForSelector('[data-cell] .gem');
  for(const mode of ['gem-swap','stone-collapse']){
   await page.locator('#game').selectOption(mode);await page.locator('#new').click();
   const bomb=page.locator('[data-tool="bomb"]');assert.match(await bomb.textContent(),/× 1/);
   const boardBefore=await page.locator('#grid').innerHTML();const scoreBefore=await page.locator('#score').textContent();
   await bomb.click();assert.equal(await bomb.getAttribute('aria-pressed'),'true');
   await page.locator('[data-cell="0"]').click();assert.equal(await page.locator('.full-cell.preview').count(),4);
   assert.equal(await page.locator('#confirm').isEnabled(),true);
   if(viewport.width===390) { const box=await page.locator('#confirm').boundingBox();assert.ok(box.y+box.height<=viewport.height,'phone confirmation remains beside the visible board'); }
   await page.locator('#cancel').click();assert.equal(await page.locator('.full-cell.preview').count(),0);
   assert.match(await bomb.textContent(),/× 1/);assert.equal(await page.locator('#score').textContent(),scoreBefore);
   await bomb.click();await page.locator('[data-cell="0"]').click();
   await page.locator('#confirm').click();assert.match(await bomb.textContent(),/× 0/);
   await page.waitForFunction(()=>document.querySelector('#status').textContent!=='Resolving…');
   assert.ok(Number(await page.locator('#score').textContent())>=40);
   assert.equal(await page.locator('#assisted').isVisible(),true);
   if(mode==='stone-collapse'){
    await page.locator('#undo').click();assert.match(await bomb.textContent(),/× 1/);assert.equal(await page.locator('#score').textContent(),scoreBefore);assert.equal(await page.locator('#assisted').isVisible(),true);
    await page.locator('[data-tool="pick"]').click();await page.locator('[data-cell="0"]').focus();await page.keyboard.press('Enter');assert.equal(await page.locator('.full-cell.preview').count(),1);await page.keyboard.press('Escape');assert.equal(await page.locator('.full-cell.preview').count(),0);
   }
   await page.locator('#restart').click();assert.equal(await page.locator('#score').textContent(),'0');assert.match(await bomb.textContent(),/× 1/);
   const box=await page.locator('#grid').boundingBox();assert.ok(box.x>=0&&box.x+box.width<=viewport.width);
   assert.equal(await page.evaluate(()=>getComputedStyle(document.querySelector('.gem')).userSelect),'none');
   assert.notEqual(await page.evaluate(()=>getComputedStyle(document.querySelector('aside p')).userSelect),'none');
   await page.locator('#language').click();assert.equal(await page.locator('#tools-title').textContent(),'道具箱');await page.locator('#language').click();
  }
  await page.locator('#animations').uncheck();await page.reload();assert.equal(await page.locator('#animations').isChecked(),false);
  await page.goto(`${url}/`);assert.equal(await page.locator('#animations').isChecked(),false);
  await page.locator('#animations').check();await page.goto(`${url}/tools.html`);assert.equal(await page.locator('#animations').isChecked(),true);
  await page.locator('#code').fill('black-hole-browser');await page.locator('#advanced').check();await page.locator('#new').click();
  async function ordinarySwap(){
   const move=await page.evaluate(async()=>{
    const module=await import('./dist/gem-swap.js');const grid=document.querySelector('#grid');
    const cells=[...grid.children];const width=Number(grid.getAttribute('aria-colcount'));const height=Number(grid.getAttribute('aria-rowcount'));
    const base=module.createGame({width,height,tools:true,advancedTools:true,seed:'inspection'});
    const board=cells.map(cell=>cell.dataset.gemId?{id:Number(cell.dataset.gemId),colour:cell.dataset.colour,...(cell.dataset.kind?{kind:cell.dataset.kind}:{})}:null);
    return module.legalActions({...base,board}).find(action=>action.kind==='swap');
   });
   assert.ok(move,'a legal ordinary swap exists');await page.locator(`[data-cell="${move.from}"]`).click();await page.locator(`[data-cell="${move.to}"]`).click();
   await page.waitForFunction(()=>document.querySelector('#grid').dataset.phase==='ready');
  }
  for(let i=0;i<6;i++)await ordinarySwap();
  const portalTool=page.locator('[data-tool="black-hole"]');assert.match(await portalTool.textContent(),/× 1/);
  await portalTool.click();await page.locator('[data-cell="0"]').click();assert.equal(await page.locator('.full-cell.preview').count(),3);
  await page.locator('#confirm').click();await page.waitForFunction(()=>document.querySelector('#grid').dataset.phase==='ready');
  assert.equal(await page.locator('.portal').count(),1);assert.match(await portalTool.textContent(),/× 0/);
  assert.match(await page.locator('#portal-state').textContent(),/5\/8/);
  await ordinarySwap();await ordinarySwap();assert.equal(await page.locator('.portal').count(),0);
  await page.emulateMedia({reducedMotion:'reduce'});await page.locator('#restart').click();await ordinarySwap();
  assert.equal(await page.evaluate(()=>document.querySelector('#grid').getAnimations({subtree:true}).length),0);
  await page.emulateMedia({reducedMotion:'no-preference'});await page.locator('#advanced').uncheck();
  for(const mode of ['gem-swap','stone-collapse']) for(const shape of ['heart','star','hexagon']) {
   await page.locator('#game').selectOption(mode);await page.locator('#shape').selectOption(shape);await page.locator('#new').click();
   await page.locator('[data-cell] .gem').first().waitFor();const box=await page.locator('#grid').boundingBox();assert.ok(box.x>=0&&box.x+box.width<=viewport.width);
  }
  assert.deepEqual(errors,[]);await page.close();
 }
 console.log('PASS both game trays desktop/phone: corner preview, cancel without cost, confirmed spend/effect, sticky assistance, undo/restart, keyboard target/cancel, translations, bounds and non-selectable gems');
}finally{await browser.close();server.kill();}
