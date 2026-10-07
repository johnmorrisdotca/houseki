import {test} from 'vitest';
import assert from 'node:assert/strict';
import * as chains from '../dist/colour-chains.js';
import * as blocks from '../dist/magnetic-blocks.js';
const bands=[['entry',32],['easy',32],['intermediate',32],['hard',24],['expert',8]];
const turns={up:0,right:1,down:2,left:3};
function canonicalGeometry(level){
 const options=level.options??level,width=options.width,height=options.height,board=options.initialBoard??options.board,goal=options.goal;
 const variants=[];
 for(const mirror of [false,true]){
  const labels=new Map(),label=colour=>{if(!labels.has(colour))labels.set(colour,labels.size);return labels.get(colour);};
  const rows=[];for(let y=0;y<height;y++)for(let px=0;px<width;px++){const x=mirror?width-1-px:px,gem=board[y*width+x];rows.push(gem?[label(gem.colour),gem.magnetic===true,goal.kind==='clear-targets'&&goal.targetIds.includes(gem.id)]:null);}
  const queue=options.queue.map(piece=>(mirror&&piece.length===4?[piece[1],piece[0],piece[3],piece[2]]:piece).map(label));
  const mask=options.mask?Array.from({length:width*height},(_,i)=>options.mask[Math.floor(i/width)*width+(mirror?width-1-i%width:i%width)]):null;
  variants.push(JSON.stringify([width,height,options.colourCount,goal.kind,goal.chain??null,rows,queue,options.magneticQueue??null,options.weather??null,options.schedule??null,options.floorSwitch??false,options.magneticImpact??false,mask]));
 }
 return variants.sort()[0];
}
function resolve(engine,state){let ticks=0;while(['clear-mark','clear-remove','gravity'].includes(state.phase)&&ticks<100_000){state=engine.advanceTicks(state,3600).state;ticks+=3600;}assert.ok(!['clear-mark','clear-remove','gravity'].includes(state.phase));return state;}
for(const[name,engine,levels,create]of[['Magnetic Blocks',blocks,blocks.levelManifest,blocks.createLevel],['Shizen',chains,chains.shizenLevelManifest,chains.createShizenLevel],['Arashi',chains,chains.arashiLevelManifest,chains.createArashiLevel]]){
 test(`${name}: 128 measured challenges have complete bands, stable identities and ordered integer difficulty`,()=>{
  assert.equal(levels.length,128);assert.equal(new Set(levels.map(level=>level.id)).size,128);assert.equal(new Set(levels.map(level=>level.canonicalKeyHash)).size,128);assert.equal(new Set(levels.map(canonicalGeometry)).size,128,"Seeds, retained proofs, colours or mirrored layouts cannot inflate the count");
  assert.deepEqual(levels.map(level=>level.number),Array.from({length:128},(_,i)=>i+1));assert.deepEqual(levels.map(level=>level.score),levels.map(level=>level.score).sort((a,b)=>a-b));
  let first=0;for(const[band,count]of bands){assert.equal(levels.filter(level=>level.band===band).length,count);assert.ok(levels.slice(first,first+count).every(level=>level.band===band));const tier=bands.findIndex(([id])=>id===band);assert.ok(levels.slice(first,first+count).every(level=>level.score>=1+tier*20&&level.score<=20+tier*20));first+=count;}
  for(const level of levels){assert.ok(Number.isInteger(level.score)&&level.score>=1&&level.score<=100);assert.equal(level.marks,Math.min(5,1+Math.floor((level.score-1)/20)));assert.equal(level.proofStatus,'engine-witness-verified');const metrics=level.metrics??level.rawMetrics;const board=level.options?.initialBoard??level.board;const usable=level.options?.mask?level.options.mask.filter(Boolean).length:(level.options?.width??level.width)*(level.options?.height??level.height);assert.equal(metrics.occupiedCells,board.filter(Boolean).length);assert.equal(metrics.usableCells,usable);assert.equal(metrics.boardCoverage,Number((metrics.occupiedCells/usable).toFixed(6)));assert.ok(level.title.en&&level.title.ja&&level.objective.en&&level.objective.ja);}
 });
 test(`${name}: independent accepted-action replay wins every expanded challenge without padding its proof`,()=>{
  for(const level of levels){let state=create(level.id);
   for(const[index,step]of level.witness.entries()){
    assert.equal(state.phase,'falling',`${level.id} proof must end at first victory`);
    if(engine===blocks){const transition=engine.applyAction(state,step);assert.equal(transition.accepted,true,level.id);state=resolve(engine,transition.state);}
    else{
     for(let guard=0;state.active.pivot.x!==step.pivotX&&guard<32;guard++){const move=engine.applyAction(state,{kind:state.active.pivot.x<step.pivotX?'right':'left'});assert.equal(move.accepted,true,level.id);state=move.state;}
     assert.equal(state.active.pivot.x,step.pivotX);
     for(let i=0;i<turns[step.orientation];i++){const move=engine.applyAction(state,{kind:'rotate-clockwise'});assert.equal(move.accepted,true,level.id);state=move.state;}
     assert.equal(state.active.orientation,step.orientation);const drop=engine.applyAction(state,{kind:'hard-drop'});assert.equal(drop.accepted,true,level.id);state=resolve(engine,drop.state);
    }
    if(state.phase==='won')assert.equal(index,level.witness.length-1,`${level.id} has unused proof actions`);
   }
   assert.equal(state.phase,'won',level.id);assert.equal(state.active,null);assert.equal(engine.applyAction(state,{kind:'hard-drop'}).accepted,false);
   const goal=state.settings.goal;if(goal.kind==='clear-targets')assert.ok(goal.targetIds.every(id=>!state.board.some(gem=>gem?.id===id)));else if(goal.kind==='minimum-chain')assert.ok(state.maxChain>=goal.chain);else assert.ok(state.board.every(gem=>gem===null));
  }
 });
}
