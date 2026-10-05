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
  for(const mode of ['gem-swap','stone-collapse']) for(const shape of ['heart','star','hexagon']) {
   await page.locator('#game').selectOption(mode);await page.locator('#shape').selectOption(shape);await page.locator('#new').click();
   await page.locator('[data-cell] .gem').first().waitFor();const box=await page.locator('#grid').boundingBox();assert.ok(box.x>=0&&box.x+box.width<=viewport.width);
  }
  assert.deepEqual(errors,[]);await page.close();
 }
 console.log('PASS both game trays desktop/phone: corner preview, cancel without cost, confirmed spend/effect, sticky assistance, undo/restart, keyboard target/cancel, translations, bounds and non-selectable gems');
}finally{await browser.close();server.kill();}
