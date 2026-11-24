import {mkdir, readFile, writeFile, lstat, rm} from 'node:fs/promises';
import {resolve, dirname, sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {pages, assets, csp, securityHeaders} from './site-files.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const explicitProduction = process.argv.includes('--production');
const explicitPreview = process.argv.includes('--preview');
const vercelProduction = [process.env.VERCEL_ENV, process.env.VERCEL_TARGET_ENV].includes('production');
if (explicitPreview && (explicitProduction || vercelProduction)) throw Error('Un build Production ne peut pas être forcé en preview/noindex.');
const production = explicitProduction || vercelProduction;
const release = JSON.parse(await readFile(resolve(root, 'config/release.json'), 'utf8'));
let origin;
if (production) {
  const missing = ['publicationApproved', 'legalApproved', 'privacyApproved', 'brandUseApproved'].filter(key => release[key] !== true);
  if (missing.length) throw Error(`Publication bloquée : validations réelles manquantes dans config/release.json : ${missing.join(', ')}. Ne pas les activer sans preuve.`);
  const url = new URL(release.siteOrigin);
  if (url.protocol !== 'https:' || url.pathname !== '/' || url.search || url.hash || url.username || url.password) throw Error('siteOrigin doit être une origine HTTPS validée, sans chemin ni paramètres.');
  origin = url.origin;
  for (const file of ['mentions-legales.html', 'confidentialite.html']) {
    if ((await readFile(resolve(root, file), 'utf8')).includes('TODO_CLIENT')) throw Error(`Publication bloquée : compléter ${file}.`);
  }
}

// Prepare and validate all inputs before replacing the generated outputs.
const output = new Map();
const website = production ? JSON.stringify({
  '@context':'https://schema.org',
  '@type':'WebSite',
  name:'TheFounder',
  url:origin+'/',
  inLanguage:'fr-MA',
  description:'Logiciels sur mesure, automatisation et solutions IA pour les entreprises au Maroc.',
  publisher:{
    '@type':'Person',
    name:'Othmane Ajaoub',
    url:origin+'/fondateur.html',
    brand:{'@type':'Brand',name:'TheFounder'}
  },
  about:[
    {'@type':'Service',name:'Logiciels métier sur mesure',areaServed:'Maroc'},
    {'@type':'Service',name:'Automatisation des processus métier',areaServed:'Maroc'},
    {'@type':'Service',name:'Intégration d’intelligence artificielle',areaServed:'Maroc'}
  ]
}) : null;
const hash = website ? createHash('sha256').update(website).digest('base64') : null;
const policy = hash ? csp.replace("script-src 'self'", `script-src 'self' 'sha256-${hash}'`) : csp;
for (const file of pages) {
  let html = await readFile(resolve(root, file), 'utf8');
  if (production) {
    if ((html.match(/<meta name="robots" content="noindex, nofollow">/g) || []).length !== 1 || /rel="canonical"/.test(html)) throw Error(`Métadonnées sources inattendues : ${file}.`);
    const path = file === 'index.html' ? '/' : '/'+file;
    html = html.replace('<meta name="robots" content="noindex, nofollow">', `<meta name="robots" content="${file === '404.html' ? 'noindex, follow' : 'index, follow'}">`);
    html = html.replace('content="/assets/og-thefounder.png"', `content="${origin}/assets/og-thefounder.png"`);
    html = html.replace("script-src 'self'", `script-src 'self' 'sha256-${hash}'`);
    if (file !== '404.html') html = html.replace('</head>', `<link rel="canonical" href="${origin}${path}"><meta property="og:url" content="${origin}${path}"><script type="application/ld+json">${website}</script></head>`);
    if (file !== '404.html' && /noindex|nofollow/.test(html)) throw Error(`Publication bloquée : ${file} contient encore une directive de non-indexation.`);
  }
  output.set(file, html);
}
for (const file of assets) output.set(file, await readFile(resolve(root, file)));
output.set('robots.txt', production ? `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n` : 'User-agent: *\nDisallow: /\n');
output.set('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${production ? pages.filter(x => x !== '404.html').map(x => `<url><loc>${origin}${x === 'index.html' ? '/' : '/'+x}</loc></url>`).join('') : ''}</urlset>\n`);
const headers = {...securityHeaders, 'Content-Security-Policy':policy, ...(production ? {'Strict-Transport-Security':'max-age=31536000'} : {'X-Robots-Tag':'noindex, nofollow'})};

// Never delete through a junction/symlink, or outside this repository.
async function resetOutput(relative) {
  const target = resolve(root, relative);
  if (!target.startsWith(root+sep) || !['dist', '.vercel/output'].includes(relative)) throw Error('Chemin de génération refusé.');
  let current = root;
  for (const segment of relative.split('/')) {
    current = resolve(current, segment);
    try { if ((await lstat(current)).isSymbolicLink()) throw Error('Lien symbolique interdit dans les sorties du build.'); }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  await rm(target, {recursive:true, force:true});
  await mkdir(target, {recursive:true});
  return target;
}
const dist = await resetOutput('dist');
const adapter = await resetOutput('.vercel/output');
for (const [file, data] of output) {
  // Vercel receives only the explicit public export, never the repository root.
  for (const directory of [dist, resolve(adapter, 'static')]) {
    await mkdir(dirname(resolve(directory, file)), {recursive:true});
    await writeFile(resolve(directory, file), data);
  }
}
await writeFile(resolve(dist, '_headers'), '/*\n'+Object.entries(headers).map(([key, value]) => `  ${key}: ${value}`).join('\n')+'\n');
const manifest = {mode:production ? 'production' : 'preview', files:[...output.keys(), '_headers'], headers};
await writeFile(resolve(dist, 'build-manifest.json'), JSON.stringify(manifest, null, 2)+'\n');
// _headers is useful for portable exports but is not interpreted by Vercel.
// Build Output API v3 supplies the effective mode-dependent HTTP policy.
const config = {version:3, routes:[
  {src:'/(.*)', headers, continue:true},
  {src:'/404\\.html', dest:'/404.html', status:404, headers:{'X-Robots-Tag':'noindex, follow'}},
  {handle:'filesystem'},
  {src:'/(.*)', dest:'/404.html', status:404, headers:{'X-Robots-Tag':'noindex, follow'}},
]};
await writeFile(resolve(adapter, 'config.json'), JSON.stringify(config, null, 2)+'\n');
console.log(`Build ${manifest.mode} : ${output.size} fichiers publics depuis dist/, adaptateur statique Vercel généré. Aucune publication effectuée.`);
