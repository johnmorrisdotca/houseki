import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { API_CSS, apiOf, apiPage } from './api.mjs';
import {FAMILY_SCRIPT,FAMILY_WORDS,familyHeader} from './family-template.mjs';
import { packagePage } from './package-family.mjs';
await mkdir('site/demo', { recursive: true });
for (const file of ['index.html', 'family.css', 'game.css', 'demo.js', 'animation.js', 'audio.js', 'settings.js', 'ending.js', 'ending.css', 'appearance.js', 'appearance.css', 'chains.js', 'chains.html', 'tools.html', 'tools.js', 'tools.css', 'blocks.html', 'blocks.js', 'blocks.css']) await cp(`demo/${file}`, `site/${file}`);
await cp('dist', 'site/dist', { recursive: true });
const cloth=familyHeader({id:'kazu'}).match(/<div class="cloth"[\s\S]*?<\/div>/)[0];
await writeFile('site/family-appearance.js',`export const words=${JSON.stringify(FAMILY_WORDS)};`);
for(const name of ['index.html','chains.html','tools.html','blocks.html']){
 let page=await readFile(`site/${name}`,'utf8');
 page=page.replace(/<button[^>]*id="theme"[^>]*>[\s\S]*?<\/button>/g,'');
 if(name==='tools.html')page=page.replace('<button class="fam-button" id="language">日本語</button>','<div class="lang" role="group" aria-label="Language / 言語"><button type="button" data-lang="en">English</button><button type="button" data-lang="ja">日本語</button></div>');
 page=page.replace(/(<div class="lang"[\s\S]*?<\/div>)/,`$1${cloth}`);
 page=page.replace('</head>','<link rel="stylesheet" href="appearance.css"></head>');
 const field='<label class="field"><span data-piece-label>Piece appearance</span><select id="pieces"><option value="glossy">Glossy stones</option><option value="matte">Matte stones</option><option value="flat">Flat gems</option></select></label>';
 page=page.replace(/(<label[^>]*>[\s\S]*?<select id="colours"[\s\S]*?<\/select><\/label>)/,`$1${field}`);
 page=page.replace('</body>',`<script>${FAMILY_SCRIPT}</script></body>`);
 await writeFile(`site/${name}`,page);
}
await writeFile('site/api.css', API_CSS);
await writeFile('site/api.json', JSON.stringify(apiOf(), null, 2));
await writeFile('site/api.html', packagePage(apiPage({ id: 'kazu', name: 'Houseki', icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><text y="26" font-size="27">◆</text></svg>' })));
console.log('Built the local Falling Triplets site in site/.');
