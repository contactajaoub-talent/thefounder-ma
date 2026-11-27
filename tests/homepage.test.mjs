import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
import { test } from 'node:test';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const css=readFileSync(new URL('../assets/site.css',import.meta.url),'utf8');
test('structure des sept sections',()=>{
  for(const x of ['id="hero-title"','id="defis"','id="impact"','id="solutions"','id="processus"','id="technologies"','id="contact"'])assert.ok(html.includes(x),x);
});
test('navigation et CTA diagnostic',()=>{
  assert.ok(html.includes('href="/diagnostic"'));
  assert.ok(!/mailto:[^"\s]*\?subject=Demande/.test(html));
  assert.ok(!html.includes('data-next="Contact"'));
});
test('grille de neuf technologies',()=>{
  assert.equal((html.match(/class="tf-stack-tool"/g)||[]).length,9);
  assert.match(css,/grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/);
});
test('sources disponibles et ressources locales',()=>{
  assert.ok(existsSync(new URL('../assets/thefounder-mark.png',import.meta.url)));
  assert.ok(existsSync(new URL('../assets/thefounder-icon-1080.png',import.meta.url)));
  assert.ok(html.includes('capgemini.com'));
});

test('Hero validé : compact, CTA Solutions et quatre icônes animées',()=>{
  assert.match(html, /class="hero tf-hero-v2"/);
  assert.match(html, /Votre prochain levier de croissance \?/);
  assert.match(html, /href="\/solutions">Explorer nos solutions/);
  assert.match(html, /Nous concevons des logiciels sur mesure, automatisons vos processus et intégrons l’IA à votre activité\./);
  assert.equal((html.match(/class="bubble bubble-[1-4]"/g)||[]).length,4);
  assert.match(css, /@keyframes tf-float-one/);
  assert.match(css, /\.tf-hero-v2 \{[\s\S]*?min-height:0 !important/);
});
test('Impact IA : chiffres animés, quatre sources et responsive',()=>{
  const section=html.split('<section class="impact-section tf-impact-v2"')[1]?.split('</section>')[0]||'';
  assert.match(section, /Du potentiel aux <span>résultats mesurés\.<\/span>/);
  assert.match(section, /Découvrez ce que les études révèlent sur l’impact réel/);
  for(const n of ['15','26','31','40','25.1'])assert.ok(section.includes('data-target="'+n+'"'),n);
  for(const s of ['doi.org','capgemini.com','news.mit.edu','informs.org'])assert.ok(section.includes(s),s);
  assert.match(css, /\.tf-impact-v2 \.impact-statbar/);
  assert.match(css, /@media\(max-width:520px\)/);
  const js=readFileSync(new URL('../assets/site.js',import.meta.url),'utf8');
  assert.match(js, /Approved IA impact cards/);
  assert.match(js, /prefers-reduced-motion: reduce/);
});


test('visual scaling home: desktop, laptop and mobile without modifying content',()=>{
  const problemCss=readFileSync(new URL('../assets/problems.css',import.meta.url),'utf8');
  for(const id of ['impact','defis','solutions','processus','technologies','contact'])assert.ok(html.includes('id="'+id+'"'));
  assert.match(css,/HOME VISUAL SCALE 2026-11-27/);
  assert.match(problemCss,/HOME VISUAL SCALE 2026-11-27/);
  for(const rule of ['#solutions .solution-card','#processus .tf-process-step','#technologies .tf-stack-tool','#contact .tf-final-cta']){
    assert.ok(css.includes(rule),rule);
  }
  for(const rule of ['.tfv-problems .tfv-card','.tfv-problems .tfv-mini','.tfv-problems .tfv-impact']){
    assert.ok(problemCss.includes(rule),rule);
  }
  assert.match(css,/@media \(min-width:821px\) and \(max-width:1100px\)/);
  assert.match(css,/@media \(max-width:580px\)/);
  assert.match(problemCss,/@media\(max-width:700px\)/);
  assert.equal((html.match(/class="tfv-card"/g)||[]).length,9);
  assert.equal((html.match(/class="tf-stack-tool"/g)||[]).length,9);
  assert.equal((html.match(/class="impact-stat"/g)||[]).length,4);
  assert.ok(html.includes('href="/diagnostic"'));
});
