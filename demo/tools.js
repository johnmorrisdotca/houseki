import {preferredLanguage,refreshAppearanceLanguage} from './appearance.js';
import {updateEnding} from './ending.js';
import { soundEnabled, setSound, unlockSound, playTone } from './audio.js';
import { positions, settle, animationEnabled, setAnimations } from './animation.js';
import { readFreeSettings, restoreFreeSettings, syncAuthoredSettings } from './settings.js';
import * as swap from './dist/gem-swap.js';
import * as collapse from './dist/stone-collapse.js';
const $ = selector => document.querySelector(selector);
const engines = { 'gem-swap': {...swap, levelManifest:swap.GEM_SWAP_CAMPAIGN, tutorialManifest:swap.GEM_SWAP_LESSONS, createLevel:id=>swap.createGame(swap.GEM_SWAP_CAMPAIGN.find(level=>level.id===id).options)}, 'stone-collapse': collapse };
const symbols = { red: '●', blue: '◆', green: '▲', gold: '■', purple: '+', teal: '☾' };
const powers = { 'row-beam': '↔', 'column-beam': '↕', bomb: '✹', 'colour-burst': '✦' };
const text = {
 en: { mode:'Mode',lessonLabel:'Learn to play',challengeLabel:'Challenge level',hint:'Hint',reshuffle:'Reshuffle',intro:'Full boards, useful tools and careful choices.', falling:'Falling Triplets', development:'Development demo · Campaign and player refinement are in progress.', game:'Game', board:'Board', shape:'Shape', colours:'Colours', sound:'Sound effects',animations:'Animation', enable:'Stored tools', advanced:'Rare Black Hole power', code:'Board code (optional)', 'black-hole':'Black Hole', rare:'ordinary clears toward a Black Hole', charges:'charges', remaining:'moves left', new:'New game', restart:'Restart', apply:'Select New game to apply changed settings.', keyboard:'Keyboard: arrows move board focus; Enter selects. Escape cancels. Tab reaches tools and confirmation.', score:'Score', moves:'Moves', tray:'Tool tray', confirm:'Confirm', cancel:'Cancel', undo:'Undo', assisted:'Assisted run · a stored tool or undo was used.', bomb:'Bomb', 'row-clear':'Row clear', 'colour-clear':'Colour clear', pick:'Pick', target:'Choose a stone to preview this tool.', preview:'stones will be removed. Confirm or cancel.', earning:'ordinary clears toward the next tool', choose:'Choose a group or a tool.', chooseSwap:'Choose a gem or a tool.', swap:'Select a gem, then an adjacent gem to match three or more. Larger matches create special gems.', collapse:'Select a connected group of two or more stones. Confirm, or tap the group again, to remove it.', invalid:'That move is unavailable. Choose another stone.', goalWon:'Goal complete!',timeUp:'Time is up.',goalLost:'Goal not reached.',dailyDone:'Daily complete.',won:'Board cleared!', finished:'No moves or tools remain.', clearing:'Resolving…', disabled:'Stored tools are off.', small:'This board uses small stones. Choose Compact for larger targets.' },
 ja: { mode:'モード',lessonLabel:'遊び方',challengeLabel:'チャレンジ',hint:'ヒント',reshuffle:'並べ替え',intro:'盤面いっぱいの石と、便利な道具。', falling:'三つの宝石', development:'開発中のデモ · レベルと操作画面を調整中です。', game:'ゲーム', board:'盤面', shape:'形', colours:'色数', sound:'効果音',animations:'アニメーション', enable:'道具を使う', advanced:'ブラックホール', code:'盤面コード（任意）', 'black-hole':'ブラックホール', rare:'個消すとブラックホールを獲得', charges:'残り吸収数', remaining:'残り手数', new:'新しいゲーム', restart:'やり直す', apply:'設定の変更後は「新しいゲーム」を選んでください。', keyboard:'矢印キーで盤面を移動、Enterで選択。Escapeで取消。Tabで道具と確認へ。', score:'得点', moves:'手数', tray:'道具箱', confirm:'確認', cancel:'取消', undo:'一手戻す', assisted:'道具または一手戻すを使いました。', bomb:'爆弾', 'row-clear':'横一列', 'colour-clear':'同じ色', pick:'一つ消す', target:'石を選ぶと効果を確認できます。', preview:'個の石を消します。確認または取消を選んでください。', earning:'個消すと次の道具を獲得', choose:'石のグループか道具を選んでください。', chooseSwap:'石か道具を選んでください。', swap:'石を選び、隣の石と入れ替えて三つ以上並べます。大きな形で特殊な石ができます。', collapse:'同じ色の隣接する石を二つ以上選びます。確認または同じグループをもう一度選ぶと消えます。', invalid:'この手は使えません。別の石を選んでください。', goalWon:'目標達成！',timeUp:'時間切れです。',goalLost:'目標を達成できませんでした。',dailyDone:'今日のゲームが終わりました。',won:'盤面を空にしました！', finished:'使える手と道具がありません。', clearing:'処理中…', disabled:'道具は無効です。', small:'石が小さい盤面です。Compactでは石が大きくなります。' }
};
let selectedLevel=null, pendingLevel=null, saveTimer=0;let lang=preferredLanguage(), state, engine, startOptions, activeUi=null, freePreferences=null, selectedCell=null, focusCell=0, notice='', lastFrame=0, remainder=0;
const presetSizes={compact:[6,6],standard:[8,8],wide:[10,6],tall:[6,10],extraWide:[16,10],deep:[8,32],large:[12,32]};
function canonical(value){if(Array.isArray(value))return `[${value.map(canonical).join(',')}]`;if(value&&typeof value==='object')return `{${Object.keys(value).sort().map(key=>`${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`;return JSON.stringify(value);}
function contentFor(kind,id){if(!kind||typeof id!=='string')return null;const list=kind==='lesson'?engine.tutorialManifest:engine.levelManifest;return list?.find(item=>item.id===id)??null;}
function contentMatches(state,kind,item){
 if(!item)return false;
 if(state.game==='stone-collapse')return state.settings.challengeId===item.id;
 if(kind==='level'){
  const expected=engine.createLevel(item.id);
  return canonical(expected.initialOptions)===canonical(state.initialOptions)&&canonical(expected.challenge)===canonical(state.challenge);
 }
 const expected=engine.createGame(item.initial);
 return canonical(expected.initialOptions)===canonical(state.initialOptions);
}
function makeUiContext(){const authored=Boolean(selectedLevel)||state.mode==='daily';return {version:1,game:state.game,mode:$('#mode').value||'relaxed',preset:$('#preset').value,shape:$('#shape').value,colourCount:Number($('#colours').value),code:$('#code').value.trim(),tools:$('#tools').checked,advanced:$('#advanced').checked,content:selectedLevel?{kind:selectedLevel.lesson?'lesson':'level',id:selectedLevel.id}:null,freePreferences:authored?freePreferences:null};}
function validateUiContext(value,savedState){
 if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).sort().join(',')!=='advanced,code,colourCount,content,freePreferences,game,mode,preset,shape,tools,version')return null;
 if(value.version!==1||value.game!==savedState.game||!['gem-swap','stone-collapse'].includes(value.game)||!['relaxed','arcade','daily','challenge'].includes(value.mode)||(!Object.hasOwn(presetSizes,value.preset)&&value.preset!=='authored')||!['','heart','star','hexagon'].includes(value.shape)||!Number.isInteger(value.colourCount)||value.colourCount<2||value.colourCount>6||typeof value.code!=='string'||value.code.length>128||typeof value.tools!=='boolean'||typeof value.advanced!=='boolean')return null;
 const preferences=value.freePreferences;
 if(preferences!==null&&(!preferences||typeof preferences!=='object'||Array.isArray(preferences)||Object.keys(preferences).some(key=>!['mode','preset','colours','shape','tools','advanced','code','nature','weather'].includes(key))||!['relaxed','arcade','daily'].includes(preferences.mode)||!Object.hasOwn(presetSizes,preferences.preset)||!['','heart','star','hexagon'].includes(preferences.shape)||!/^([2-6])$/.test(preferences.colours)||typeof preferences.code!=='string'||preferences.code.length>128||typeof preferences.tools!=='boolean'||typeof preferences.advanced!=='boolean'))return null;
 if(value.content===null){const settings=savedState.settings;const mode=savedState.mode??settings.mode;if(mode==='daily'){const daily=engine.createGame({mode:'daily',dailyDate:savedState.dailyDate??settings.dailyDate}).settings;if(value.mode!=='daily'||value.preset!=='authored'||value.shape!==(daily.shape??'')||value.colourCount!==daily.colourCount||value.tools!==Boolean(daily.tools)||value.advanced!==Boolean(daily.advancedTools)||value.code!==String(daily.seed))return null;return value;}const dimensions=presetSizes[value.preset];if(value.mode!==mode||value.shape!==(settings.shape??'')||value.colourCount!==settings.colourCount||value.tools!==Boolean(settings.tools)||value.advanced!==Boolean(settings.advancedTools)||value.preset==='authored'||(!value.shape&&(dimensions?.[0]!==settings.width||dimensions?.[1]!==settings.height))||(value.code&&value.code!==String(settings.seed))||value.freePreferences!==null)return null;return value;}
 if(!value.content||typeof value.content!=='object'||Array.isArray(value.content)||Object.keys(value.content).sort().join(',')!=='id,kind'||!['level','lesson'].includes(value.content.kind)||typeof value.content.id!=='string'||value.content.id.length>128||!preferences||!['relaxed','challenge'].includes(value.mode))return null;
 const item=contentFor(value.content.kind,value.content.id);
 if(!item||!contentMatches(savedState,value.content.kind,item))return null;
 const settings=savedState.settings;
 if(value.mode!=='challenge'||value.preset!=='authored'||value.shape!==(settings.shape??'')||value.colourCount!==settings.colourCount||value.tools!==Boolean(settings.tools)||value.advanced!==Boolean(settings.advancedTools)||String(settings.seed)!==value.code)return null;
 return value;
}
function presetForSize(width,height){return Object.keys(presetSizes).find(name=>presetSizes[name][0]===width&&presetSizes[name][1]===height)??'compact';}
function dailySettings(date=new Date().toISOString().slice(0,10)){return {...engine.createGame({mode:'daily',dailyDate:date}).settings,mode:'daily'};}
function restoreUi(context,savedState){
 if(context){
  $('#mode').value=context.mode;$('#preset').value=context.preset;$('#shape').value=context.shape;$('#colours').value=String(context.colourCount);$('#code').value=context.code;$('#tools').checked=context.tools;$('#advanced').checked=context.advanced;
  selectedLevel=context.content?{...contentFor(context.content.kind,context.content.id),lesson:context.content.kind==='lesson'}:null;pendingLevel=selectedLevel;freePreferences=context.freePreferences;
  $('#level').value=selectedLevel&&!selectedLevel.lesson?selectedLevel.id:'';$('#lesson').value=selectedLevel?.lesson?selectedLevel.id:'';
  if(freePreferences)restoreFreeSettings(freePreferences);
  syncAuthoredSettings(selectedLevel?authoredSettings(selectedLevel):(savedState.mode??savedState.settings.mode)==='daily'?{...savedState.settings,mode:'daily'}:null,lang);
  return context;
 }
 const settings=savedState.settings;const actualMode=savedState.mode??settings.mode;$('#mode').value=['relaxed','arcade','daily'].includes(actualMode)?actualMode:'relaxed';
 $('#preset').value=presetForSize(settings.width,settings.height);$('#shape').value=settings.shape??'';$('#colours').value=String(settings.colourCount);$('#code').value=String(settings.seed);$('#tools').checked=Boolean(settings.tools);$('#advanced').checked=Boolean(settings.advancedTools);
 const exactLevel=(engine.levelManifest??[]).find(item=>contentMatches(savedState,'level',item));
 const exactLesson=(engine.tutorialManifest??[]).find(item=>contentMatches(savedState,'lesson',item));
 selectedLevel=exactLevel?{...exactLevel,lesson:false}:exactLesson?{...exactLesson,lesson:true}:null;pendingLevel=selectedLevel;
 $('#level').value=exactLevel?.id??'';$('#lesson').value=exactLesson?.id??'';
 if(selectedLevel){freePreferences=freePreferences??readFreeSettings();syncAuthoredSettings(authoredSettings(selectedLevel),lang);}else if(actualMode==='daily')syncAuthoredSettings({...settings,mode:'daily'},lang);
 return makeUiContext();
}
function authoredSettings(item){
 if($('#game').value==='gem-swap')return item.lesson?engine.createGame(item.initial).settings:engine.createLevel(item.id).settings;
 if(item.lesson)return {width:item.setup.width,height:item.setup.height,colourCount:item.setup.colourCount,seed:`lesson:${item.id}`,tools:false};
 return engine.createLevel(item.id).settings;
}
function modeSettings(mode){return mode==='daily'?dailySettings():null;}
function selectionChanged(kind){
 const id=$(`#${kind}`).value;
 if(!id){$('#level').value='';$('#lesson').value='';pendingLevel=null;syncAuthoredSettings(null,lang);if(freePreferences)restoreFreeSettings(freePreferences);freePreferences=null;return;}
 const other=kind==='lesson'?'level':'lesson';$(`#${other}`).value='';const item=contentFor(kind,id);if(!item)return;
 if(!pendingLevel)freePreferences=readFreeSettings();pendingLevel={...item,...(kind==='lesson'?{...item.setup,seed:`lesson:${item.id}`,lesson:true}:{lesson:false})};
 syncAuthoredSettings(authoredSettings(pendingLevel),lang);
}
function modeChanged(){
 const chosen=$('#mode').value;
 const locked=Boolean($('#preset').dataset.authoredLock);
 if($('#level').value||$('#lesson').value||pendingLevel){$('#level').value='';$('#lesson').value='';pendingLevel=null;}
 if(chosen==='daily'){
  if(locked)syncAuthoredSettings(null,lang);
  if(!freePreferences)freePreferences=readFreeSettings();
  syncAuthoredSettings(modeSettings('daily'),lang);
 }else{
  if(locked)syncAuthoredSettings(null,lang);
  if(freePreferences)restoreFreeSettings(freePreferences);
  freePreferences=null;$('#mode').value=chosen;
 }
}
function catalog(){
 engine=engines[$('#game').value];
 for(const option of $('#preset').options)if(['extraWide','deep','large'].includes(option.value))option.disabled=globalThis.housekiConfig?.oversizedUnlocked===false;if($('#preset').selectedOptions[0]?.disabled)$('#preset').value='standard';
 $('#level').innerHTML='<option value="">Free play</option>'+(engine.levelManifest??[]).map(level=>`<option value="${level.id}">${level.number} · ${level.marks??level.difficultyMarks}/5 · ${level.title[lang]}</option>`).join('');
 $('#lesson').innerHTML='<option value="">No lesson</option>'+(engine.tutorialManifest??[]).map(lesson=>`<option value="${lesson.id}">${lesson.title[lang]}</option>`).join('');
 $('#level').parentElement.hidden=!engine.levelManifest;$('#lesson').parentElement.hidden=!engine.tutorialManifest;
}
function save(){if(engine.encodeGame)try{localStorage.setItem('houseki-full-board-game',state.game);localStorage.setItem(`houseki-${state.game}-save`,engine.encodeGame(state));if(activeUi)localStorage.setItem(`houseki-${state.game}-ui`,JSON.stringify(activeUi));}catch{/* Optional storage. */}}
function queueSave(){if(!saveTimer)saveTimer=setTimeout(()=>{saveTimer=0;save();},500);}
function newGame(restart=false) {
 engine=engines[$('#game').value];
 let nextLevel=selectedLevel;
 if(!restart){
  const lesson=(engine.tutorialManifest??[]).find(item=>item.id===$('#lesson').value);
  nextLevel=lesson?{...lesson,...lesson.setup,seed:`lesson:${lesson.id}`,lesson:true}:(engine.levelManifest??[]).find(item=>item.id===$('#level').value)??null;
  if(nextLevel&&!freePreferences)freePreferences=readFreeSettings();
  startOptions=$('#mode').value==='daily'?{mode:'daily',dailyDate:new Date().toISOString().slice(0,10)}:{ ...(!$('#shape').value?{preset:$('#preset').value}:{}), mode:$('#mode').value||'relaxed', colourCount:Number($('#colours').value), seed:$('#code').value.trim()||crypto.randomUUID(), tools:$('#tools').checked, ...($('#game').value==='gem-swap'?{advancedTools:$('#tools').checked&&$('#advanced').checked}:{}), ...($('#shape').value ? {shape:$('#shape').value}:{} ) };
 }
 try {
  const nextState=restart&&engine.restartGame?engine.restartGame(state):nextLevel?nextLevel.lesson?nextLevel.initial?engine.createGame(nextLevel.initial):engine.createChallenge({id:nextLevel.id,seed:nextLevel.seed,width:nextLevel.setup.width,height:nextLevel.setup.height,colourCount:nextLevel.setup.colourCount,initialBoard:nextLevel.board,goal:nextLevel.goal,moveLimit:nextLevel.setup.moveLimit,witness:nextLevel.witness}):engine.createLevel(nextLevel.id):engine.createGame(startOptions);
  state=nextState;
  if(!restart){selectedLevel=nextLevel;pendingLevel=nextLevel;if(selectedLevel)syncAuthoredSettings(authoredSettings(selectedLevel),lang);else if((state.mode??state.settings.mode)==='daily'){if(!freePreferences)freePreferences=readFreeSettings();syncAuthoredSettings({...state.settings,mode:'daily'},lang);}else{syncAuthoredSettings(null,lang);freePreferences=null;}activeUi=makeUiContext();}selectedCell=null;focusCell=state.settings.mask.findIndex(Boolean);notice='';render();save();$('.full-cell:not(.masked)').focus({preventScroll:true});
 }catch(error){$('#status').textContent=error.message;}
}

function act(action) {
 const result=engine.applyAction(state,action);
 if(result.accepted){state=result.state;notice='';const hint=result.events.find(event=>event.type==='hint');if(hint?.action){selectedCell=hint.action.from;focusCell=hint.action.to;notice=lang==='en'?`Try the highlighted gem with row ${Math.floor(hint.action.to/state.settings.width)+1}, column ${hint.action.to%state.settings.width+1}.`:'選んだ石と、次のマスを入れ替えてみましょう。';}queueSave();}else notice=text[lang].invalid;
 render();return result.accepted;
}
function cellClick(cell) {
 if(state.phase!=='ready'||!state.board[cell])return;
 focusCell=cell;
 if(state.selectedTool){act({kind:'target-tool',cell});return;}
 if(state.game==='stone-collapse'){act({kind:'select',stoneId:state.board[cell].id});return;}
 if(selectedCell===null){selectedCell=cell;notice='';render();return;}
 if(selectedCell===cell){selectedCell=null;render();return;}
 const from=selectedCell;selectedCell=null;
 if(!act({kind:'swap',from,to:cell})){selectedCell=cell;render();}
}
function render() {
 const previous=positions($('#grid'));
 refreshAppearanceLanguage(lang);document.querySelectorAll('[data-lang]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.lang===lang)));const t=text[lang];document.documentElement.lang=lang;
 document.querySelectorAll('[data-i]').forEach(e=>{e.textContent=t[e.dataset.i];});
 $('#title').textContent=state.game==='gem-swap'?'Gem Swap':'Stone Collapse';$('#score').textContent=state.score;$('#moves').textContent=state.moves;
 $('#instructions').textContent=state.game==='gem-swap'?t.swap:t.collapse;
 const grid=$('#grid'), {width,height,mask}=state.settings;
 const activeFocus=document.activeElement?.closest('[data-cell]');const restoreFocus=activeFocus?Number(activeFocus.dataset.cell):null;
 grid.dataset.phase=state.phase;$('.board-scroll').dataset.oversized=String(height>16||width>12);for(const option of $('#preset').options){if(['extraWide','deep','large'].includes(option.value))option.disabled=globalThis.housekiConfig?.oversizedUnlocked===false;}grid.style.setProperty('--cols',width);grid.style.setProperty('--rows',height);grid.setAttribute('aria-rowcount',height);grid.setAttribute('aria-colcount',width);
 if(grid.children.length!==state.board.length) grid.innerHTML=state.board.map((_,i)=>`<button type="button" class="full-cell" role="gridcell" data-cell="${i}"></button>`).join('');
 const preview=new Set(state.toolPreview??[]);const groups=new Set(state.selectedIds??[]);const clearing=new Set(state.pendingCells??[]);const pendingIds=new Set(state.pendingIds??[]);
 [...grid.children].forEach((button,cell)=>{
  const gem=state.board[cell];const portal=state.blackHole?.cell===cell;
  button.className=`full-cell${portal?' portal':''}${!mask[cell]?' masked':''}${cell===selectedCell||gem&&groups.has(gem.id)?' selected':''}${preview.has(cell)?' preview':''}${clearing.has(cell)||gem&&pendingIds.has(gem.id)?' clearing':''}`;
  button.dataset.gemId=gem?.id??'';button.dataset.colour=gem?.colour??'';button.dataset.kind=gem?.kind??'';
  button.style.setProperty('--strength',portal?String(state.blackHole.capacityRemaining/8):'0');
  const content=portal?`<span class="portal-ring">◉</span>`:gem?`<span class="gem ${gem.colour}" data-id="${gem.id}">${symbols[gem.colour]}</span>${gem.kind?`<span class="power-symbol">${powers[gem.kind]}</span>`:''}`:'';
  if(button.innerHTML!==content)button.innerHTML=content;
  button.disabled=!gem||state.phase!=='ready';button.tabIndex=cell===focusCell?0:-1;button.setAttribute('aria-selected',String(cell===selectedCell||Boolean(gem&&groups.has(gem.id))));button.setAttribute('aria-disabled',String(!gem||state.phase!=='ready'));
  button.setAttribute('aria-label',`${portal?`${t['black-hole']}, ${state.blackHole.capacityRemaining} ${t.charges}`:gem?`${gem.colour}${gem.kind?' '+gem.kind:''}`:'Empty'}, ${Math.floor(cell/width)+1}, ${cell%width+1}${preview.has(cell)?' · '+t.preview:''}`);
 });
 settle(grid,previous);
 if(restoreFocus!==null)grid.children[restoreFocus]?.focus({preventScroll:true});
 const legal=engine.legalActions(state);
 const tools=state.game==='gem-swap'?['bomb','row-clear','colour-clear', ...(state.settings.advancedTools?['black-hole']:[])]:['bomb','pick'];
 $('#advanced').disabled=Boolean($('#advanced').dataset.authoredLock)||!$('#tools').checked||$('#tools').disabled;
 $('#advanced-field').hidden=state.game!=='gem-swap';
 const inventory=$('#inventory');if(inventory.dataset.catalog!==tools.join(',')){inventory.dataset.catalog=tools.join(',');inventory.innerHTML=tools.map(tool=>`<button type="button" class="fam-button" data-tool="${tool}"></button>`).join('');}
 for(const button of inventory.children){const tool=button.dataset.tool;const count=tool==='black-hole'?state.blackHoleCharges:state.inventory?.[tool]??0;button.textContent=`${tool==='bomb'?'✹':tool==='row-clear'?'↔':tool==='colour-clear'?'✦':'⊙'} ${t[tool]} × ${count}`;button.disabled=!legal.some(action=>action.kind==='select-tool'&&action.tool===tool);button.setAttribute('aria-pressed',String(state.selectedTool===tool));}
 $('#rare-earning').hidden=!state.settings.advancedTools;$('#rare-earning').textContent=`${state.blackHoleProgress??0}/48 ${t.rare}`;
 $('#portal-state').hidden=!state.blackHole;$('#portal-state').textContent=state.blackHole?`${t['black-hole']}: ${state.blackHole.capacityRemaining}/8 ${t.charges} · ${state.blackHole.movesRemaining} ${t.remaining}`:'';
 $('#earning').textContent=state.settings.tools?`${state.toolProgress??0}/12 ${t.earning}`:t.disabled;
 $('#size-hint').textContent=t.small;$('#size-hint').hidden=grid.querySelector('.full-cell:not(.masked)').getBoundingClientRect().width>=28;
 $('#preview').textContent=state.selectedTool?preview.size?`${preview.size} ${t.preview}`:t.target:state.game==='stone-collapse'&&groups.size?`${groups.size} · +${state.previewScore}`:'';
 $('#preview').hidden=!$('#preview').textContent;
 $('#confirm').disabled=!legal.some(action=>action.kind==='confirm'||action.kind==='confirm-tool');
 $('#cancel').disabled=!legal.some(action=>action.kind==='cancel'||action.kind==='cancel-tool')&&!(state.phase==='ready'&&selectedCell!==null);
 $('#undo').hidden=!legal.some(action=>action.kind==='undo');$('#undo').disabled=!legal.some(action=>action.kind==='undo');$('#hint').hidden=!legal.some(action=>action.kind==='hint');$('#reshuffle').hidden=!legal.some(action=>action.kind==='reshuffle');
 $('#assisted').hidden=!state.assisted;
 const status=engine.statusOf(state);const goals=status.goalProgress??[];
 if(selectedLevel&&state.game==='stone-collapse'){const goal=selectedLevel.goal;let target,current;
  if(goal.kind==='score-target'){target=goal.minimumScore;current=state.score;}else{const ids=goal.targetIds??selectedLevel.board.filter(Boolean).map(stone=>stone.id);target=ids.length;const remaining=new Set(state.board.filter(Boolean).map(stone=>stone.id));current=ids.filter(id=>!remaining.has(id)).length;}
  goals.push({kind:goal.kind,target,current});
 }
 const labels=lang==='en'?{score:'Points',collect:'Gems collected',chain:'Best chain',seals:'Seals cleared','clear-all':'Stones cleared','clear-targets':'Target stones','score-target':'Points'}:{score:'得点',collect:'集めた石',chain:'最大連鎖',seals:'封印','clear-all':'消した石','clear-targets':'目標の石','score-target':'得点'};
 $('#objectives').hidden=!goals.length;$('#objectives').innerHTML=goals.map(goal=>`<p>${labels[goal.kind]??goal.kind}${goal.colour?' · '+goal.colour:''}: ${goal.current} / ${goal.target}</p><progress aria-label="${labels[goal.kind]??goal.kind}" max="${goal.target||1}" value="${Math.min(goal.current,goal.target)}"></progress>`).join('');
 const remainingMoves=status.remainingMoves??(selectedLevel?Math.max(0,selectedLevel.moveLimit-state.moves):null);$('#budget').hidden=remainingMoves===null&&status.remainingMs==null;$('#budget').textContent=status.remainingMs!=null?`${Math.ceil(status.remainingMs/1000)} s`:remainingMoves!==null?`${remainingMoves} ${t.remaining}`:'';
 const nextLevel=selectedLevel&&!selectedLevel.lesson?(engine.levelManifest??[])[(engine.levelManifest??[]).findIndex(level=>level.id===selectedLevel.id)+1]:null;updateEnding({phase:state.phase,outcome:state.outcome,score:state.score,lang,mode:state.mode??state.settings.mode,level:selectedLevel,next:nextLevel,onRestart:()=>newGame(true),onNext:()=>{$('#level').value=nextLevel.id;$('#lesson').value='';newGame();},detail:$('#status').textContent});
 $('#lesson-guide').hidden=!selectedLevel?.lesson;if(selectedLevel?.lesson)$('#lesson-guide').textContent=selectedLevel.steps.map(step=>(step.instruction??step.text)[lang]).join(' ');

 $('#status').textContent=notice||(['won','lost','finished'].includes(state.phase)?status.outcome==='won'?t.goalWon:status.remainingMs===0?t.timeUp:status.outcome==='lost'?t.goalLost:status.remainingMoves===0&&status.mode==='daily'?t.dailyDone:t[state.phase]??t.finished:state.phase!=='ready'?t.clearing:state.selectedTool?t.target:state.game==='gem-swap'?t.chooseSwap:t.choose);
}
$('#grid').addEventListener('click',event=>{const b=event.target.closest('[data-cell]');if(b)cellClick(Number(b.dataset.cell));});
$('#grid').addEventListener('keydown',event=>{
 const cell=Number(event.target.closest('[data-cell]')?.dataset.cell);if(!Number.isInteger(cell))return;
 const delta={ArrowLeft:-1,ArrowRight:1,ArrowUp:-state.settings.width,ArrowDown:state.settings.width}[event.key];
 if(delta){event.preventDefault();let next=cell+delta;while(next>=0&&next<state.board.length){if(Math.abs(delta)===1&&Math.floor(next/state.settings.width)!==Math.floor(cell/state.settings.width))break;if(state.settings.mask[next]){focusCell=next;render();$('#grid').children[next].focus();break;}next+=delta;}}
});
$('#inventory').addEventListener('click',event=>{const b=event.target.closest('[data-tool]');if(b){selectedCell=null;act({kind:'select-tool',tool:b.dataset.tool});}});
$('#confirm').addEventListener('click',()=>act({kind:state.selectedTool?'confirm-tool':'confirm'}));
function cancel(){selectedCell=null;if(state.selectedTool)act({kind:'cancel-tool'});else if(state.game==='stone-collapse')act({kind:'cancel'});else render();}
$('#cancel').addEventListener('click',cancel);document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!event.target.closest('input,select,textarea')){event.preventDefault();cancel();}});
$('#undo').addEventListener('click',()=>act({kind:'undo'}));$('#hint').addEventListener('click',()=>act({kind:'hint'}));$('#reshuffle').addEventListener('click',()=>act({kind:'reshuffle'}));$('#new').addEventListener('click',()=>newGame());$('#restart').addEventListener('click',()=>newGame(true));
$('#mode').addEventListener('change',modeChanged);
$('#game').addEventListener('change',()=>{if(pendingLevel||selectedLevel){syncAuthoredSettings(null,lang);if(freePreferences)restoreFreeSettings(freePreferences);}pendingLevel=null;freePreferences=null;catalog();$('#level').value='';$('#lesson').value='';if($('#mode').value==='challenge')$('#mode').value='relaxed';newGame();});
$('#level').addEventListener('change',()=>selectionChanged('level'));$('#lesson').addEventListener('change',()=>selectionChanged('lesson'));
document.querySelectorAll('[data-lang]').forEach(button=>button.addEventListener('click',()=>{lang=button.dataset.lang;syncAuthoredSettings(pendingLevel?authoredSettings(pendingLevel):$('#mode').value==='daily'?engine.createGame({mode:'daily',dailyDate:new Date().toISOString().slice(0,10)}).settings:null,lang);render();}));$('.game-screen').addEventListener('dragstart',event=>event.preventDefault());
function frame(timestamp){const elapsed=Math.min(100,timestamp-(lastFrame||timestamp));lastFrame=timestamp;if(state?.mode==='arcade'&&engine.advanceTime&&document.visibilityState==='visible'){state=engine.advanceTime(state,Math.round(elapsed)).state;render();queueSave();}remainder+=elapsed;const ticks=Math.min(6,Math.floor(remainder/(1000/60)));remainder-=ticks*(1000/60);if(ticks&&state&&!['ready','won','lost','finished'].includes(state.phase)){const result=engine.advanceTicks(state,ticks);state=result.state;for(const event of result.events)if(['cells-cleared','group-cleared','tool-cleared'].includes(event.type))playTone(event.chain??1);render();queueSave();}requestAnimationFrame(frame);}
window.addEventListener('resize',()=>{if(state)render();});
$('#animations').checked=animationEnabled();$('#animations').addEventListener('change',event=>setAnimations(event.target.checked));
try{const previousGame=localStorage.getItem('houseki-full-board-game');if(engines[previousGame])$('#game').value=previousGame;}catch{/* Optional preference. */}catalog();let recovered=false;try{const raw=localStorage.getItem(`houseki-${$('#game').value}-save`);if(raw&&engine.decodeGame){state=engine.decodeGame(raw);startOptions=state.initialOptions??{};let context=null;try{const sidecar=JSON.parse(localStorage.getItem(`houseki-${state.game}-ui`)??'null');context=validateUiContext(sidecar,state);}catch{/* Ignore invalid UI metadata; the replay remains authoritative. */}activeUi=restoreUi(context,state);focusCell=state.settings.mask.findIndex(Boolean);render();recovered=true;}}catch{/* Invalid or unavailable saves start fresh. */}if(!recovered)newGame();window.addEventListener('pagehide',save);requestAnimationFrame(frame);

$('#sound').checked=soundEnabled();$('#sound').addEventListener('change',event=>setSound(event.target.checked));document.addEventListener('pointerdown',unlockSound);document.addEventListener('keydown',unlockSound);
