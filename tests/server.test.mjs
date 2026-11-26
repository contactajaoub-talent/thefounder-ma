import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawn,spawnSync} from 'node:child_process';
import {readFile,mkdtemp,mkdir,copyFile,writeFile,rm,readdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {resolve,join,dirname,sep,basename} from 'node:path';
import {createHash} from 'node:crypto';
import {pages,assets} from '../scripts/site-files.mjs';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('..',import.meta.url));
test('SEO de production et retour en preview sur fixture isolée, sans autorisation réelle ni déploiement',async()=>{
  const fixture=await mkdtemp(join(tmpdir(),'thefounder-qa-'));
  try{
    for(const file of [...pages,...assets,'package.json','scripts/build.mjs','scripts/site-files.mjs']){
      await mkdir(dirname(resolve(fixture,file)),{recursive:true});await copyFile(resolve(root,file),resolve(fixture,file));
    }
    await mkdir(resolve(fixture,'config'),{recursive:true});
    const release={siteOrigin:'https://example.invalid',publicationApproved:true,legalApproved:true,privacyApproved:true,brandUseApproved:true,diagnosticPrivacyApproved:true};
    await writeFile(resolve(fixture,'config/release.json'),JSON.stringify(release));
    const run=(production=true,env={},args=[])=>spawnSync(process.execPath,['scripts/build.mjs',...(production?['--production']:[]),...args],{cwd:fixture,encoding:'utf8',env:{...process.env,VERCEL_ENV:'',VERCEL_TARGET_ENV:'',THEFOUNDER_INTAKE_URL:'https://intake.example.invalid/functions/v1/submit-diagnostic',THEFOUNDER_TURNSTILE_SITE_KEY:'fixture-only',...env}});
    // Exercise the guard independently of whether the real notices are now complete.
    await writeFile(resolve(fixture,'confidentialite.html'),'<!DOCTYPE html><html lang="fr"><body>TODO_CLIENT : fixture technique incomplète.</body></html>');
    const blocked=run();assert.notEqual(blocked.status,0);assert.match(blocked.stderr,/compléter/);
    // Replace legal pages ONLY in the disposable fixture. No fictitious legal identity is created.
    for(const file of ['mentions-legales.html','confidentialite.html'])await writeFile(resolve(fixture,file),'<!DOCTYPE html><html lang="fr"><head><meta name="robots" content="noindex, nofollow"></head><body>Fixture technique de test, sans contenu juridique.</body></html>');
    const build=run();assert.equal(build.status,0,build.stderr);
    const html=await readFile(resolve(fixture,'dist/index.html'),'utf8');
    assert.match(html,/<link rel="canonical" href="https:\/\/example.invalid\/">/);
    assert.match(html,/<meta name="robots" content="index, follow">/);
    assert.match(html,/content="https:\/\/example.invalid\/assets\/og-thefounder.png"/);
    const data=html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)[1];
    assert.equal(JSON.parse(data)['@type'],'WebSite');
    assert.equal(JSON.parse(data).inLanguage,'fr-MA');
    assert.equal(JSON.parse(data).publisher.name,'Othmane Ajaoub');
    assert.equal(JSON.parse(data).publisher.brand.name,'TheFounder');
    assert.equal(JSON.parse(data).about.length,3);
    assert.ok(JSON.parse(data).description.includes('Maroc'));
    assert.ok(html.includes("'sha256-"+createHash('sha256').update(data).digest('base64')+"'"));
    const sitemap=await readFile(resolve(fixture,'dist/sitemap.xml'),'utf8');assert.equal((sitemap.match(/<url>/g)||[]).length,10);assert.ok(!sitemap.includes('404.html'));
    assert.ok(!sitemap.includes('.html'));
    assert.ok(sitemap.includes('https://example.invalid/solutions'));
    assert.ok(sitemap.includes('https://example.invalid/departements'));
    assert.ok(sitemap.includes('https://example.invalid/diagnostic'));
    const solutionsHtml=await readFile(resolve(fixture,'dist/solutions.html'),'utf8');
    assert.ok(solutionsHtml.includes('href="https://example.invalid/solutions"'));
    assert.ok(solutionsHtml.includes('href="/departements"'));
    assert.match(await readFile(resolve(fixture,'dist/robots.txt'),'utf8'),/Allow: \//);
    assert.match(await readFile(resolve(fixture,'dist/404.html'),'utf8'),/noindex, follow/);
    const adapter=JSON.parse(await readFile(resolve(fixture,'.vercel/output/config.json'),'utf8'));
    assert.equal(adapter.version,3);
    assert.equal(adapter.routes[0].headers['X-Robots-Tag'],undefined);
    assert.match(adapter.routes[0].headers['Strict-Transport-Security'],/max-age=31536000/);
    assert.ok(adapter.routes[0].headers['Content-Security-Policy'].includes("'sha256-"+createHash('sha256').update(data).digest('base64')+"'"));
    assert.equal(adapter.routes.at(-1).status,404);
    assert.ok(adapter.routes.some(r=>r.src==='^/index\\.html$' && r.headers?.Location==='/'));
    assert.ok(adapter.routes.some(r=>r.src==='^/solutions$' && r.dest==='/solutions.html'));
    assert.ok(adapter.routes.some(r=>r.src==='^/departements$' && r.dest==='/departements.html'));
    assert.deepEqual((await readdir(resolve(fixture,'.vercel/output/static'))).sort(),[...pages,'assets','robots.txt','sitemap.xml'].sort());
    assert.equal(await readFile(resolve(fixture,'.vercel/output/static/index.html'),'utf8'),html);
    // A string or a command-line preview override must never unlock production.
    await writeFile(resolve(fixture,'config/release.json'),JSON.stringify({...release,legalApproved:'true'}));
    assert.notEqual(run().status,0);
    assert.notEqual(run(false,{VERCEL_ENV:'production'}).status,0);
    assert.notEqual(run(false,{VERCEL_TARGET_ENV:'production'},['--preview']).status,0);
    await writeFile(resolve(fixture,'config/release.json'),JSON.stringify({...release,diagnosticPrivacyApproved:false}));
    assert.notEqual(run().status,0,'Diagnostic privacy approval must block production');
    await writeFile(resolve(fixture,'config/release.json'),JSON.stringify(release));
    const automatic=run(false,{VERCEL_ENV:'production'});assert.equal(automatic.status,0,automatic.stderr);
    assert.equal(JSON.parse(await readFile(resolve(fixture,'dist/build-manifest.json'))).mode,'production');
    // Stale files from a previous export are removed from both publish directories.
    for(const directory of ['dist','.vercel/output/static'])await writeFile(resolve(fixture,directory,'private-stale.txt'),'fixture interne');
    const preview=run(false);assert.equal(preview.status,0,preview.stderr);
    for(const directory of ['dist','.vercel/output/static'])assert.ok(!(await readdir(resolve(fixture,directory))).includes('private-stale.txt'));
    assert.ok(!(await readFile(resolve(fixture,'dist/index.html'),'utf8')).includes('rel="canonical"'));
    assert.match(await readFile(resolve(fixture,'dist/robots.txt'),'utf8'),/Disallow: \//);
    assert.ok(!(await readFile(resolve(fixture,'dist/sitemap.xml'),'utf8')).includes('<url>'));
    assert.match(await readFile(resolve(fixture,'dist/_headers'),'utf8'),/X-Robots-Tag: noindex/);
    const previewAdapter=JSON.parse(await readFile(resolve(fixture,'.vercel/output/config.json')));
    assert.match(previewAdapter.routes[0].headers['X-Robots-Tag'],/noindex/);
  }finally{
    const target=resolve(fixture),tempRoot=resolve(tmpdir());
    if(!target.startsWith(tempRoot+sep)||!basename(target).startsWith('thefounder-qa-'))throw Error('Nettoyage de fixture refusé : chemin inattendu.');
    await rm(target,{recursive:true,force:true});
  }
});
test('export preview et serveur HTTP sécurisé, indépendants des validations réelles',async()=>{
  const build=spawnSync(process.execPath,['scripts/build.mjs'],{cwd:root,encoding:'utf8',env:{...process.env,VERCEL_ENV:'',VERCEL_TARGET_ENV:''}});
  assert.equal(build.status,0,build.stderr);
  const manifest=JSON.parse(await readFile(new URL('../dist/build-manifest.json',import.meta.url)));
  assert.equal(manifest.mode,'preview');assert.ok(manifest.files.every(x=>!x.startsWith('docs/')&&!x.startsWith('business/')));
  const server=spawn(process.execPath,['scripts/dev-server.mjs','--dist'],{cwd:root,env:{...process.env,PORT:'4186'},stdio:['ignore','pipe','pipe']});
  try{
    await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject);server.once('exit',code=>reject(Error('Serveur arrêté '+code)));});
    const base='http://127.0.0.1:4186';
    const response=await fetch(base);assert.equal(response.status,200);
    assert.equal(response.headers.get('x-content-type-options'),'nosniff');
    assert.match(response.headers.get('content-security-policy'),/frame-ancestors 'none'/);
    assert.match(response.headers.get('x-robots-tag'),/noindex/);
    for(const path of ['/solutions','/departements','/diagnostic','/realisations','/assets/preloader/thefounder-symbol.png','/assets/site.js'])assert.equal((await fetch(base+path)).status,200,path);
    for(const [legacy,canonical] of [['/index.html','/'],['/solutions.html','/solutions'],['/departements.html','/departements']]){
      const r=await fetch(base+legacy,{redirect:'manual'});
      assert.equal(r.status,308,legacy);
      assert.equal(r.headers.get('location'),canonical);
    }
    assert.equal((await fetch(base+'/solutions/',{redirect:'manual'})).status,308);
    assert.equal((await fetch(base+'/solutions.html?from=old',{redirect:'manual'})).headers.get('location'),'/solutions?from=old');
    for(const path of ['/inconnue','/README.md','/business/modele-facture.md','/config/release.json','/%2e%2e%2fREADME.md','/.git/config','/assets/logos/claude.svg','/assets/logos/codex.svg'])assert.equal((await fetch(base+path)).status,404,path);
    const missing=await fetch(base+'/absente');assert.match(await missing.text(),/Cette page est introuvable/);
    assert.equal((await fetch(base+'/404.html')).status,404);
    assert.equal((await fetch(base+'/%E0%A4%A')).status,400);
    assert.equal((await fetch(base,{method:'POST'})).status,405);
    assert.equal(await (await fetch(base,{method:'HEAD'})).text(),'');
    assert.match(await (await fetch(base+'/robots.txt')).text(),/Disallow: \//);
  }finally{server.kill();}
});
