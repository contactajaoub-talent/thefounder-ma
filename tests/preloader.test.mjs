import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {test} from 'node:test';
import {pages,assets,publicFiles} from '../scripts/site-files.mjs';
const read=file=>readFileSync(new URL('../'+file,import.meta.url));
test('preloader limité à l’accueil, ressources externes locales et liste de build complète',()=>{
  const html=read('index.html').toString();
  assert.equal((html.match(/id="thefounder-preloader"/g)||[]).length,1);
  assert.ok(html.indexOf('id="thefounder-preloader"')<html.indexOf('class="site-shell"'));
  for(const file of ['preloader.css','preloader.js','thefounder-symbol.png','thefounder-wordmark.png','thefounder-tagline.png']){
    const path='assets/preloader/'+file;assert.ok(assets.includes(path));assert.ok(publicFiles.includes(path));assert.ok(html.includes('/'+path));
  }
  for(const page of pages.filter(x=>x!=='index.html'))assert.ok(!read(page).toString().includes('thefounder-preloader'),page);
  assert.match(html,/<script defer src="\/assets\/preloader\/preloader.js"><\/script>/);
});
test('les trois PNG fournis sont conservés octet pour octet',()=>{
  const hashes={
    'thefounder-symbol.png':'e790a6bb77f49e4376cb48b0a17fd40f88a4da1ff12e91259b5ed67a4cac2218',
    'thefounder-wordmark.png':'bcfe43ee037b5ceda020b6ab1576539fb1bd864531e8cf6ab974009ee83e16d1',
    'thefounder-tagline.png':'1fb5996a13895d688290ce197afe3ba0e778fa6cdf6b7ae44ca104e649eefca3',
  };
  for(const [file,expected] of Object.entries(hashes))assert.equal(createHash('sha256').update(read('assets/preloader/'+file)).digest('hex'),expected,file);
});
