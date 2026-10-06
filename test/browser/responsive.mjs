import {mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
const screenshotDir=resolve(process.env.HOUSEKI_SCREENSHOT_DIR??'test-output');await mkdir(screenshotDir,{recursive:true});
import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';

const server=spawn(process.execPath,['scripts/serve.mjs'],{env:{...process.env,PORT:'0',BASE_PATH:'/houseki'},stdio:['ignore','pipe','pipe']});
const url=await new Promise((resolve,reject)=>{const timeout=setTimeout(()=>{server.kill();reject(new Error('Demo server startup timed out'));},10000);server.on('error',error=>{clearTimeout(timeout);reject(error);});server.stdout.on('data',data=>{const found=String(data).match(/http:\/\/127\.0\.0\.1:\d+\/houseki/);if(found){clearTimeout(timeout);resolve(found[0]);}});server.on('exit',code=>{clearTimeout(timeout);reject(new Error(`Demo server exited: ${code}`));});});
let browser;
try{browser=await chromium.launch();}catch(error){server.kill();throw error;}
try{
 for(const viewport of [{width:360,height:780},{width:562,height:740},{width:828,height:1193},{width:1024,height:900},{width:1280,height:900}])for(const [path,game] of [['index.html','falling-triplets'],['chains.html','colour-chains'],['tools.html','gem-swap'],['tools.html','stone-collapse'],['blocks.html','magnetic-blocks']]){
  const page=await browser.newPage({viewport});const errors=[];page.on('pageerror',error=>errors.push(String(error)));page.on('requestfailed',request=>errors.push(request.url()));await page.goto(`${url}/${path}`);
  if(path==='tools.html')await page.locator('#game').selectOption(game);
  await page.locator('.game-screen .gem:not(.ghost)').first().waitFor();
  if(game!=='magnetic-blocks'){await page.locator('#level').selectOption({index:5});await page.locator('#new').click();assert.equal(await page.locator('#preset').isDisabled(),true);assert.match(await page.locator('#preset option:checked').textContent(),/Fixed/);}
  const failures=await page.evaluate(()=>{const screen=document.querySelector('.game-screen'),bounds=screen.getBoundingClientRect(),problems=[];for(const element of screen.querySelectorAll('p,h2,.stats span,.controls button')){if(!element.getClientRects().length||element.closest('[hidden]'))continue;const range=document.createRange();range.selectNodeContents(element);for(const rect of range.getClientRects())if(rect.width>0&&(rect.left<bounds.left-1||rect.right>bounds.right+1))problems.push(element.textContent.trim().slice(0,100));}const board=screen.querySelector('#well,#grid');const rect=board.getBoundingClientRect();if(rect.left<bounds.left-1||rect.right>bounds.right+1)problems.push('board exceeds the game panel');if(document.documentElement.scrollWidth>innerWidth+1)problems.push('page overflows horizontally');return problems;});
  assert.deepEqual(failures,[],`${game} at ${viewport.width}px`);assert.deepEqual(errors,[]);
  if(viewport.width===828&&game==='colour-chains')await page.screenshot({path:resolve(screenshotDir,'houseki-chains-tablet-reviewed.png'),fullPage:true});
  await page.close();
 }
 console.log('PASS all five players: 360/562/828/1024/1280px layouts, fixed puzzle dimensions, readable goal text, no clipping or missing modules');
}finally{await browser.close();server.kill();}
