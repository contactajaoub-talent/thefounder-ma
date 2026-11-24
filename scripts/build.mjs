import {mkdir, readFile, writeFile, copyFile} from 'node:fs/promises';
import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {pages, assets, csp, securityHeaders} from './site-files.mjs';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const production = process.argv.includes('--production');
const release = JSON.parse(await readFile(resolve(root,'config/release.json'),'utf8'));
let origin;
if (production) {
  if (!release.publicationApproved || !release.legalApproved || !release.privacyApproved || !release.brandUseApproved || !release.siteOrigin) throw Error('Publication bloquée : renseigner config/release.json uniquement après autorisation explicite et validation juridique, confidentialité, marques et domaine.');
  const url = new URL(release.siteOrigin);
  if (url.protocol !== 'https:' || url.pathname !== '/' || url.search || url.hash || url.username || url.password) throw Error('siteOrigin doit être une origine HTTPS validée, sans chemin ni paramètres.');
  origin = url.origin;
  for (const file of ['mentions-legales.html','confidentialite.html']) if ((await readFile(resolve(root,file),'utf8')).includes('TODO_CLIENT')) throw Error(`Publication bloquée : compléter ${file}.`);
}
await mkdir(resolve(root,'dist'),{recursive:true});
const website = production ? JSON.stringify({'@context':'https://schema.org','@type':'WebSite',name:'TheFounder',url:origin+'/',inLanguage:'fr-MA'}) : null;
const hash = website ? createHash('sha256').update(website).digest('base64') : null;
const policy = hash ? csp.replace("script-src 'self'",`script-src 'self' 'sha256-${hash}'`) : csp;
for (const file of pages) {
  let html = await readFile(resolve(root,file),'utf8');
  if (production) {
    const path = file === 'index.html' ? '/' : '/'+file;
    html = html.replace('<meta name="robots" content="noindex, nofollow">',`<meta name="robots" content="${file==='404.html'?'noindex, follow':'index, follow'}">`);
    html = html.replace('content="/assets/og-thefounder.png"',`content="${origin}/assets/og-thefounder.png"`);
    html = html.replace("script-src 'self'",`script-src 'self' 'sha256-${hash}'`);
    html = html.replace('</head>',`${file==='404.html'?'':`<link rel="canonical" href="${origin}${path}"><meta property="og:url" content="${origin}${path}"><script type="application/ld+json">${website}</script>`}</head>`);
  }
  await writeFile(resolve(root,'dist',file),html);
}
for(const file of assets){await mkdir(dirname(resolve(root,'dist',file)),{recursive:true});await copyFile(resolve(root,file),resolve(root,'dist',file));}
await writeFile(resolve(root,'dist/robots.txt'), production ? `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n` : 'User-agent: *\nDisallow: /\n');
await writeFile(resolve(root,'dist/sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${production?pages.filter(x=>x!=='404.html').map(x=>`<url><loc>${origin}${x==='index.html'?'/':'/'+x}</loc></url>`).join(''):''}</urlset>\n`);
const headers={...securityHeaders,'Content-Security-Policy':policy,...(!production?{'X-Robots-Tag':'noindex, nofollow'}:{'Strict-Transport-Security':'max-age=31536000'})};
await writeFile(resolve(root,'dist/_headers'),'/*\n'+Object.entries(headers).map(([k,v])=>`  ${k}: ${v}`).join('\n')+'\n');
const manifest={mode:production?'production':'preview',files:[...pages,...assets,'robots.txt','sitemap.xml','_headers']};
await writeFile(resolve(root,'dist/build-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(`Build ${manifest.mode} : ${manifest.files.length} fichiers dans dist/. Aucune publication effectuée.`);
