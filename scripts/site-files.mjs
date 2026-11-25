export const pages = ['index.html', 'solutions.html', 'departements.html', 'diagnostic.html', 'realisations.html', 'fondateur.html', 'methode.html', 'contact.html', 'mentions-legales.html', 'confidentialite.html', '404.html'];
export const assets = ['assets/site.css','assets/site.js','assets/problems.css','assets/problems.js','assets/diagnostic.css','assets/diagnostic.js','assets/diagnostic-config.js','assets/icons/link.svg','assets/brand-mark.png','assets/favicon-32.png','assets/apple-touch-icon.png','assets/og-thefounder.png', ...['preloader.css','preloader.js','thefounder-symbol.png','thefounder-wordmark.png','thefounder-tagline.png'].map(name => `assets/preloader/${name}`), ...['n8n','supabase','nextjs','make','github','docker','vercel'].map(name => `assets/logos/${name}.svg`)];
export const publicFiles = [...pages, ...assets, 'robots.txt'];
export const csp = "default-src 'self'; script-src 'self' https://challenges.cloudflare.com; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'self' https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; upgrade-insecure-requests";
export const securityHeaders = {
  'Content-Security-Policy': csp,
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
};

/* URL publiques sans extension et noms de fichiers utilisés par le build. */
export const cleanUrlForPage = file => file === 'index.html' ? '/' : '/' + file.replace(/\.html$/, '');
export const routedPages = pages.filter(file => file !== 'index.html' && file !== '404.html');
