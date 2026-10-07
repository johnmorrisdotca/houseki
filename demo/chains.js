import {fillCampaignSelector,levelText} from './campaigns.js';
import {refreshAppearanceLanguage} from './appearance.js';
import {updateEnding} from './ending.js';
import { soundEnabled, setSound, unlockSound, playTone } from './audio.js';
import { positions, settle, animationEnabled, setAnimations } from './animation.js';
import { syncAuthoredSettings, readFreeSettings, restoreFreeSettings } from './settings.js';
import { pageWords } from './words.js';
import { newSeed } from './seed.js';
import { restartGame, createChallenge, tutorialManifest, createLevel, levelManifest, shizenLevelManifest, createShizenLevel, arashiLevelManifest, createArashiLevel, createGame, applyAction, advanceTicks, decodeGame, encodeGame, landingCells, powerDropPreview, createInputScheduler, setHeldInput as setHeldAction, queueInputEdge, actionsForTick, releaseAllInput as releaseAllActions } from './dist/colour-chains.js';
const $ = (selector) => document.querySelector(selector);
const symbols = { red: '●', blue: '◆', green: '▲', gold: '■', purple: '+', teal: '☾' };
const words = {
  en: { scrollTop:'Top',scrollBottom:'Bottom',scrollLabel:'Board scroll position',boardLabel:'Colour Chains board',weather:'Arashi weather', nature:'Shizen · magnetic stones and rebound', campaignLabel:'Campaign', lessonLabel:'Learn to play',challengeLabel:'Challenge level',challengeMode:'Challenge',animations:'Animation', settings: 'Settings', mode: 'Mode', board: 'Board', colours: 'Colours', help: 'Rotate the pair and connect four of one colour. The two stones settle independently after landing.', keys: 'Keyboard: ← → move · ↑ rotate · Z / X reverse/forward · ↓ soft drop · Space place/drop · Escape pause. Keypad: 4 / 6 move · 7 / 9 reverse/forward · 5 soft drop · 2 place/drop', material: 'Board material', reduced: 'Reduce motion', sound: 'Sound effects', title: 'Colour Chains', score: 'Score', chain: 'Best chain', next: 'Next', reverse: 'Rotate left', cycle: 'Rotate right', new: 'New game', restart: 'Restart', place: 'Place the pair', paused: 'Paused', won: 'Challenge complete', lost: 'The well is full', placeButton: 'Place', drop: 'Drop', down: 'Down', theme: 'Theme', continue: 'Continue', countdown: 'Ready in', left: 'Left', right: 'Right', pause: 'Pause', resume: 'Continue' },
  ja: { scrollTop:'上へ',scrollBottom:'下へ',scrollLabel:'盤面のスクロール位置',boardLabel:'連鎖の盤面',weather:'嵐の天気', nature:'自然 · 磁石の石と跳ね返り', campaignLabel:'キャンペーン', lessonLabel:'遊び方',challengeLabel:'チャレンジ',challengeMode:'チャレンジ · 作成済み',animations:'アニメーション', settings: '設定', mode: 'モード', board: '盤面', colours: '色数', help: '二つの石を回転して、同じ色を四つ以上つなげましょう。着地すると、それぞれの石が落ちます。', keys: 'キー操作：← → 移動 · ↑ 回転 · Z / X 左回転/右回転 · ↓ 落下 · Space 置く/落とす · Escape 一時停止。テンキー：4 / 6 移動 · 7 / 9 左回転/右回転 · 5 落下 · 2 置く/落とす', material: '盤面の素材', reduced: '動きを減らす', sound: '効果音', title: '色の連鎖', score: '得点', chain: '最大連鎖', next: '次の石', reverse: '逆順', cycle: '回転', new: '新しいゲーム', restart: 'やり直す', place: '二つの石を置いてください', paused: '一時停止中', won: 'チャレンジ達成', lost: '盤面がいっぱいです', placeButton: '置く', drop: '落とす', down: '下へ', theme: 'テーマ', continue: '続ける', countdown: '開始まで', left: '左', right: '右', pause: '一時停止', resume: '続ける' }
};
const saveKey = 'houseki-colour-chains-save'; const preferenceKey = 'houseki-ui';
let weatherNotice=null;function rememberWeather(events){const event=events.find(event=>event.type==='weather-triggered');if(event)weatherNotice={kind:event.kind,until:performance.now()+2500};}
let selectedLevel=null; let lang='en'; const family=familyLanguage({id:'houseki',words:pageWords('chains'),onChange:next=>{lang=next;syncAuthoredSettings(selectedSettingsConfig(),lang);render();writePreferences();}});lang=family.lang; let game; let startOptions = {}; let input = createInputScheduler(); let lastFrame = 0; let accumulator = 0; let saveTimer = 0; let resumeRequired = false;
const heldKeys = new Map();
const pendingReleases = new Set();
function selectedAuthoredConfig(){
  const lesson=tutorialManifest.find(item=>item.id===$('#lesson').value);
  if(lesson)return {width:6,height:12,colourCount:4,seed:`lesson:${lesson.id}`};
  const level=levelsFor($('#campaign').value).find(item=>item.id===$('#level').value);
  return level?{width:level.width,height:level.height,colourCount:level.colourCount,seed:level.seed,nature:$('#campaign').value!=='basic',weather:$('#campaign').value==='arashi'?'frequent':''}:null;
}
function levelsFor(campaign){return campaign==='shizen'?shizenLevelManifest:campaign==='arashi'?arashiLevelManifest:levelManifest;}
function dailySettingsConfig(){return {mode:'daily',width:6,height:12,colourCount:4,seed:`daily:${new Date().toISOString().slice(0,10)}`};}
function selectedSettingsConfig(){return selectedAuthoredConfig()??($('#mode').value==='daily'?dailySettingsConfig():null);}
function beginHold(action) { pendingReleases.delete(action); input = setHeldAction(input, action, true); }
function endHold(action) { if (input.held[action] === 0) pendingReleases.add(action); else input = setHeldAction(input, action, false); }
function readPreferences() {
  try { const pref = JSON.parse(localStorage.getItem(preferenceKey) || '{}'); restoreFreeSettings(pref.freeSetup); if (pref.material) $('#material').value = pref.material; if (pref.motion) $('#motion').checked = true; if (pref.sound) $('#sound').checked = true; document.documentElement.dataset.motion = pref.motion ? 'reduced' : 'full'; }
  catch { /* Play starts normally when preferences are unavailable. */ }
}
function writePreferences() {
  try { localStorage.setItem(preferenceKey, JSON.stringify({ lang, freeSetup:readFreeSettings(), material: $('#material').value, motion: $('#motion').checked, sound: $('#sound').checked })); }
  catch { /* Preferences are optional. */ }
}
function getOptions() {if($('#mode').value==='daily')return{mode:'daily',dailyDate:new Date().toISOString().slice(0,10)};const boardSize=$('#preset').value==='saved-size'&&game?{width:game.settings.width,height:game.settings.height}:{};return{mode:$('#mode').value,...(Object.keys(boardSize).length?boardSize:{preset:$('#preset').value}),colourCount:Number($('#colours').value),nature:$('#nature').checked||Boolean($('#weather').value),...($('#weather').value?{weather:$('#weather').value}:{}),seed:newSeed()};}
function applyRecoveredControls(settings){
  if(settings.mode==='challenge')return;
  $('#mode').value=settings.mode;$('#colours').value=String(settings.colourCount);$('#nature').checked=settings.nature===true;$('#weather').value=settings.weather??'';
  let preset=null;
  if(settings.mode==='daily')preset='standard';
  else for(const option of [...$('#preset').options]){
    if(option.value==='authored'||option.value==='saved-size')continue;
    try{const probe=createGame({mode:settings.mode,preset:option.value,colourCount:settings.colourCount,nature:settings.nature===true,...(settings.weather?{weather:settings.weather}:{}),seed:'control-probe'});if(probe.settings.width===settings.width&&probe.settings.height===settings.height){preset=option.value;break;}}catch{/* Optional preferences. */}
  }
  $('#preset').querySelector('[data-saved-size]')?.remove();
  if(preset)$('#preset').value=preset;
  else{let option=$('#preset').querySelector('[data-saved-size]');if(!option){option=document.createElement('option');option.value='saved-size';option.dataset.savedSize='true';$('#preset').append(option);}option.textContent=`Saved · ${settings.width} × ${settings.height}`;$('#preset').value='saved-size';}
}
function newGame(restart = false) {
  if (!restart || !startOptions.seed) startOptions = getOptions();
  if(!restart){const lesson=tutorialManifest.find(item=>item.id===$('#lesson').value);const campaign=$('#campaign').value;selectedLevel=lesson?{...lesson,...lesson.setup,seed:`lesson:${lesson.id}`,lesson:true,campaign:'basic'}:levelsFor(campaign).find(level=>level.id===$('#level').value)?{...levelsFor(campaign).find(level=>level.id===$('#level').value),campaign}:null;}
  syncAuthoredSettings(selectedLevel?{width:selectedLevel.width??6,height:selectedLevel.height??12,colourCount:selectedLevel.colourCount??4,seed:selectedLevel.seed}:($('#mode').value==='daily'?dailySettingsConfig():null),lang);
  game = restart&&game?restartGame(game):selectedLevel?selectedLevel.lesson?createChallenge({id:selectedLevel.id,...selectedLevel.setup,seed:selectedLevel.seed}):selectedLevel.campaign==='shizen'?createShizenLevel(selectedLevel.id):selectedLevel.campaign==='arashi'?createArashiLevel(selectedLevel.id):createLevel(selectedLevel.id):createGame(startOptions); startOptions = { ...startOptions, seed: game.settings.seed }; input = createInputScheduler(); resumeRequired = false; $('#status').textContent = ''; $('#pending').hidden = true;
  try { localStorage.removeItem(saveKey); } catch { /* A fresh game still starts. */ }
  heldKeys.clear(); pendingReleases.clear(); $('#nature').checked=game.settings.nature===true;$('#weather').value=game.settings.weather??'';render(); save(); if(!['won','lost','finished'].includes(game.phase))$('.game-screen').focus({ preventScroll: true });
}
function gemMarkup(gem, extra = '') { const overlay=extra.includes('gravity-destination')||extra.includes('power-drop-ghost')?'style="position:absolute;inset:6%;pointer-events:none"':'';return `<span ${gem.id!==undefined?`data-id="${gem.id}"`:""} class="gem ${gem.colour} ${gem.magnetic?'magnetic':''} ${extra}" ${overlay} aria-label="${gem.colour}">${symbols[gem.colour]}${gem.magnetic?'<small aria-label="magnetic">✧</small>':''}</span>`; }
function render() {refreshAppearanceLanguage(lang);
  if (!game) return;
  if($('#nature').dataset.authoredLock!=='true'&&$('#weather').dataset.authoredLock!=='true'){const locked=game.settings.mode==='daily'||game.settings.mode==='challenge';$('#nature').disabled=locked;$('#weather').disabled=locked;}const previous=positions($('#well'));
  const w = game.settings.width; const h = game.settings.height; const totalH = h + 3; const cells = Array(w * totalH).fill('');
  game.board.forEach((gem, idx) => { if (gem) cells[idx] = gemMarkup(gem); });
  const landing=landingCells(game);
  const powerPreview=game.settings.nature&&game.settings.mode!=='relaxed'?powerDropPreview(game):null;
  if(game.active){
    const previewState=game.phase==='paused'?applyAction(game,{kind:'resume'}).state:game;const projected=powerPreview?applyAction(previewState,{kind:'hard-drop'}).state:null;const projectedBoard=projected?.gravityBoard??projected?.board;const previewCells=projectedBoard?projectedBoard.flatMap((gem,index)=>gem&&game.active.gems.some(active=>active.id===gem.id)?[{id:gem.id,x:index%w,y:Math.floor(index/w)-3}]:[]):landing;
    previewCells?.forEach((cell,index)=>{const gem=powerPreview?game.active.gems.find(candidate=>candidate.id===cell.id):game.active.gems[index];if(!gem)return;const at=(cell.y+3)*w+cell.x;if(powerPreview)cells[at]+=gemMarkup(gem,'ghost power-drop-ghost');else if(!cells[at])cells[at]=gemMarkup(gem,'ghost');});
  }
  if(game.active){const offsets={up:[0,-1],right:[1,0],down:[0,1],left:[-1,0]};const [dx,dy]=offsets[game.active.orientation];game.active.gems.forEach((gem,i)=>{const x=game.active.pivot.x+(i?dx:0),y=game.active.pivot.y+(i?dy:0);const at=(y+3)*w+x;if(at>=0&&at<cells.length)cells[at]=gemMarkup(gem,'active');});}
  if(game.phase==='gravity'&&game.gravityBoard){
    for(let index=0;index<game.gravityBoard.length;index++){
      const gem=game.gravityBoard[index];if(!gem||game.board[index]?.id===gem.id)continue;
      cells[index]+=gemMarkup(gem,'ghost gravity-destination');
    }
  }
  const well = $('#well'); well.style.setProperty('--cols', String(w)); well.style.setProperty('--rows', String(h));
  well.style.gridTemplateRows = `repeat(3, calc(var(--cell) * .42)) repeat(${h}, var(--cell))`; well.dataset.width = String(w);well.dataset.phase=game.phase;const oversized=h>20||w>12;markBoardRegion(oversized);
  const clearCells=new Set(game.clearCells??[]);
  const markup = cells.map((content, index) => {
    if(clearCells.has(index)&&game.board[index]) content=gemMarkup(game.board[index],game.phase==='clear-remove'?'removing':'marked');
    return `<div class="cell${index<w*3?' hidden-row':''}" data-cell="${index}" aria-label="${cellLabel(index, w, content)}">${content}</div>`;
  }).join('');
  if(well.dataset.markup!==markup){well.innerHTML=markup;well.dataset.markup=markup;settle(well,previous);}
  const objective=$('#objective');objective.hidden=!selectedLevel;$('#lesson-guide').hidden=!selectedLevel?.lesson&&!selectedLevel?.objective;if(selectedLevel?.lesson)$('#lesson-guide').textContent=selectedLevel.steps.map(step=>step.instruction[lang]).join(' ');else if(selectedLevel?.objective)$('#lesson-guide').textContent=selectedLevel.objective[lang];
  if(selectedLevel){const goal=selectedLevel.goal;const ids=goal.targetIds;const chain=goal.minimumChain??goal.chain;let target,current,label;
   if(ids){target=ids.length;const remaining=new Set(game.board.filter(Boolean).map(gem=>gem.id));current=ids.filter(id=>!remaining.has(id)).length;label=lang==='en'?'Target gems cleared':'目標の石';}
   else if(chain){target=chain;current=game.maxChain;label=lang==='en'?'Best chain':'最大連鎖';}
   else{target=selectedLevel.board.filter(Boolean).length;current=game.phase==='won'?target:Math.max(0,target-game.board.filter(Boolean).length);label=lang==='en'?'Clear the board':'盤面を空にする';}
   $('#goal-text').textContent=`${label}: ${current} / ${target}`;$('#goal-progress').max=target||1;$('#goal-progress').value=Math.min(current,target);$('#goal-progress').setAttribute('aria-label',label);
   const placed=game.completedPieces??game.completedPairs;$('#budget').textContent=`${lang==='en'?'Pieces left':'残り'}: ${Math.max(0,selectedLevel.queue.length-placed)}`;
  }
  $('#score').textContent = String(game.score); $('#chain').textContent = String(game.maxChain);
  const pairLimit=game.settings.pairLimit;$('#run-progress').hidden=!pairLimit||game.settings.mode==='challenge';if(pairLimit){$('#run-progress-label').textContent=lang==='en'?'Resolved pairs':'完了したペア';$('#run-progress-count').textContent=`${Math.min(game.completedPairs,pairLimit)} / ${pairLimit}`;$('#run-progress-bar').max=pairLimit;$('#run-progress-bar').value=Math.min(game.completedPairs,pairLimit);$('#run-progress-bar').setAttribute('aria-label',$('#run-progress-label').textContent);}
  $('#next').innerHTML = game.next.map((piece,pieceIndex) => `<div class="next-piece" aria-label="Next: ${piece.join(', ')}">${piece.map((colour,index) => gemMarkup({ colour, magnetic:game.nextMagnetic?.[pieceIndex]?.[index] })).join('')}</div>`).join('');
  const t = words[lang]; let status = game.phase === 'lost' ? (selectedLevel?(lang==='en'?'Challenge ended before the goal was reached':'目標を達成できませんでした'):t.lost) : game.phase === 'won' || game.phase === 'finished' ? t.won : game.phase === 'paused' ? t.paused : game.phase === 'clear-mark' ? ((game.waves.at(-1)?.chain??1) > 1 ? `Chain ${(game.waves.at(-1)?.chain??1)}` : `Clear · ${game.clearCells?.length ?? 0}`) : t.place;
  const lastWave = game.waves.at(-1); if (lastWave && ['clear-mark', 'clear-remove', 'gravity'].includes(game.phase)) status = lastWave.chain > 1 ? `Chain ${lastWave.chain}` : `Clear · ${lastWave.ids.length}`;
  if(weatherNotice?.until>performance.now()&&game.phase==='falling')status=weatherNotice.kind==='jumble'?(lang==='en'?'Earthquake · stones shifted':'地震 · 石が移動しました'):(lang==='en'?'Lightning · exposed stones removed':'雷 · 上の石が消えました');$('#status').textContent = status;
  document.documentElement.lang = lang;if($('#level').dataset.campaignLanguage!==lang)populateLevels();$('#lesson').options[0].textContent=lang==='en'?'No lesson':'レッスンなし';for(const option of [...$('#lesson').options].slice(1)){option.textContent=tutorialManifest.find(item=>item.id===option.value).title[lang];}$('#level').options[0].textContent=lang==='en'?'Free play':'自由に遊ぶ';for(const option of [...$('#level').options].slice(1)){const level=levelsFor($('#campaign').value).find(item=>item.id===option.value);if(level)option.textContent=levelText(level,lang);}
  document.querySelectorAll('[data-i]').forEach(el => { const key = el.dataset.i; if (t[key]) el.textContent = t[key]; });
  $('[data-action="place"]').textContent = t.placeButton; $('[data-action="hard-drop"]').textContent = t.drop; $('[data-action="soft-drop"]').textContent = t.down;
  $('[data-action="left"]').setAttribute('aria-label', t.left); $('[data-action="right"]').setAttribute('aria-label', t.right); $('[data-action="pause"]').textContent = t.pause; $('[data-action="resume"]').textContent = t.resume;
  const relaxed = game.settings.mode === 'relaxed'; $('.drop').hidden = relaxed; $('.soft').hidden = relaxed; $('.place').hidden = !relaxed;
  $('.pause').hidden = game.phase === 'paused' || ['won', 'lost', 'finished'].includes(game.phase);
  $('.resume').hidden = game.phase !== 'paused'; $('.resume').disabled = false;
  const terminal=['won','lost','finished'].includes(game.phase);
  document.querySelectorAll('.controls [data-action]').forEach(button=>{button.disabled=terminal;});
  $('#well').parentElement.className = `well-wrap material-${$('#material').value}`;
  const activeLevels=selectedLevel?.campaign?levelsFor(selectedLevel.campaign):levelManifest;const nextLevel=selectedLevel&&!selectedLevel.lesson?activeLevels[activeLevels.findIndex(level=>level.id===selectedLevel.id)+1]:null;updateEnding({phase:game.phase,score:game.score,lang,mode:game.settings.mode,level:selectedLevel,next:nextLevel,onRestart:()=>newGame(true),onNext:()=>{$('#campaign').value=selectedLevel.campaign??'basic';populateLevels();$('#level').value=nextLevel.id;$('#lesson').value='';newGame();},detail:status});
}
function populateLevels(){const campaign=$('#campaign').value;const placeholder=campaign==='basic'?(lang==='en'?'Free play':'自由に遊ぶ'):(lang==='en'?'Choose a level':'レベルを選択');fillCampaignSelector($('#level'),levelsFor(campaign),lang,placeholder);$('#level').dataset.campaignLanguage=lang;}
function updateBoardScroll(){const area=$('.well-scroll');if(!area)return;const percent=Math.round(area.scrollTop/Math.max(1,area.scrollHeight-area.clientHeight)*100);$('.scroll-position').textContent=`${percent}%`;$('.scroll-position').setAttribute('aria-label',`${words[lang].scrollLabel}: ${percent}%`);}
function markBoardRegion(oversized){const area=$('.well-scroll');area.dataset.oversized=String(oversized);$('.board-nav').hidden=!oversized;if(oversized){area.setAttribute('tabindex','0');area.setAttribute('role','region');area.setAttribute('aria-label',words[lang].boardLabel);}else{area.removeAttribute('tabindex');area.removeAttribute('role');area.removeAttribute('aria-label');}updateBoardScroll();}
function cellLabel(index, width, markup) { const y = Math.floor(index / width) - 3; const x = index % width; const gem = markup.match(/aria-label="([a-z]+)"/); return gem ? `${gem[1]} gem, column ${x + 1}, row ${y + 1}` : `Empty, column ${x + 1}, row ${y + 1}`; }
function save() { try { localStorage.setItem(saveKey, encodeGame(game)); } catch { /* Storage failure never interrupts play. */ } }
function queueSave() { if(!saveTimer)saveTimer=setTimeout(()=>{saveTimer=0;save();},350); }
function playAction(kind) {
  const result = applyAction(game, { kind:kind==='soft-drop'?'down':kind }); if (!result.accepted) return false;
  game = result.state;rememberWeather(result.events); render(); queueSave();
  if(result.events.some(event=>['piece-locked','pair-locked'].includes(event.type)))playTone(1,true);
  if (result.events.some(event => event.type === 'cells-cleared') && $('#sound').checked) playTone(Math.max(1, game.maxChain));
  if (['clear-mark', 'clear-remove', 'gravity', 'won', 'lost', 'finished'].includes(game.phase)) input = releaseAllActions(input);
  return true;
}
async function resumeCountdown() {
  if (game.phase !== 'paused' || resumeRequired) return;
  resumeRequired = true; input = releaseAllActions(input); $('.resume').disabled = true;
  for (let n = 3; n > 0; n--) { $('#status').textContent = `${words[lang].countdown} ${n}`; await new Promise(resolve => setTimeout(resolve, 1000)); }
  resumeRequired = false; playAction('resume');
}

