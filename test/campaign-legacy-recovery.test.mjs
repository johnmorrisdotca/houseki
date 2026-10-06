import {test} from 'vitest';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as chains from '../dist/colour-chains.js';
import * as blocks from '../dist/magnetic-blocks.js';
const fixtures=JSON.parse(readFileSync(new URL('./fixtures/campaign-v1-saves.json',import.meta.url),'utf8'));
for(const fixture of fixtures)test(`${fixture.campaign}: published level ${fixture.number} retains identity and exact saved play`,()=>{
 const engine=fixture.campaign==='blocks'?blocks:chains;
 const create=fixture.campaign==='blocks'?blocks.createLevel:fixture.campaign==='shizen'?chains.createShizenLevel:chains.createArashiLevel;
 const state=engine.decodeGame(fixture.encoded);
 assert.deepEqual(state.settings,fixture.expectedSettings);assert.deepEqual(state.board,fixture.expectedBoard);assert.deepEqual(state.active,fixture.expectedActive);assert.deepEqual(state.recording,fixture.expectedRecording);
 const original=create(fixture.id);assert.deepEqual(original.settings,fixture.initialSettings);assert.deepEqual(original.board,fixture.initialBoard);assert.deepEqual(engine.restartGame(state),original);
});
