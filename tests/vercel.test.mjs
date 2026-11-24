import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {securityHeaders} from '../scripts/site-files.mjs';
const config=JSON.parse(readFileSync(new URL('../vercel.json',import.meta.url),'utf8'));
test('configuration Vercel statique sans fallback SPA ni mutation de domaine',()=>{
  assert.equal(config.framework,null);assert.equal(config.outputDirectory,'dist');assert.equal(config.buildCommand,'npm run build:vercel');
  assert.equal(config.cleanUrls,false);assert.equal(config.rewrites,undefined);assert.equal(config.redirects,undefined);assert.equal(config.alias,undefined);assert.equal(config.git,undefined);
  const headers=Object.fromEntries(config.headers[0].headers.map(x=>[x.key,x.value]));
  for(const [key,value] of Object.entries(securityHeaders))assert.equal(headers[key],value,key);
  assert.match(headers['X-Robots-Tag'],/noindex/);
});
test('garde de Preview : production, main et mauvaise cible refusés avant build',()=>{
  const root=new URL('..',import.meta.url);
  for(const vars of [
    {VERCEL_ENV:'production'},
    {VERCEL_ENV:'preview',VERCEL_GIT_COMMIT_REF:'main'},
    {VERCEL_ENV:'preview',VERCEL_PROJECT_NAME:'autre-projet'},
    {VERCEL_ENV:'preview',VERCEL_TARGET_ENV:'production'},
  ]){
    const env={...process.env};for(const key of ['VERCEL_ENV','VERCEL_TARGET_ENV','VERCEL_GIT_COMMIT_REF','VERCEL_PROJECT_NAME'])delete env[key];
    const result=spawnSync(process.execPath,['scripts/vercel-build.mjs'],{cwd:root,env:{...env,...vars},encoding:'utf8'});
    assert.notEqual(result.status,0);assert.match(result.stderr,/refusé|inattendu/);
  }
});
test('anciennes dépendances et intégrations exclues des fichiers publics',()=>{
  const pkg=JSON.parse(readFileSync(new URL('../package.json',import.meta.url),'utf8'));assert.equal(pkg.dependencies,undefined);
  for(const name of ['react','react-dom','vite','@vitejs/plugin-react'])assert.equal(pkg.devDependencies?.[name],undefined);
  const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
  assert.ok(!/salesforce|calendly|calendar\.app\.google|googletagmanager|facebook\.net|90 jours|src\/main\.jsx/i.test(html));
});
