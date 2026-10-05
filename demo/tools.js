import * as swap from './dist/gem-swap.js';
import * as collapse from './dist/stone-collapse.js';
const $ = selector => document.querySelector(selector);
const engines = { 'gem-swap': swap, 'stone-collapse': collapse };
const symbols = { red: '●', blue: '◆', green: '▲', gold: '■', purple: '+', teal: '☾' };
const powers = { 'row-beam': '↔', 'column-beam': '↕', bomb: '✹', 'colour-burst': '✦' };
const text = {
 en: { intro:'Full boards, useful tools and careful choices.', falling:'Falling Triplets', development:'Development demo · Campaign and player refinement are in progress.', game:'Game', board:'Board', shape:'Shape', colours:'Colours', enable:'Stored tools', new:'New game', restart:'Restart', apply:'Select New game to apply changed settings.', keyboard:'Keyboard: arrows move board focus; Enter selects. Escape cancels. Tab reaches tools and confirmation.', score:'Score', moves:'Moves', tray:'Tool tray', confirm:'Confirm', cancel:'Cancel', undo:'Undo', assisted:'Assisted run · a stored tool or undo was used.', bomb:'Bomb', 'row-clear':'Row clear', 'colour-clear':'Colour clear', pick:'Pick', target:'Choose a stone to preview this tool.', preview:'stones will be removed. Confirm or cancel.', earning:'ordinary clears toward the next tool', choose:'Choose a group or a tool.', swap:'Select a gem, then an adjacent gem to match three or more. Larger matches create special gems.', collapse:'Select a connected group of two or more stones. Confirm, or tap the group again, to remove it.', invalid:'That move is unavailable. Choose another stone.', won:'Board cleared!', finished:'No moves or tools remain.', clearing:'Resolving…', disabled:'Stored tools are off.' },
 ja: { intro:'盤面いっぱいの石と、便利な道具。', falling:'三つの宝石', development:'開発中のデモ · レベルと操作画面を調整中です。', game:'ゲーム', board:'盤面', shape:'形', colours:'色数', enable:'道具を使う', new:'新しいゲーム', restart:'やり直す', apply:'設定の変更後は「新しいゲーム」を選んでください。', keyboard:'矢印キーで盤面を移動、Enterで選択。Escapeで取消。Tabで道具と確認へ。', score:'得点', moves:'手数', tray:'道具箱', confirm:'確認', cancel:'取消', undo:'一手戻す', assisted:'道具または一手戻すを使いました。', bomb:'爆弾', 'row-clear':'横一列', 'colour-clear':'同じ色', pick:'一つ消す', target:'石を選ぶと効果を確認できます。', preview:'個の石を消します。確認または取消を選んでください。', earning:'個消すと次の道具を獲得', choose:'石のグループか道具を選んでください。', swap:'石を選び、隣の石と入れ替えて三つ以上並べます。大きな形で特殊な石ができます。', collapse:'同じ色の隣接する石を二つ以上選びます。確認または同じグループをもう一度選ぶと消えます。', invalid:'この手は使えません。別の石を選んでください。', won:'盤面を空にしました！', finished:'使える手と道具がありません。', clearing:'処理中…', disabled:'道具は無効です。' }
};
let lang='en', state, engine, startOptions, selectedCell=null, focusCell=0, notice='', lastFrame=0, remainder=0;
function newGame(restart=false) {
 engine=engines[$('#game').value];
 if(!restart) startOptions={ ...(!$('#shape').value?{preset:$('#preset').value}:{}), colourCount:Number($('#colours').value), seed:crypto.randomUUID(), tools:$('#tools').checked, ...($('#shape').value ? {shape:$('#shape').value}:{}), ...($('#game').value==='stone-collapse'?{mode:'relaxed'}:{}) };
 try {state=engine.createGame(startOptions);selectedCell=null;focusCell=state.settings.mask.findIndex(Boolean);notice='';render();$('.full-cell:not(.masked)').focus({preventScroll:true});} catch(error){$('#status').textContent=error.message;}
}
function act(action) {
 const result=engine.applyAction(state,action);
 if(result.accepted){state=result.state;notice='';}else notice=text[lang].invalid;
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
 const t=text[lang];document.documentElement.lang=lang;
 document.querySelectorAll('[data-i]').forEach(e=>{e.textContent=t[e.dataset.i];});$('#language').textContent=lang==='en'?'日本語':'English';
 $('#title').textContent=state.game==='gem-swap'?'Gem Swap':'Stone Collapse';$('#score').textContent=state.score;$('#moves').textContent=state.moves;
 $('#instructions').textContent=state.game==='gem-swap'?t.swap:t.collapse;
 const grid=$('#grid'), {width,height,mask}=state.settings;
 const activeFocus=document.activeElement?.closest('[data-cell]');const restoreFocus=activeFocus?Number(activeFocus.dataset.cell):null;
 grid.style.setProperty('--cols',width);grid.setAttribute('aria-rowcount',height);grid.setAttribute('aria-colcount',width);
 if(grid.children.length!==state.board.length) grid.innerHTML=state.board.map((_,i)=>`<button type="button" class="full-cell" role="gridcell" data-cell="${i}"></button>`).join('');
 const preview=new Set(state.toolPreview??[]);const groups=new Set(state.selectedIds??[]);const clearing=new Set(state.pendingCells??[]);const pendingIds=new Set(state.pendingIds??[]);
 [...grid.children].forEach((button,cell)=>{
  const gem=state.board[cell];button.className=`full-cell${!mask[cell]?' masked':''}${cell===selectedCell||gem&&groups.has(gem.id)?' selected':''}${preview.has(cell)?' preview':''}${clearing.has(cell)||gem&&pendingIds.has(gem.id)?' clearing':''}`;
  const content=gem?`<span class="gem ${gem.colour}">${symbols[gem.colour]}</span>${gem.kind?`<span class="power-symbol">${powers[gem.kind]}</span>`:''}`:'';
  if(button.innerHTML!==content)button.innerHTML=content;
  button.tabIndex=cell===focusCell?0:-1;button.setAttribute('aria-selected',String(cell===selectedCell||Boolean(gem&&groups.has(gem.id))));button.setAttribute('aria-disabled',String(!gem||state.phase!=='ready'));
  button.setAttribute('aria-label',`${gem?`${gem.colour}${gem.kind?' '+gem.kind:''}`:'Empty'}, ${Math.floor(cell/width)+1}, ${cell%width+1}${preview.has(cell)?' · '+t.preview:''}`);
 });
 if(restoreFocus!==null)grid.children[restoreFocus]?.focus({preventScroll:true});
 const tools=state.game==='gem-swap'?['bomb','row-clear','colour-clear']:['bomb','pick'];
 const inventory=$('#inventory');if(inventory.dataset.game!==state.game){inventory.dataset.game=state.game;inventory.innerHTML=tools.map(tool=>`<button type="button" class="fam-button" data-tool="${tool}"></button>`).join('');}
 for(const button of inventory.children){const tool=button.dataset.tool;button.textContent=`${tool==='bomb'?'✹':tool==='row-clear'?'↔':tool==='colour-clear'?'✦':'⊙'} ${t[tool]} × ${state.inventory?.[tool]??0}`;button.disabled=state.phase!=='ready'||!state.inventory?.[tool];button.setAttribute('aria-pressed',String(state.selectedTool===tool));}
 $('#earning').textContent=state.settings.tools?`${state.toolProgress??0}/12 ${t.earning}`:t.disabled;
 $('#preview').textContent=state.selectedTool?preview.size?`${preview.size} ${t.preview}`:t.target:state.game==='stone-collapse'&&groups.size?`${groups.size} · +${state.previewScore}`:'';
 $('#confirm').disabled=state.phase!=='ready'||!(state.selectedTool?preview.size:groups.size);
 $('#cancel').disabled=!state.selectedTool&&selectedCell===null&&!(state.selectedIds?.length);
 $('#undo').hidden=state.game!=='stone-collapse';$('#undo').disabled=!(state.history?.length)||!['ready','won','finished'].includes(state.phase);
 $('#assisted').hidden=!state.assisted;
 $('#status').textContent=notice||(['won','finished'].includes(state.phase)?t[state.phase]:state.phase!=='ready'?t.clearing:state.selectedTool?t.target:t.choose);
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
$('#undo').addEventListener('click',()=>act({kind:'undo'}));$('#new').addEventListener('click',()=>newGame());$('#restart').addEventListener('click',()=>newGame(true));$('#game').addEventListener('change',()=>newGame());
$('#language').addEventListener('click',()=>{lang=lang==='en'?'ja':'en';render();});$('#theme').addEventListener('click',()=>document.documentElement.dataset.theme=document.documentElement.dataset.theme==='dark'?'light':'dark');$('.game-screen').addEventListener('dragstart',event=>event.preventDefault());
function frame(timestamp){const elapsed=Math.min(100,timestamp-(lastFrame||timestamp));lastFrame=timestamp;remainder+=elapsed;const ticks=Math.min(6,Math.floor(remainder/(1000/60)));remainder-=ticks*(1000/60);if(ticks&&state&&!['ready','won','lost','finished'].includes(state.phase)){const result=engine.advanceTicks(state,ticks);state=result.state;render();}requestAnimationFrame(frame);}
newGame();requestAnimationFrame(frame);