function simulationTick() {
  let endedPiece = false;
  let actions; [actions, input] = actionsForTick(game,input);
  for (const action of pendingReleases) input = setHeldAction(input, action, false);
  pendingReleases.clear();
  for (const item of actions) {
    const wasFalling = game.phase === 'falling'; const oldPieces = game.completedPairs; playAction(item.kind);
    if ((wasFalling && game.phase !== 'falling') || game.completedPairs > oldPieces) endedPiece = true;
  }
  if (endedPiece || game.phase !== 'falling') input = releaseAllActions(input);
  const beforeTick = game; const result = advanceTicks(game, 1); game = result.state;
  if (game !== beforeTick) {rememberWeather(result.events);for(const event of result.events)if(event.type==='cells-cleared')playTone(event.chain??1); render(); queueSave(); }
}
function animate(timestamp) {
  if (!lastFrame) lastFrame = timestamp; const elapsed = Math.min(timestamp - lastFrame, 100); lastFrame = timestamp; accumulator += elapsed;
  const tickMs = 1000 / 60; let count = 0;
  while (accumulator >= tickMs && count < 6) { simulationTick(); accumulator -= tickMs; count++; }
  requestAnimationFrame(animate);
}
function bindHeld(button, action) {
  button.addEventListener('pointerdown', event => { event.preventDefault(); button.setPointerCapture?.(event.pointerId); beginHold(action); button.focus(); });
  const release = () => endHold(action);
  button.addEventListener('pointerup', release); button.addEventListener('pointercancel', release); button.addEventListener('lostpointercapture', release);
}
document.querySelectorAll('[data-action="left"],[data-action="right"],[data-action="soft-drop"]').forEach(button => bindHeld(button, button.dataset.action));
document.querySelectorAll('[data-action]').forEach(button => { if (['left', 'right', 'soft-drop', 'resume'].includes(button.dataset.action)) return; button.addEventListener('click', () => { input = queueInputEdge(input, { kind: button.dataset.action }); }); });
$('#new').addEventListener('click', () => newGame()); $('#restart').addEventListener('click', () => newGame(true));
for (const selector of ['#preset', '#colours', '#nature', '#weather']) $(selector).addEventListener('change', () => { $('#pending').hidden = false;writePreferences(); });
$('#material').addEventListener('change', () => { render(); writePreferences(); });
$('#motion').addEventListener('change', event => { document.documentElement.dataset.motion = event.target.checked ? 'reduced' : 'full'; writePreferences(); });
$('#sound').addEventListener('change',event=>{setSound(event.target.checked);writePreferences();});
const keypadKeys = { Numpad4: 'arrowleft', Numpad6: 'arrowright', Numpad7: 'z', Numpad9: 'x', Numpad5: 'arrowdown', Numpad2: 'drop' };
document.addEventListener('keydown', event => {
  const target = event.target instanceof HTMLElement ? event.target : null;
  const withinGame = target?.closest('.game-screen') || document.activeElement === document.body;
  if (!withinGame || target?.closest('input,select,textarea,[contenteditable]:not([contenteditable="false"])')) return;
  if(target?.closest('.well-scroll')&&['arrowup','arrowdown','arrowleft','arrowright'].includes(event.key.toLowerCase()))return;
  const key = keypadKeys[event.code] ?? event.key.toLowerCase();
  const holds = { arrowleft: 'left', arrowright: 'right', arrowdown: 'soft-drop' };
  if (holds[key]) { event.preventDefault(); if (!heldKeys.has(event.code)) { heldKeys.set(event.code, holds[key]); beginHold(holds[key]); } return; }
  if (key === ' ' && target?.closest('button')) return;
  const map = { x: 'rotate-clockwise', arrowup: 'rotate-clockwise', z: 'rotate-anticlockwise', drop: game.settings.mode === 'relaxed' ? 'place' : 'hard-drop', ' ': game.settings.mode === 'relaxed' ? 'place' : 'hard-drop' };
  if (key !== 'escape' && !map[key]) return;
  event.preventDefault();
  if (event.repeat) return;
  if (key === 'escape') { if (game.phase === 'paused') resumeCountdown(); else input = queueInputEdge(input, { kind: 'pause' }); return; }
  input = queueInputEdge(input, { kind: map[key] });
});
document.addEventListener('keyup', event => {
  const action = heldKeys.get(event.code);
  if (action) { heldKeys.delete(event.code); if (![...heldKeys.values()].includes(action)) endHold(action); }
});
$('.game-screen').addEventListener('dragstart', event => event.preventDefault());
function releaseInputs() { input = releaseAllActions(input); heldKeys.clear(); pendingReleases.clear(); }
window.addEventListener('blur', () => { releaseInputs(); if (['arcade','daily'].includes(game?.settings.mode) && game?.phase !== 'paused') playAction('pause'); });
document.addEventListener('visibilitychange', () => { if (document.hidden) { releaseInputs(); if (['arcade','daily'].includes(game?.settings.mode) && game?.phase !== 'paused') playAction('pause'); } });
$('.resume').addEventListener('click', resumeCountdown);
window.addEventListener('pagehide', () => { clearTimeout(saveTimer); if (game && ['arcade','daily'].includes(game.settings.mode) && game.phase === 'falling') game = applyAction(game, { kind: 'pause' }).state; save(); });

