import {readFileSync,existsSync} from 'node:fs';
import assert from 'node:assert/strict';
import {test} from 'node:test';
import {pages,assets,cleanUrlForPage} from '../scripts/site-files.mjs';
const text=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const ids=file=>new Set([...text(file).matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]));

test('tous les liens internes, ressources et fragments existent',()=>{
  for(const file of pages){
    for(const m of text(file).matchAll(/\b(?:href|src)="([^"]+)"/g)){
      const href=m[1];if(/^(https?:|mailto:)/.test(href))continue;
      const url=new URL(href,'https://thefounder.ma/'+file);const path=url.pathname;const hash=url.hash.slice(1);const target=pages.find(p=>cleanUrlForPage(p)===path)||path.replace(/^\//,'')||file;
      assert.ok(existsSync(new URL('../'+target,import.meta.url)),`${file}: ${href}`);
      if(hash)assert.ok(ids(target).has(hash),`${file}: ancre ${href}`);
    }
  }
});
test('SEO local : titres et descriptions distincts avec ciblage Maroc',()=>{
  for(const file of ['index.html','solutions.html','realisations.html','fondateur.html','methode.html','contact.html']){
    const html=text(file);
    const title=html.match(/<title>([^<]+)<\/title>/)?.[1];
    const description=html.match(/<meta name="description" content="([^"]+)"/)?.[1];
    assert.ok(title?.includes('Maroc'),file+' : titre');
    assert.ok(description?.includes('Maroc')||description?.includes('marocaines'),file+' : description');
    assert.ok(html.includes(`<meta property="og:title" content="${title}"`),file+' : og:title');
    assert.ok(html.includes(`<meta property="og:description" content="${description}"`),file+' : og:description');
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
test('indicateurs de lien : un seul symbole SVG, aucune flèche Unicode ni fallback de police',()=>{
  const sprite='assets/icons/link.svg';
  assert.ok(assets.includes(sprite));
  assert.equal((text(sprite).match(/<symbol\b/g)||[]).length,1);
  assert.match(text(sprite),/id="arrow-up-right" viewBox="0 0 24 24"/);
  assert.match(text(sprite),/d="M7 17L17 7"/);assert.match(text(sprite),/d="M9 7h8v8"/);
  let count=0;
  for(const file of pages){
    const html=text(file);assert.doesNotMatch(html,/[\u2190-\u21ff\u27f0-\u27ff\u2900-\u297f\u2b05-\u2b07\u27a1]/u,file);
    const icons=[...html.matchAll(/<span class="link-icon" aria-hidden="true">(<svg[^>]+><use[^>]+><\/use><\/svg>)<\/span>/g)];
    assert.equal(icons.length,(html.match(/class="link-icon"/g)||[]).length,file);
    for(const [,svg] of icons){assert.match(svg,/aria-hidden="true"/);assert.match(svg,/focusable="false"/);assert.match(svg,/href="\/assets\/icons\/link.svg#arrow-up-right"/);}
    count+=icons.length;
  }
  assert.equal(count,30);
  assert.doesNotMatch(text('assets/site.css'),/content\s*:[^;}]*[\u2190-\u21ff\u27f0-\u27ff\u2900-\u297f\u27a1]/u);
});
test('neuf technologies avec visuels homogènes, sept marques et deux pictogrammes indépendants',()=>{
  const html=text('index.html');
  assert.equal((html.match(/class="tf-tool-name"/g)||[]).length,9);
  assert.equal((html.match(/class="tf-tech-media"/g)||[]).length,9);
  assert.equal((html.match(/class="tf-tech-pictogram"/g)||[]).length,2);
  assert.equal((html.match(/class="tf-tech-wordmark"/g)||[]).length,7);
  for(const name of ['n8n','Supabase','Next.js','Make','Codex','Claude','GitHub','Docker','Vercel'])assert.ok(html.includes(`class="tf-tool-name">${name}</span>`));
  const marks=['n8n','supabase','nextjs','make','github','docker','vercel'].map(x=>`assets/logos/${x}.svg`).sort();
  assert.deepEqual(assets.filter(x=>x.startsWith('assets/logos/')).sort(),marks);
  for(const path of marks)assert.ok(html.includes('/'+path),path);
  for(const x of ['claude','codex'])assert.ok(!html.includes(`assets/logos/${x}.svg`));
});
test('accueil : ordre et nombre des sections conservés, valeurs accessibles sans JS',()=>{
  const html=text('index.html');assert.equal((html.match(/<section\b/g)||[]).length,6);
  const names=['hero-title','tfv-title','impact-title','solutions-heading','tf-process-title','tf-stack-heading','tf-final-heading'];
  const positions=names.map(x=>html.indexOf(`aria-labelledby="${x}"`));assert.ok(positions.every(x=>x>=0));
  assert.deepEqual(positions,[...positions].sort((a,b)=>a-b));
  assert.ok(html.includes('>+15</span>'));assert.ok(html.includes('>+25,1</span>'));
  assert.match(html,/Résultats d’études externes/);
});
test('documents de lancement et modèles demandés présents',()=>{
  for(const file of ['TODO_CLIENT.md','business/catalogue-services.md','business/modele-devis.md','business/modele-facture.md','business/process-client.md','business/crm-prospection.csv','CHECKLIST-LANCEMENT.md'])assert.ok(existsSync(new URL('../'+file,import.meta.url)),file);
});

test('page solutions : quatre illustrations animées avec ancrages stables',()=>{
  const html=text('solutions.html');
  const css=text('assets/site.css');
  const js=text('assets/site.js');
  const ids=[...html.matchAll(/<section class="sv-showcase" id="([^"]+)"/g)].map(x=>x[1]);
  assert.deepEqual(ids,['brain','workflow','software','crm']);
  for (const className of ['sv-ai-canvas','sv-flow-visual','sv-software-window','sv-crm-window'])
    assert.ok(html.includes('class="'+className) || html.includes(' '+className+'"'),className);
  assert.equal((html.match(/class="sv-feature"/g)||[]).length,12);
  assert.ok(html.includes('href="/departements"'));
  assert.ok(html.includes('Commençons par votre besoin.'));
  assert.match(css,/@media\(max-width:470px\)/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)\{\.sv-page/);
  assert.match(js,/IntersectionObserver/);
});

test('liens internes sans extension .html',()=>{
  for(const file of pages){
    for(const [,href] of text(file).matchAll(/\bhref="([^"]+)"/g))
      if(!/^(https?:|mailto:|#)/.test(href))
        assert.doesNotMatch(href,/\.html(?:#|$)/,file+' : '+href);
  }
  assert.equal(cleanUrlForPage('index.html'),'/');
  assert.equal(cleanUrlForPage('solutions.html'),'/solutions');
  assert.equal(cleanUrlForPage('departements.html'),'/departements');
});

test('diagnostic V1 et défis V4 intégrés et accessibles',()=>{
  const home=text('index.html'),diag=text('diagnostic.html');
  assert.equal((home.match(/class="tfv-card"/g)||[]).length,9);
  assert.ok(home.includes('href="/diagnostic"'));
  assert.ok(home.includes('/assets/problems.css'));
  assert.ok(home.includes('/assets/problems.js'));
  assert.ok(diag.includes('id="email-summary"'));
  assert.ok(diag.includes('href="/confidentialite"'));
  assert.ok(!diag.includes('data:image/png;base64'));
  assert.ok(text('assets/diagnostic.js').includes('mailto:contactajaoub@gmail.com'));
});
