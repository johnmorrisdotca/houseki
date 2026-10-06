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
  await page.goto(`${url}/chains.html`);await page.waitForSelector('#well .active');
  const colours=()=>page.locator('#well .active').evaluateAll(gems=>gems.map(gem=>gem.className));
  const beforeRotation=await colours();await page.keyboard.press('ArrowUp');await page.waitForTimeout(80);
  const rotated=await colours();assert.equal(rotated.length,2);
  const activeBoxes=await page.locator('#well .active').evaluateAll(gems=>gems.map(gem=>({x:gem.parentElement.offsetLeft,y:gem.parentElement.offsetTop})));
  assert.equal(activeBoxes[0].y,activeBoxes[1].y,'Up rotates the vertical pair horizontally');
  await page.keyboard.press('Numpad2');await page.waitForTimeout(400);
  assert.ok(await page.locator('#well .gem:not(.ghost):not(.active)').count()>=2,'keypad placement settles the pair');
  for(const mode of ['arcade','daily']){await page.locator('#mode').selectOption(mode);await page.locator('#new').click();await page.waitForSelector('#well .active');}
  await page.locator('#mode').selectOption('relaxed');await page.locator('#new').click();
  assert.deepEqual(errors,[]);
  for(const [path,entry,count] of [['index.html','falling-triplets',100],['chains.html','colour-chains',50]]){
   await page.goto(`${url}/${path}`);await page.waitForSelector('#level option:nth-child(2)',{state:'attached'});
   assert.equal(await page.locator('#level option').count(),count+1);
   await page.locator('#level').selectOption({index:1});await page.locator('#new').click();assert.equal(await page.locator('#objective').isVisible(),true);
   const plan=await page.evaluate(async(entry)=>{
    const m=await import(`./dist/${entry}.js`);let state=m.createLevel(1);const plan=[];
    for(const witness of m.levelManifest[0].witness){const commands=[];const x=state.active.x??state.active.pivot.x;const destination=witness.x??witness.pivotX;
     for(let i=0;i<Math.abs(destination-x);i++)commands.push(destination<x?'ArrowLeft':'ArrowRight');
     const turns=typeof witness.orientation==='number'?witness.orientation:({up:0,right:1,down:2,left:3}[witness.orientation]);
     for(let i=0;i<turns;i++)commands.push('ArrowUp');commands.push('Space');
     for(const key of commands){const kind=key==='ArrowLeft'?'left':key==='ArrowRight'?'right':key==='Space'?'hard-drop':entry==='colour-chains'?'rotate-clockwise':'cycle-forward';state=m.applyAction(state,{kind}).state;}
     state=m.advanceTicks(state,200).state;plan.push(commands);
    }return plan;
   },entry);
   for(const commands of plan){for(const key of commands){await page.keyboard.press(key);await page.waitForTimeout(40);}await page.waitForFunction(()=>['falling','won','finished','lost'].includes(document.querySelector('#well').dataset.phase));}
   assert.equal(await page.locator('#well').getAttribute('data-phase'),'won');
   assert.equal(await page.locator('#goal-progress').evaluate(p=>p.value===p.max),true);
   await page.locator('#restart').click();assert.equal(await page.locator('#goal-progress').evaluate(p=>p.value),0);
   for(let lesson=1;lesson<=3;lesson++){await page.locator('#lesson').selectOption({index:lesson});await page.locator('#new').click();assert.equal(await page.locator('#lesson-guide').isVisible(),true);assert.ok((await page.locator('#lesson-guide').textContent()).length>10);assert.equal(await page.locator('#well').getAttribute('data-phase'),'falling');}
  }
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
  await page.locator('#game').selectOption('gem-swap');await page.locator('#code').fill('black-hole-browser');await page.locator('#advanced').check();await page.locator('#new').click();
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
  await page.locator('#sound').check();await page.goto(`${url}/chains.html`);assert.equal(await page.locator('#sound').isChecked(),true);await page.locator('#sound').uncheck();await page.goto(`${url}/tools.html`);assert.equal(await page.locator('#sound').isChecked(),false);
  await page.locator('#game').selectOption('gem-swap');assert.equal(await page.locator('#level option').count(),51);await page.locator('#level').selectOption({index:1});await page.locator('#new').click();
  const firstSwap=await page.evaluate(async()=>{const m=await import('./dist/gem-swap.js');return m.GEM_SWAP_CAMPAIGN[0].witness.find(op=>op.kind==='action').action;});
  await page.locator(`[data-cell="${firstSwap.from}"]`).click();await page.locator(`[data-cell="${firstSwap.to}"]`).click();await page.waitForFunction(()=>document.querySelector('#grid').dataset.phase==='finished');assert.match(await page.locator('#status').textContent(),/Goal complete/);assert.equal(await page.locator('#objectives progress').evaluate(p=>p.value===p.max),true);
  for(let lesson=1;lesson<=3;lesson++){await page.locator('#lesson').selectOption({index:lesson});await page.locator('#new').click();assert.equal(await page.locator('#lesson-guide').isVisible(),true);}
  await page.locator('#game').selectOption('stone-collapse');assert.equal(await page.locator('#level option').count(),101);
  await page.locator('#level').selectOption({index:1});await page.locator('#new').click();
  const groups=await page.evaluate(async()=>{const m=await import('./dist/stone-collapse.js');return m.levelManifest[0].witness;});
  for(const ids of groups){await page.locator(`[data-gem-id="${ids[0]}"]`).click();await page.locator('#confirm').click();await page.waitForFunction(()=>['ready','won','lost','finished'].includes(document.querySelector('#grid').dataset.phase));}
  assert.equal(await page.locator('#grid').getAttribute('data-phase'),'won');assert.equal(await page.locator('#objectives progress').evaluate(p=>p.value===p.max),true);
  await page.locator('#restart').click();assert.equal(await page.locator('#objectives progress').evaluate(p=>p.value),0);
  for(let lesson=1;lesson<=3;lesson++){await page.locator('#lesson').selectOption({index:lesson});await page.locator('#new').click();assert.equal(await page.locator('#lesson-guide').isVisible(),true);}
  await page.locator('#lesson').selectOption('');await page.locator('#level').selectOption('');
  for(const mode of ['gem-swap','stone-collapse'])for(const run of ['arcade','daily']){await page.locator('#game').selectOption(mode);await page.locator('#mode').selectOption(run);await page.locator('#new').click();assert.equal(await page.locator('#grid').getAttribute('data-phase'),'ready');if(run==='daily')assert.equal(await page.locator('[data-tool="bomb"]').isDisabled(),true);}
  await page.locator('#mode').selectOption('relaxed');
  for(const mode of ['gem-swap','stone-collapse']) for(const shape of ['heart','star','hexagon']) {
   await page.locator('#game').selectOption(mode);await page.locator('#shape').selectOption(shape);await page.locator('#new').click();
   await page.locator('[data-cell] .gem').first().waitFor();const box=await page.locator('#grid').boundingBox();assert.ok(box.x>=0&&box.x+box.width<=viewport.width);
  }
  for(const path of ['index.html','chains.html']){
   await page.goto(`${url}/${path}`);await page.locator('#lesson').selectOption('');await page.locator('#level').selectOption('');await page.locator('#preset').selectOption('deep');await page.locator('#new').click();
   assert.equal(await page.locator('.well-scroll').evaluate(area=>area.scrollHeight>area.clientHeight),true);
   await page.locator('[data-scroll="bottom"]').click();assert.ok(await page.locator('.well-scroll').evaluate(area=>area.scrollTop)>0);await page.locator('[data-scroll="top"]').click();assert.equal(await page.locator('.well-scroll').evaluate(area=>area.scrollTop),0);
  }
  await page.goto(`${url}/tools.html`);await page.locator('#game').selectOption('stone-collapse');await page.locator('#level').selectOption('');await page.locator('#lesson').selectOption('');await page.locator('#mode').selectOption('relaxed');await page.locator('#shape').selectOption('');await page.locator('#preset').selectOption('deep');await page.locator('#new').click();
  assert.equal(await page.locator('.board-scroll').evaluate(area=>area.scrollHeight>area.clientHeight),true);
  await page.locator('[data-cell="255"]').focus();assert.ok(await page.locator('.board-scroll').evaluate(area=>area.scrollTop)>0,'deep board keyboard focus reveals the bottom row');
  await page.locator('#game').selectOption('gem-swap');assert.equal(await page.locator('#grid').getAttribute('data-phase'),'ready');assert.equal(await page.locator('#preset').inputValue(),'deep');assert.equal(await page.locator('#grid').getAttribute('aria-rowcount'),'32');
  await page.goto(`${url}/chains.html`);await page.locator('#mode').selectOption('relaxed');await page.locator('#level').selectOption('');await page.locator('#lesson').selectOption('');await page.locator('#nature').check();await page.locator('#new').click();assert.equal(await page.locator('#nature').isChecked(),true);
  await page.locator('#mode').selectOption('daily');await page.locator('#new').click();assert.equal(await page.locator('#nature').isDisabled(),true);assert.equal(await page.locator('#nature').isChecked(),false);
  await page.goto(`${url}/blocks.html`);await page.waitForSelector('#well .active');assert.equal(await page.locator('#well .active').count(),4);assert.equal(await page.locator('#well .cell').count(),128);const geometry=await page.locator('#well .cell').evaluateAll(cells=>cells.map(cell=>{const rect=cell.getBoundingClientRect();return {width:rect.width,height:rect.height};}));assert.ok(geometry.every(cell=>cell.height>=24&&Math.abs(cell.height-cell.width)<1),'every configured row retains square cells, including empty rows');assert.equal((await page.locator('body').innerText()).includes('{n}'),false);assert.ok(Math.abs((await page.locator('#well').boundingBox()).width-(geometry[0].width*8+24))<1,'board width contains exactly its eight columns and spacing');await page.locator('.game-screen').focus();const blockBefore=await page.locator('#well .active').evaluateAll(gems=>gems.map(gem=>gem.dataset.id));await page.keyboard.press('ArrowUp');const blockAfter=await page.locator('#well .active').evaluateAll(gems=>gems.map(gem=>gem.dataset.id));assert.notDeepEqual(blockBefore,blockAfter);
  await page.locator('[data-floor="magnetic"]').click();assert.match(await page.locator('#floor-preview').textContent(),/bonds will break/);await page.locator('#cancel-floor').click();assert.equal(await page.locator('#charges').textContent(),'1');await page.locator('[data-floor="magnetic"]').click();await page.locator('#apply-floor').click();await page.waitForFunction(()=>document.querySelector('#well').dataset.phase==='falling');assert.equal(await page.locator('#charges').textContent(),'0');assert.equal(await page.locator('#placed').textContent(),'1');assert.equal(await page.locator('#well .gem:not(.active):not(.ghost)').first().evaluate(gem=>getComputedStyle(gem).userSelect),'none');await page.locator('#restart').click();assert.equal(await page.locator('#placed').textContent(),'0');assert.equal(await page.locator('#charges').textContent(),'1');
  await page.addInitScript(()=>{globalThis.housekiConfig={oversizedUnlocked:false};});await page.goto(`${url}/chains.html`);assert.equal(await page.locator('#preset option[value="deep"]').evaluate(option=>option.disabled),true);
  assert.deepEqual(errors,[]);await page.close();
 }
 console.log('PASS both game trays desktop/phone: corner preview, cancel without cost, confirmed spend/effect, sticky assistance, undo/restart, keyboard target/cancel, translations, bounds and non-selectable gems');
}finally{await browser.close();server.kill();}