$('#lesson').innerHTML='<option value="">No lesson</option>'+tutorialManifest.map(lesson=>`<option value="${lesson.id}">${lesson.title.en}</option>`).join('');
populateLevels();
$('#campaign').addEventListener('change',()=>{$('#lesson').value='';populateLevels();if($('#campaign').value!=='basic')$('#level').value=levelsFor($('#campaign').value)[0]?.id??'';syncAuthoredSettings(selectedAuthoredConfig(),lang);$('#pending').hidden=false;writePreferences();});
$('#level').addEventListener('change',()=>{$('#lesson').value='';syncAuthoredSettings(selectedAuthoredConfig(),lang);$('#pending').hidden=false;writePreferences();});
$('#lesson').addEventListener('change',()=>{$('#level').value='';syncAuthoredSettings(selectedAuthoredConfig(),lang);$('#pending').hidden=false;writePreferences();});
$('#mode').addEventListener('change',()=>{$('#level').value='';$('#lesson').value='';syncAuthoredSettings($('#mode').value==='daily'?dailySettingsConfig():null,lang);$('#pending').hidden=false;writePreferences();});
$('#level').innerHTML='<option value="">Free play</option>'+levelManifest.map(level=>`<option value="${level.id}">${level.number} · ${level.marks}/5 · ${level.title.en}</option>`).join('');
readPreferences();

