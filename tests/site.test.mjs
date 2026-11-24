import {readFileSync,existsSync} from 'node:fs';
import assert from 'node:assert/strict';
import {test} from 'node:test';
import {pages,assets} from '../scripts/site-files.mjs';
const text=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const ids=file=>new Set([...text(file).matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]));

test('tous les liens internes, ressources et fragments existent',()=>{
  for(const file of pages){
    for(const m of text(file).matchAll(/\b(?:href|src)="([^"]+)"/g)){
      const href=m[1];if(/^(https?:|mailto:)/.test(href))continue;
      const [path,hash]=href.replace(/^\//,'').split('#');const target=path||file;
      assert.ok(existsSync(new URL('../'+target,import.meta.url)),`${file}: ${href}`);
      if(hash)assert.ok(ids(target).has(hash),`${file}: ancre ${href}`);
    }
  }
});
test('métadonnées uniques et aucune interception de lien ni code en ligne',()=>{
  const titles=new Set();
  for(const file of pages){const html=text(file);
    assert.equal((html.match(/<h1\b/g)||[]).length,1,file);
    assert.equal((html.match(/name="description"/g)||[]).length,1,file);
    assert.equal((html.match(/<title>/g)||[]).length,1,file);
    assert.ok(!/data-next|<dialog|Page en préparation|style="|\sonclick=/.test(html),file);
    assert.match(html,/<html lang="fr">/);assert.match(html,/noindex, nofollow/);
    assert.match(html,/Content-Security-Policy/);titles.add(html.match(/<title>([^<]+)/)[1]);
  }
  assert.equal(titles.size,pages.length);
});
test('tous les CTA projet ciblent le contact confirmé et son objet',()=>{
  let count=0;
  for(const file of pages){for(const m of text(file).matchAll(/href="(mailto:[^"]+)"/g)){
    const url=new URL(m[1]);assert.equal(url.pathname,'contactajaoub@gmail.com');
    if(url.searchParams.get('subject')?.startsWith('Demande de projet')) {assert.equal(url.searchParams.get('subject'),'Demande de projet - TheFounder');count++;}
  }}assert.ok(count>=10);
});
test('neuf technologies, trois wordmarks officiels et six pictogrammes originaux',()=>{
  const html=text('index.html');
  assert.equal((html.match(/class="tf-tool-name"/g)||[]).length,9);
  assert.equal((html.match(/class="tf-tech-media"/g)||[]).length,9);
  assert.equal((html.match(/class="tf-tech-pictogram"/g)||[]).length,6);
  for(const name of ['n8n','Supabase','Next.js','Make','Codex','Claude','GitHub','Docker','Vercel'])assert.ok(html.includes(`class="tf-tool-name">${name}</span>`));
  const wordmarks=['n8n','supabase','github'].map(x=>`assets/logos/${x}.svg`).sort();
  assert.deepEqual(assets.filter(x=>x.startsWith('assets/logos/')).sort(),wordmarks);
  for(const path of wordmarks)assert.ok(html.includes('/'+path),path);
  for(const name of ['claude','codex','nextjs','docker','vercel','make'])assert.ok(!html.includes(`assets/logos/${name}.svg`));
});
test('accueil : ordre et nombre des sections conservés, valeurs accessibles sans JS',()=>{
  const html=text('index.html');assert.equal((html.match(/<section\b/g)||[]).length,6);
  const names=['hero-title','impact-title','solutions-heading','tf-process-title','tf-stack-heading','tf-final-heading'];
  const positions=names.map(x=>html.indexOf(`aria-labelledby="${x}"`));assert.ok(positions.every(x=>x>=0));
  assert.deepEqual(positions,[...positions].sort((a,b)=>a-b));
  assert.ok(html.includes('>+15</span>'));assert.ok(html.includes('>+25,1</span>'));
  assert.match(html,/Résultats d’études externes/);
});
test('documents de lancement et modèles demandés présents',()=>{
  for(const file of ['TODO_CLIENT.md','business/catalogue-services.md','business/modele-devis.md','business/modele-facture.md','business/process-client.md','business/crm-prospection.csv','CHECKLIST-LANCEMENT.md'])assert.ok(existsSync(new URL('../'+file,import.meta.url)),file);
});
