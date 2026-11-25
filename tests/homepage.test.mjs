import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
import { test } from 'node:test';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const css=readFileSync(new URL('../assets/site.css',import.meta.url),'utf8');
test('structure des sept sections',()=>{
  for(const x of ['id="hero-title"','id="defis"','id="impact"','id="solutions"','id="processus"','id="technologies"','id="contact"'])assert.ok(html.includes(x),x);
});
test('navigation et CTA mailto',()=>{
  assert.ok(html.includes('mailto:contactajaoub@gmail.com'));
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