try { const saved = localStorage.getItem(saveKey); if (saved) { game = decodeGame(saved);const shizen=levelsFor('shizen').find(level=>level.id===game.settings.challengeId);const arashi=levelsFor('arashi').find(level=>level.id===game.settings.challengeId);const basic=levelManifest.find(level=>level.id===game.settings.challengeId||level.seed===game.settings.seed);selectedLevel=shizen?{...shizen,campaign:'shizen'}:arashi?{...arashi,campaign:'arashi'}:basic?{...basic,campaign:'basic'}:null;const restoredLesson=tutorialManifest.find(lesson=>`lesson:${lesson.id}`===game.settings.seed);if(restoredLesson){selectedLevel={...restoredLesson,...restoredLesson.setup,seed:game.settings.seed,lesson:true,campaign:'basic'};$('#lesson').value=restoredLesson.id;}if(game.settings.mode==='challenge'&&!selectedLevel)throw new Error('Unknown campaign revision');if(selectedLevel&&!selectedLevel.lesson){$('#campaign').value=selectedLevel.campaign;populateLevels();$('#level').value=selectedLevel.id;} startOptions = { mode: game.settings.mode, width: game.settings.width, height: game.settings.height, seed: game.settings.seed, colourCount: game.settings.colourCount, ...(game.settings.pairLimit ? { pairLimit: game.settings.pairLimit } : {}) }; if (game.phase === 'falling' && ['arcade','daily'].includes(game.settings.mode)) game = applyAction(game, { kind: 'pause' }).state;  } } catch { game = null; }
if (!game) newGame(); else { if(selectedLevel)syncAuthoredSettings({width:selectedLevel.width??6,height:selectedLevel.height??12,colourCount:selectedLevel.colourCount??4,seed:selectedLevel.seed,nature:selectedLevel.campaign!=='basic',weather:selectedLevel.campaign==='arashi'?'frequent':''},lang);else{syncAuthoredSettings(null,lang);applyRecoveredControls(game.settings);if(game.settings.mode==='daily')syncAuthoredSettings(dailySettingsConfig(),lang);}resumeRequired = false; render(); if(!['won','lost','finished'].includes(game.phase))$('.game-screen').focus({ preventScroll: true }); }
requestAnimationFrame(animate);

$('#animations').checked=animationEnabled();$('#animations').addEventListener('change',event=>setAnimations(event.target.checked));

for(const option of $('#preset').options){if(['deep','large','extraWide'].includes(option.value)&&globalThis.housekiConfig?.oversizedUnlocked===false){option.disabled=true;option.textContent+=' · Locked';}}
for(const button of document.querySelectorAll('[data-scroll]'))button.addEventListener('click',()=>{const area=$('.well-scroll');area.scrollTop=button.dataset.scroll==='top'?0:area.scrollHeight;updateBoardScroll();});
$('.well-scroll').addEventListener('scroll',updateBoardScroll,{passive:true});

$('#sound').checked=soundEnabled();document.addEventListener('pointerdown',unlockSound);document.addEventListener('keydown',unlockSound);
