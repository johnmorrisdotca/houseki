import {test} from 'vitest';
import assert from 'node:assert/strict';
import * as chains from '../dist/colour-chains.js';
import * as blocks from '../dist/magnetic-blocks.js';

// These checks examine the published engines rather than importing generator helpers.
for(const [name,create,levels] of [['Shizen',chains.createShizenLevel,chains.shizenLevelManifest],['Arashi',chains.createArashiLevel,chains.arashiLevelManifest]])test(`${name} authored state has no falling clock and rejects exhausted nonwinning play`,()=>{
 assert.equal(levels.length,50);
 for(const number of [1,25,50]){
  const start=create(number);const later=chains.advanceTicks(start,3600).state;
  assert.equal(later.phase,'falling');assert.deepEqual(later.active,start.active);assert.equal(later.completedPairs,0);
  assert.deepEqual(chains.decodeGame(chains.encodeGame(later)),later);
  assert.deepEqual(chains.restartGame(later),start);
 }
 let lost=null;
 outer:for(const number of [50,25,1])for(const column of [0,5]){
  let state=create(number);
  for(let guard=0;state.phase==='falling'&&guard<12;guard++){
   while(state.active.pivot.x!==column){const move=chains.applyAction(state,{kind:state.active.pivot.x<column?'right':'left'});if(!move.accepted)break;state=move.state;}
   state=chains.advanceTicks(chains.applyAction(state,{kind:'hard-drop'}).state,3600).state;
  }
  if(state.phase==='lost'){lost=state;break outer;}
 }
 assert.ok(lost,'At least one genuinely bad plan must lose instead of silently refilling the queue');
 assert.equal(lost.active,null);assert.equal(chains.applyAction(lost,{kind:'hard-drop'}).accepted,false);
 assert.deepEqual(chains.decodeGame(chains.encodeGame(lost)),lost);
});

test('Magnetic Blocks finite campaign stays untimed and rejects play after an exhausted loss',()=>{
 assert.equal(blocks.levelManifest.length,50);
 for(const number of [1,25,50]){
  const start=blocks.createLevel(number),later=blocks.advanceTicks(start,3600).state;
  assert.equal(later.phase,'falling');assert.deepEqual(later.active,start.active);assert.equal(later.placements,0);
  assert.deepEqual(blocks.decodeGame(blocks.encodeGame(later)),later);assert.deepEqual(blocks.restartGame(later),start);
 }
 let lost=null;
 outer:for(const number of [50,25,1])for(const column of [0,6]){
  let state=blocks.createLevel(number);
  for(let guard=0;state.phase==='falling'&&guard<12;guard++){
   while(state.active.x!==column){const move=blocks.applyAction(state,{kind:state.active.x<column?'right':'left'});if(!move.accepted)break;state=move.state;}
   state=blocks.advanceTicks(blocks.applyAction(state,{kind:'hard-drop'}).state,3600).state;
  }
  if(state.phase==='lost'){lost=state;break outer;}
 }
 assert.ok(lost);assert.equal(blocks.applyAction(lost,{kind:'hard-drop'}).accepted,false);assert.deepEqual(blocks.decodeGame(blocks.encodeGame(lost)),lost);
});
