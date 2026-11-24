import http from 'node:http';
import {readFile, realpath, stat} from 'node:fs/promises';
import {resolve, extname, sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {publicFiles, securityHeaders} from './site-files.mjs';
const root = resolve(fileURLToPath(new URL('..', import.meta.url)), process.argv.includes('--dist') ? 'dist' : '.');
const builtHeaders = process.argv.includes('--dist') ? JSON.parse(await readFile(resolve(root, 'build-manifest.json'), 'utf8')).headers : {};
const allow = new Set([...publicFiles, 'sitemap.xml']);
const mime = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.txt':'text/plain; charset=utf-8','.xml':'application/xml; charset=utf-8'};
const port = Number(process.env.PORT || 4173);
const server = http.createServer(async (req,res) => {
  const headers = {...securityHeaders, ...builtHeaders, 'Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow'};
  const send = (status,body,type='text/plain; charset=utf-8') => {
    res.writeHead(status,{...headers,'Content-Type':type});res.end(req.method === 'HEAD' ? undefined : body);
  };
  if (!['GET','HEAD'].includes(req.method)) {res.setHeader('Allow','GET, HEAD');send(405,'Méthode non autorisée');return;}
  try {
    const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    if (pathname.includes('\\') || pathname.includes('\0')) {send(400,'Adresse incorrecte');return;}
    const relative = pathname === '/' ? 'index.html' : pathname.slice(1);
    if (!allow.has(relative)) {send(404,await readFile(resolve(root,'404.html')),mime['.html']);return;}
    const file = await realpath(resolve(root,relative));
    if (!file.startsWith(root+sep) || !(await stat(file)).isFile()) {send(403,'Accès refusé');return;}
    send(relative === '404.html' ? 404 : 200,await readFile(file),mime[extname(file)] || 'application/octet-stream');
  } catch (error) {
    if (error instanceof URIError) {send(400,'Adresse incorrecte');return;}
    if (error.code === 'ENOENT') {send(404,await readFile(resolve(root,'404.html')),mime['.html']);return;}
    console.error(error.message);send(500,'Erreur interne');
  }
});
server.listen(port,'127.0.0.1',()=>console.log(`TheFounder : http://127.0.0.1:${port} — prévisualisation locale uniquement`));
