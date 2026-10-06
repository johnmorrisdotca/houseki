import {preferredLanguage,refreshAppearanceLanguage} from './appearance.js';
import {syncAuthoredSettings,readFreeSettings,restoreFreeSettings} from './settings.js';
import {updateEnding} from './ending.js';
import { soundEnabled, setSound, unlockSound, playTone } from './audio.js';
import { positions, settle, animationEnabled, setAnimations } from './animation.js';
import { restartGame, createChallenge, tutorialManifest, createLevel, levelManifest, createGame, applyAction, advanceTicks, decodeGame, encodeGame, landingY, createInputScheduler, setHeldAction, queueInputEdge, actionsForTick, releaseAllActions } from './dist/falling-triplets.js';
import { pageWords } from './words.js';
import { newSeed } from './seed.js';
const $ = (selector) => document.querySelector(selector);
const symbols = { red: '●', blue: '◆', green: '▲', gold: '■', purple: '+', teal: '☾' };
const words = {
  en: { lessonLabel:'Learn to play',challengeLabel:'Challenge level',animations:'Animation', settings: 'Settings', mode: 'Mode', board: 'Board', colours: 'Colours', help: 'Cycle the colours, line up three, and watch the gems fall into new matches. Lines may run horizontally, vertically, or diagonally.', keys: 'Keyboard: ← → move · ↑ cycle · Z / X reverse/forward · ↓ soft drop · Space place/drop · Escape pause. Keypad: 4 / 6 move · 7 / 9 reverse/forward · 5 soft drop · 2 place/drop', material: 'Board material', reduced: 'Reduce motion', sound: 'Sound effects', title: 'Falling Triplets', score: 'Score', chain: 'Best chain', next: 'Next', reverse: 'Reverse cycle', cycle: 'Cycle', new: 'New game', restart: 'Restart', place: 'Place the triplet', paused: 'Paused', won: 'Challenge complete', lost: 'The well is full', placeButton: 'Place', drop: 'Drop', down: 'Down', theme: 'Theme', continue: 'Continue', countdown: 'Ready in', left: 'Left', right: 'Right', pause: 'Pause', resume: 'Continue' },
  ja: { lessonLabel:'遊び方',challengeLabel:'チャレンジ',animations:'アニメーション', settings: '設定', mode: 'モード', board: '盤面', colours: '色数', help: '宝石の色を入れ替えて三つ並べましょう。消えた宝石の上にあった石が落ち、新しい連鎖が起きることがあります。横・縦・斜めに並びます。', keys: 'キー操作：← → 移動 · ↑ 色を入れ替え · Z / X 逆順/順送り · ↓ 落下 · Space 置く/落とす · Escape 一時停止。テンキー：4 / 6 移動 · 7 / 9 逆順/順送り · 5 落下 · 2 置く/落とす', material: '盤面の素材', reduced: '動きを減らす', sound: '効果音', title: '三つの宝石', score: '得点', chain: '最大連鎖', next: '次の石', reverse: '逆順', cycle: '色を入れ替え', new: '新しいゲーム', restart: 'やり直す', place: '三つの宝石を置いてください', paused: '一時停止中', won: 'チャレンジ達成', lost: '盤面がいっぱいです', placeButton: '置く', drop: '落とす', down: '下へ', theme: 'テーマ', continue: '続ける', countdown: '開始まで', left: '左', right: '右', pause: '一時停止', resume: '続ける' }
};
const saveKey = 'houseki-falling-triplets-save'; const preferenceKey = 'houseki-ui';
let customSize=null;let selectedLevel=null; const family = familyLanguage({ id: 'houseki', words: pageWords('triplets'), onChange: next => { lang = next; render(); } }); let lang = family.lang; let game; let startOptions = {}; let input = createInputScheduler(); let lastFrame = 0; let accumulator = 0; let saveTimer = 0; let resumeRequired = false;
const heldKeys = new Map();
const pendingReleases = new Set();
function beginHold(action) { pendingReleases.delete(action); input = setHeldAction(input, action, true); }
function endHold(action) { if (input.held[action] === 0) pendingReleases.add(action); else input = setHeldAction(input, action, false); }
function readPreferences() {
  try { const pref = JSON.parse(localStorage.getItem(preferenceKey) || '{}'); lang = preferredLanguage(pref.lang); restoreFreeSettings(pref.freeSetup); if (pref.material) $('#material').value = pref.material; if (pref.motion) $('#motion').checked = true; if (pref.sound) $('#sound').checked = true; document.documentElement.dataset.motion = pref.motion ? 'reduced' : 'full'; }
  catch { /* Play starts normally when preferences are unavailable. */ }
}
function writePreferences() {
  try { localStorage.setItem(preferenceKey, JSON.stringify({ lang, freeSetup:readFreeSettings(), material: $('#material').value, motion: $('#motion').checked, sound: $('#sound').checked })); }
  catch { /* Preferences are optional. */ }
}
function syncSetup(){const lesson=tutorialManifest.find(item=>item.id===$('#lesson').value);const level=levelManifest.find(item=>item.id===$('#level').value);const config=lesson?{...lesson.setup,seed:`lesson:${lesson.id}`}:level??null;syncAuthoredSettings(config,lang);if(!config&&$('#mode').value==='daily')syncAuthoredSettings(createGame({mode:'daily',seed:new Date().toISOString().slice(0,10)}).settings,lang);}
function getOptions() { return { ...($('#preset').value==='custom'&&customSize?customSize:{preset:$('#mode').value==='daily'?'narrow':$('#preset').value}), mode: $('#mode').value, colourCount: $('#mode').value === 'daily' ? 5 : Number($('#colours').value), seed: $('#mode').value === 'daily' ? new Date().toISOString().slice(0, 10) : newSeed() }; }
function restoreControls(){if(game.settings.mode==='challenge'){syncAuthoredSettings(game.settings,lang);return;}$('#mode').value=game.settings.mode;$('#colours').value=String(game.settings.colourCount);const preset=[...$('#preset').options].find(option=>{if(['authored','custom'].includes(option.value))return false;try{const settings=createGame({preset:option.value,seed:'size-check'}).settings;return settings.width===game.settings.width&&settings.height===game.settings.height;}catch{return false;}});if(preset)$('#preset').value=preset.value;else{customSize={width:game.settings.width,height:game.settings.height};let option=$('#preset option[value="custom"]');if(!option){option=document.createElement('option');option.value='custom';$('#preset').append(option);}option.textContent=`Custom · ${customSize.width} × ${customSize.height}`;$('#preset').value='custom';}}
function newGame(restart = false) {
  if(!restart)syncSetup();
  if (!restart || !startOptions.seed) startOptions = getOptions();
  if(!restart){const lesson=tutorialManifest.find(item=>item.id===$('#lesson').value);selectedLevel=lesson?{...lesson,...lesson.setup,seed:`lesson:${lesson.id}`,lesson:true}:levelManifest.find(level=>level.id===$('#level').value)??null;}
  game = restart&&game?restartGame(game):selectedLevel?selectedLevel.lesson?createChallenge({...selectedLevel.setup,seed:selectedLevel.seed}):createLevel(selectedLevel.id):createGame(startOptions); startOptions = { ...startOptions, seed: game.settings.seed }; input = createInputScheduler(); resumeRequired = false; $('#status').textContent = ''; $('#pending').hidden = true;
  try { localStorage.removeItem(saveKey); } catch { /* A fresh game still starts. */ }
  heldKeys.clear(); pendingReleases.clear(); render(); save(); if(!['won','lost','finished'].includes(game.phase))$('.game-screen').focus({ preventScroll: true });
}
function gemMarkup(gem, extra = '') { return `<span ${gem.id!==undefined?`data-id="${gem.id}"`:""} class="gem ${gem.colour} ${extra}" aria-label="${gem.colour}">${symbols[gem.colour]}</span>`; }
function render() {refreshAppearanceLanguage(lang);
  if (!game) return;
  const previous=positions($('#well'));
  const w = game.settings.width; const h = game.settings.height; const totalH = h + 3; const cells = Array(w * totalH).fill('');
  const board=game.phase==='gravity'&&game.gravityBoard?game.gravityBoard:game.board;const clearing=new Set(game.pendingClear??[]);board.forEach((gem,idx)=>{if(gem)cells[idx]=gemMarkup(gem,clearing.has(idx)?game.phase==='clear-remove'?'removing':'marked':'');});
  const ghostY = landingY(game); if (game.active && ghostY !== null) game.active.gems.forEach((gem, i) => { const at = (ghostY + i + 3) * w + game.active.x; if (!cells[at]) cells[at] = gemMarkup(gem, 'ghost'); });
  if (game.active) game.active.gems.forEach((gem, i) => { const y = game.active.y + i; const at = (y + 3) * w + game.active.x; if (at >= 0 && at < cells.length) cells[at] = gemMarkup(gem, 'active'); });
  const well = $('#well'); well.style.setProperty('--cols', String(w)); well.style.setProperty('--rows', String(h));
  well.style.gridTemplateRows = `repeat(3, calc(var(--cell) * .42)) repeat(${h}, var(--cell))`; well.dataset.width = String(w);well.dataset.phase=game.phase;const oversized=h>20||w>12;$('.well-scroll').dataset.oversized=String(oversized);$('.board-nav').hidden=!oversized;
  const markup = cells.map((content, index) => `<div class="cell${index<w*3?' hidden-row':''}" aria-label="${cellLabel(index, w, content)}">${content}</div>`).join('');
  if(well.dataset.markup!==markup){well.innerHTML=markup;well.dataset.markup=markup;settle(well,previous);}
  const objective=$('#objective');objective.hidden=!selectedLevel&&!game.settings.pieceLimit;$('#lesson-guide').hidden=!selectedLevel?.lesson;if(selectedLevel?.lesson)$('#lesson-guide').textContent=selectedLevel.steps.map(step=>step.instruction[lang]).join(' ');
  if(selectedLevel){const goal=selectedLevel.goal;const ids=goal.targetIds;const chain=goal.minimumChain??goal.chain;let target,current,label;
   if(ids){target=ids.length;const remaining=new Set(game.board.filter(Boolean).map(gem=>gem.id));current=ids.filter(id=>!remaining.has(id)).length;label=lang==='en'?'Target gems cleared':'目標の石';}
   else if(chain){target=chain;current=game.maxChain;label=lang==='en'?'Best chain':'最大連鎖';}
   else{target=selectedLevel.board.filter(Boolean).length;current=game.phase==='won'?target:Math.max(0,target-game.board.filter(Boolean).length);label=lang==='en'?'Clear the board':'盤面を空にする';}
   $('#goal-text').textContent=`${label}: ${current} / ${target}`;$('#goal-progress').max=target||1;$('#goal-progress').value=Math.min(current,target);$('#goal-progress').setAttribute('aria-label',label);
   const placed=game.completedPieces??game.completedPairs;$('#budget').textContent=`${lang==='en'?'Pieces left':'残り'}: ${Math.max(0,selectedLevel.queue.length-placed)}`;
  }
  $('#score').textContent = String(game.score); $('#chain').textContent = String(game.maxChain);
  if(!selectedLevel&&game.settings.pieceLimit){const total=game.settings.pieceLimit,placed=game.completedPieces;$('#goal-text').textContent=`${lang==='ja'?'置いた石':'Pieces placed'}: ${placed}/${total}`;$('#goal-progress').max=total;$('#goal-progress').value=placed;$('#budget').textContent=`${lang==='ja'?'残り':'Pieces left'}: ${Math.max(0,total-placed)}`;}
  $('#next').innerHTML = game.next.map(piece => `<div class="next-piece" aria-label="Next: ${piece.join(', ')}">${piece.map(colour => gemMarkup({ colour })).join('')}</div>`).join('');
  const t = words[lang]; let status = game.phase === 'lost' ? (selectedLevel?(lang==='en'?'Challenge ended before the goal was reached':'目標を達成できませんでした'):t.lost) : game.phase === 'won' || game.phase === 'finished' ? t.won : game.phase === 'paused' ? t.paused : game.phase === 'clear-mark' ? (game.resolutionChain > 1 ? `Chain ${game.resolutionChain}` : `Clear · ${game.pendingClear?.length ?? 0}`) : t.place;
  const lastWave = game.waves.at(-1); if (lastWave && ['clear-mark', 'clear-remove', 'gravity'].includes(game.phase)) status = lastWave.chain > 1 ? `Chain ${lastWave.chain}` : `Clear · ${lastWave.clearedIds.length}`;
  $('#status').textContent = status;
  document.documentElement.lang = lang;$('#lesson').options[0].textContent=lang==='en'?'No lesson':'レッスンなし';for(const option of [...$('#lesson').options].slice(1)){option.textContent=tutorialManifest.find(item=>item.id===option.value).title[lang];}$('#level').options[0].textContent=lang==='en'?'Free play':'自由に遊ぶ';for(const option of [...$('#level').options].slice(1)){const level=levelManifest.find(item=>item.id===option.value);option.textContent=`${level.number} · ${level.marks}/5 · ${level.title[lang]}`;}
  document.querySelectorAll('[data-i]').forEach(el => { const key = el.dataset.i; if (t[key]) el.textContent = t[key]; });
  $('[data-action="place"]').textContent = t.placeButton; $('[data-action="hard-drop"]').textContent = t.drop; $('[data-action="soft-drop"]').textContent = t.down;
  $('[data-action="left"]').setAttribute('aria-label', t.left); $('[data-action="right"]').setAttribute('aria-label', t.right); $('[data-action="pause"]').textContent = t.pause; $('[data-action="resume"]').textContent = t.resume;
  const terminal=['won','lost','finished'].includes(game.phase);document.querySelectorAll('.controls [data-action]').forEach(button=>{button.disabled=terminal;});const relaxed = game.settings.mode === 'relaxed'; $('.drop').hidden = relaxed; $('.soft').hidden = relaxed; $('.place').hidden = !relaxed;
  $('.pause').hidden = game.phase === 'paused' || ['won', 'lost', 'finished'].includes(game.phase);
  $('.resume').hidden = game.phase !== 'paused'; $('.resume').disabled = false;
  $('#well').parentElement.className = `well-wrap material-${$('#material').value}`;
  document.querySelectorAll('[data-lang]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.lang === lang)));
  const nextLevel=selectedLevel&&!selectedLevel.lesson?levelManifest[levelManifest.findIndex(level=>level.id===selectedLevel.id)+1]:null;updateEnding({phase:game.phase,score:game.score,lang,mode:game.settings.mode,level:selectedLevel,next:nextLevel,onRestart:()=>newGame(true),onNext:()=>{$('#level').value=nextLevel.id;$('#lesson').value='';newGame();},detail:status});
}
function cellLabel(index, width, markup) { const y = Math.floor(index / width) - 3; const x = index % width; const gem = markup.match(/aria-label="([a-z]+)"/); return gem ? `${gem[1]} gem, column ${x + 1}, row ${y + 1}` : `Empty, column ${x + 1}, row ${y + 1}`; }
function save() { try { localStorage.setItem(saveKey, encodeGame(game)); } catch { /* Storage failure never interrupts play. */ } }
function queueSave() { if(!saveTimer)saveTimer=setTimeout(()=>{saveTimer=0;save();},350); }
function playAction(kind) {
  const result = applyAction(game, { kind }); if (!result.accepted) return false;
  game = result.state; render(); queueSave();
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
  let actions; [actions, input] = actionsForTick(input);
  for (const action of pendingReleases) input = setHeldAction(input, action, false);
  pendingReleases.clear();
  for (const item of actions) {
    const wasFalling = game.phase === 'falling'; const oldPieces = game.completedPieces; playAction(item.kind);
    if ((wasFalling && game.phase !== 'falling') || game.completedPieces > oldPieces) endedPiece = true;
  }
  if (endedPiece || game.phase !== 'falling') input = releaseAllActions(input);
  const beforeTick = game; const result = advanceTicks(game, 1); game = result.state;
  if (game !== beforeTick) {for(const event of result.events)if(event.type==='cells-cleared')playTone(event.chain??1); render(); queueSave(); }
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
$('#mode').addEventListener('change',()=>{$('#level').value='';$('#lesson').value='';syncSetup();});
for (const selector of ['#mode', '#preset', '#colours']) $(selector).addEventListener('change', () => { $('#pending').hidden = false; });
$('#material').addEventListener('change', () => { render(); writePreferences(); });
$('#motion').addEventListener('change', event => { document.documentElement.dataset.motion = event.target.checked ? 'reduced' : 'full'; writePreferences(); });
$('#sound').addEventListener('change',event=>{setSound(event.target.checked);writePreferences();});
document.querySelectorAll('[data-lang]').forEach(button => button.addEventListener('click', () => { lang = button.dataset.lang;syncSetup(); render(); writePreferences(); }));
const keypadKeys = { Numpad4: 'arrowleft', Numpad6: 'arrowright', Numpad7: 'z', Numpad9: 'x', Numpad5: 'arrowdown', Numpad2: 'drop' };
document.addEventListener('keydown', event => {
  const target = event.target instanceof HTMLElement ? event.target : null;
  const withinGame = target?.closest('.game-screen') || document.activeElement === document.body;
  if (!withinGame || target?.closest('input,select,textarea,[contenteditable]:not([contenteditable="false"])')) return;
  const key = keypadKeys[event.code] ?? event.key.toLowerCase();
  const holds = { arrowleft: 'left', arrowright: 'right', arrowdown: 'soft-drop' };
  if (holds[key]) { event.preventDefault(); if (!heldKeys.has(event.code)) { heldKeys.set(event.code, holds[key]); beginHold(holds[key]); } return; }
  if (key === ' ' && target?.closest('button')) return;
  const map = { x: 'cycle-forward', arrowup: 'cycle-forward', z: 'cycle-backward', drop: game.settings.mode === 'relaxed' ? 'place' : 'hard-drop', ' ': game.settings.mode === 'relaxed' ? 'place' : 'hard-drop' };
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
window.addEventListener('blur', () => { releaseInputs(); if (game?.settings.mode !== 'relaxed' && game?.phase !== 'paused') playAction('pause'); });
document.addEventListener('visibilitychange', () => { if (document.hidden) { releaseInputs(); if (game?.settings.mode !== 'relaxed' && game?.phase !== 'paused') playAction('pause'); } });
$('.resume').addEventListener('click', resumeCountdown);
window.addEventListener('pagehide', () => { clearTimeout(saveTimer); if (game && game.settings.mode !== 'relaxed' && game.phase === 'falling') game = applyAction(game, { kind: 'pause' }).state; save(); });

$('#lesson').innerHTML='<option value="">No lesson</option>'+tutorialManifest.map(lesson=>`<option value="${lesson.id}">${lesson.title.en}</option>`).join('');
$('#level').addEventListener('change',()=>{$('#lesson').value='';syncSetup();writePreferences();});$('#lesson').addEventListener('change',()=>{$('#level').value='';syncSetup();writePreferences();});
$('#level').innerHTML='<option value="">Free play</option>'+levelManifest.map(level=>`<option value="${level.id}">${level.number} · ${level.marks}/5 · ${level.title.en}</option>`).join('');
readPreferences();

try { const saved = localStorage.getItem(saveKey); if (saved) { game = decodeGame(saved);selectedLevel=levelManifest.find(level=>level.seed===game.settings.seed)??null;const restoredLesson=tutorialManifest.find(lesson=>`lesson:${lesson.id}`===game.settings.seed);if(restoredLesson){selectedLevel={...restoredLesson,...restoredLesson.setup,seed:game.settings.seed,lesson:true};$('#lesson').value=restoredLesson.id;}if(selectedLevel&&!selectedLevel.lesson)$('#level').value=selectedLevel.id; startOptions = { mode: game.settings.mode, width: game.settings.width, height: game.settings.height, seed: game.settings.seed, colourCount: game.settings.colourCount, ...(game.settings.pieceLimit ? { pieceLimit: game.settings.pieceLimit } : {}) }; if (game.phase === 'falling' && game.settings.mode !== 'relaxed') game = applyAction(game, { kind: 'pause' }).state;  } } catch { game = null; }
if (!game) newGame(); else { restoreControls();if(selectedLevel||game.settings.mode==='daily')syncSetup();resumeRequired = false; render(); if(!['won','lost','finished'].includes(game.phase))$('.game-screen').focus({ preventScroll: true }); }
requestAnimationFrame(animate);

$('#animations').checked=animationEnabled();$('#animations').addEventListener('change',event=>setAnimations(event.target.checked));

for(const option of $('#preset').options){if(['deep','large','extraWide'].includes(option.value)&&globalThis.housekiConfig?.oversizedUnlocked===false){option.disabled=true;option.textContent+=' · Locked';}}
for(const button of document.querySelectorAll('[data-scroll]'))button.addEventListener('click',()=>{const area=$('.well-scroll');area.scrollTop=button.dataset.scroll==='top'?0:area.scrollHeight;});
$('.well-scroll').addEventListener('scroll',event=>{const area=event.target;$('.scroll-position').textContent=`${Math.round(area.scrollTop/Math.max(1,area.scrollHeight-area.clientHeight)*100)}%`;});

$('#sound').checked=soundEnabled();document.addEventListener('pointerdown',unlockSound);document.addEventListener('keydown',unlockSound);
