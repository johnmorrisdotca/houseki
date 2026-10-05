import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
const folder=await mkdtemp(join(tmpdir(),'houseki-consumer-'));
function run(args,cwd=process.cwd(),executable=process.execPath){const result=spawnSync(executable,args,{cwd,encoding:'utf8',env:{...process.env,npm_config_cache:join(folder,'cache')}});if(result.status!==0)throw new Error(result.stderr||result.stdout);return result.stdout;}
const npm=process.platform==='win32'?'npm.cmd':'npm';
try{
 const packed=JSON.parse(run(['pack','--json','--pack-destination',folder],process.cwd(),npm));
 await writeFile(join(folder,'package.json'),JSON.stringify({name:'houseki-consumer',private:true,type:'module'}));
 run(['install','--ignore-scripts','--no-audit','--no-fund',join(folder,packed[0].filename)],folder,npm);
 await writeFile(join(folder,'verify.mjs'),`
import assert from 'node:assert/strict';
import * as collection from '@johnmorrisdotca/houseki';
for(const [entry,name] of [['falling-triplets','fallingTriplets'],['stone-collapse','stoneCollapse'],['colour-chains','colourChains'],['gem-swap','gemSwap'],['magnetic-blocks','magneticBlocks']]){
 const engine=await import('@johnmorrisdotca/houseki/'+entry);
 assert.equal(collection[name].createGame,engine.createGame);
 const game=engine.createGame({seed:'installed-package'});
 assert.equal(game.game,entry);assert.ok(game.board.length>0);
 assert.equal(typeof engine.applyAction,'function');assert.equal(typeof engine.advanceTicks,'function');
}
const nature=await import('@johnmorrisdotca/houseki/nature');assert.equal(collection.nature.createNatureState,nature.createNatureState);
console.log('PASS installed tarball: game namespaces, five engines and nature utilities');
`);
 process.stdout.write(run(['verify.mjs'],folder));
}finally{await rm(folder,{recursive:true,force:true});}
