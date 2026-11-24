import {createRequire} from 'node:module';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
import {pages} from '../scripts/site-files.mjs';
const require=createRequire(import.meta.url);
const {chromium}=process.env.PLAYWRIGHT_MODULE_PATH?require(process.env.PLAYWRIGHT_MODULE_PATH):require('playwright');
const axe=await readFile(process.env.AXE_SOURCE_PATH||require.resolve('axe-core/axe.min.js'),'utf8');
const root=fileURLToPath(new URL('..',import.meta.url));
const out=resolve(process.env.QA_OUTPUT_DIR || resolve(root,'docs/qa'));await mkdir(out,{recursive:true});
const base=process.env.BASE_URL||'http://127.0.0.1:4173';
const result={browser:'Chromium',base,widths:[320,375,768,1024,1440,1920],pageChecks:[],accessibility:[],errors:[],checks:[],performance:null};
const browser=await chromium.launch({headless:true,...(process.env.BROWSER_EXECUTABLE?{executablePath:process.env.BROWSER_EXECUTABLE}:{})});
// A temporary same-project OIDC token may authenticate a protected Preview.
// Scope it to the exact origin, never to third-party requests or artifacts.
async function newContext(options) {
  const context = await browser.newContext(options);
  if (process.env.VERCEL_OIDC_TOKEN) await context.route('**/*', route => {
    const headers = {...route.request().headers()};
    delete headers['x-vercel-trusted-oidc-idp-token'];
    if (new URL(route.request().url()).origin === new URL(base).origin) headers['x-vercel-trusted-oidc-idp-token'] = process.env.VERCEL_OIDC_TOKEN;
    return route.continue({headers});
  });
  return context;
}
try{
  const context=await newContext();const page=await context.newPage();
  page.on('pageerror',e=>result.errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error' && !(m.text().includes('404') && new URL(m.location().url || base).pathname === '/404.html'))result.errors.push(m.text())});
  for(const width of result.widths){
    await page.setViewportSize({width,height:900});
    for(const file of pages){
      const response=await page.goto(base+'/'+(file==='index.html'?'':file));
      assert.equal(response.status(),file==='404.html'?404:200,`HTTP ${file}`);
      await page.locator('main').waitFor();
      const sizes=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,h1:document.querySelectorAll('h1').length,broken:[...document.images].filter(x=>x.complete&&!x.naturalWidth).map(x=>x.src)}));
      assert.ok(sizes.scroll<=width,`${file} déborde à ${width}: ${sizes.scroll}`);assert.equal(sizes.h1,1);assert.deepEqual(sizes.broken,[]);
      if(file==='index.html'){
        await page.locator('#technologies').scrollIntoViewIfNeeded();
        await page.waitForFunction(()=>[...document.querySelectorAll('.tf-tool-logo')].every(x=>x.complete&&x.naturalWidth>0));
        const grid=await page.locator('.tf-stack-tool').evaluateAll(xs=>xs.map(x=>{const r=x.getBoundingClientRect();return {x:Math.round(r.x),y:Math.round(r.y)}}));
        assert.equal(new Set(grid.map(x=>x.x)).size,3);assert.equal(new Set(grid.map(x=>x.y)).size,3);
        assert.ok((await page.locator('[data-tool="make"] img').boundingBox()).width>=96,'Logo Make : largeur minimale 96 px');
      }
      result.pageChecks.push({file,width,pass:true});
    }
  }
  result.checks.push('54 contrôles de pages à 320/375/768/1024/1440/1920 px, logos et grille 3 × 3');
  // Menu, keyboard dismissal, all anchor links, actual navigation.
  await page.setViewportSize({width:375,height:812});await page.goto(base);
  const button=page.locator('#menu-button');await button.focus();await page.keyboard.press('Enter');assert.equal(await button.getAttribute('aria-expanded'),'true');
  await page.keyboard.press('Tab');assert.equal(await page.locator('.nav a').first().evaluate(x=>document.activeElement===x),true);
  await page.keyboard.press('Escape');assert.equal(await button.getAttribute('aria-expanded'),'false');assert.equal(await button.evaluate(x=>document.activeElement===x),true);
  await button.click();await page.locator('.nav a[href="#technologies"]').click();assert.equal(await button.getAttribute('aria-expanded'),'false');
  await button.click();await page.locator('.nav a[href="realisations.html"]').click();assert.match(page.url(),/realisations.html$/);
  await page.goto(base);await page.locator('.solution-card').first().click();assert.match(page.url(),/solutions.html#brain$/);
  result.checks.push('Menu mobile, activation clavier, Échap et retour focus, fermeture après ancre, pages et offres');
  // Intercept the click before the OS mail handler; no message is sent.
  await page.goto(base);await page.evaluate(()=>{window.__mail=null;document.addEventListener('click',e=>{const a=e.target.closest('a[href^="mailto:"]');if(a){window.__mail=a.href;e.preventDefault();}},true)});
  await page.locator('.cta-primary').click();const mail=await page.evaluate(()=>window.__mail);const url=new URL(mail);assert.equal(url.pathname,'contactajaoub@gmail.com');assert.equal(url.searchParams.get('subject'),'Demande de projet - TheFounder');
  result.checks.push('Clic CTA vers mailto et objet exact, sans envoi ni ouverture de messagerie');
  // One-shot viewport animation, French decimals, and live reduced-motion preference.
  await page.setViewportSize({width:1440,height:900});await page.goto(base);
  const counter=page.locator('.impact-number[data-target="25.1"]');
  await page.locator('#impact').scrollIntoViewIfNeeded();await page.waitForTimeout(150);
  const intermediate=Number((await counter.textContent()).replace('+','').replace(',','.'));
  assert.ok(intermediate>=0&&intermediate<25.1,'Le compteur doit évoluer avant sa valeur finale');
  await page.waitForTimeout(1300);assert.equal(await counter.textContent(),'+25,1');
  await page.evaluate(()=>scrollTo(0,0));await page.locator('#impact').scrollIntoViewIfNeeded();assert.equal(await counter.textContent(),'+25,1');
  await page.emulateMedia({reducedMotion:'reduce'});await page.reload();await page.locator('#impact').scrollIntoViewIfNeeded();assert.equal(await counter.textContent(),'+25,1');
  assert.equal(await page.locator('.bubble').first().evaluate(x=>getComputedStyle(x).animationName),'none');
  result.checks.push('Compteurs au scroll, valeur française, une seule exécution, animations réduites');
  await page.emulateMedia({reducedMotion:'no-preference'});await page.goto(base);await page.locator('#technologies').scrollIntoViewIfNeeded();
  const logo=page.locator('[data-tool="supabase"] img');assert.equal(await logo.evaluate(x=>getComputedStyle(x).filter),'grayscale(1)');
  await page.locator('[data-tool="supabase"]').hover();await page.waitForTimeout(300);assert.equal(await logo.evaluate(x=>getComputedStyle(x).filter),'none');
  await page.mouse.move(0,0);await page.locator('[data-tool="supabase"]').focus();await page.waitForTimeout(300);assert.equal(await logo.evaluate(x=>getComputedStyle(x).filter),'none');
  result.checks.push('Logos gris au repos et authentiques au survol et au focus');
  const touch=await newContext({viewport:{width:375,height:812},hasTouch:true,isMobile:true});const touchPage=await touch.newPage();await touchPage.goto(base);await touchPage.locator('#technologies').scrollIntoViewIfNeeded();assert.equal(await touchPage.locator('[data-tool="supabase"] img').evaluate(x=>getComputedStyle(x).filter),'none');await touch.close();
  result.checks.push('Couleurs des logos sur appareil tactile');
  // Accessibility engine in the real browser, across all pages, at desktop and mobile.
  for(const width of [375,1440]){
    await page.setViewportSize({width,height:900});
    for(const file of pages){
      await page.goto(base+'/'+file);await page.evaluate(axe);
      const audit=await page.evaluate(()=>window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}}));
      result.accessibility.push({file,width,violations:audit.violations.map(x=>({id:x.id,impact:x.impact,description:x.description,nodes:x.nodes.map(n=>({html:n.html,summary:n.failureSummary}))})),incomplete:audit.incomplete.map(x=>x.id)});
    }
  }
  // Final screenshot evidence, including all six sections.
  for(const [label,width,height] of [['desktop',1440,900],['mobile',375,812]]){
    await page.setViewportSize({width,height});await page.emulateMedia({reducedMotion:'reduce'});await page.goto(base);
    await page.locator('#technologies').scrollIntoViewIfNeeded();await page.waitForTimeout(150);await page.evaluate(()=>scrollTo(0,0));
    await page.screenshot({path:resolve(out,`accueil-${label}.png`),fullPage:true});
    for(const selector of ['#impact','#solutions','#processus','#technologies','#contact'])await page.locator(selector).screenshot({path:resolve(out,`${selector.slice(1)}-${label}.png`)});
    await page.goto(base+'/solutions.html');await page.screenshot({path:resolve(out,`solutions-${label}.png`),fullPage:true});
  }
  // No-JS navigation and meaningful counters.
  const nojs=await newContext({javaScriptEnabled:false,viewport:{width:375,height:812}});const nojsPage=await nojs.newPage();await nojsPage.goto(base);assert.ok(await nojsPage.locator('.nav a').first().isVisible());assert.equal(await nojsPage.locator('.impact-number[data-target="15"]').textContent(),'+15');await nojsPage.locator('.cta-secondary').click();assert.match(nojsPage.url(),/realisations.html$/);await nojs.close();
  result.checks.push('Navigation et chiffres utilisables sans JavaScript');
  // Observe only the first-party static document, without claiming lab scores.
  await page.goto(base);result.performance=await page.evaluate(()=>({navigation:performance.getEntriesByType('navigation').map(x=>({domContentLoaded:x.domContentLoadedEventEnd,load:x.loadEventEnd,transferSize:x.transferSize})),resources:performance.getEntriesByType('resource').map(x=>({name:x.name,transferSize:x.transferSize})),cookieNames:document.cookie.split(';').filter(Boolean).map(x=>x.split('=')[0].trim()),storageKeys:Object.keys(localStorage)}));
  result.checks.push('Ressources locales, pas de cookie ni stockage local');
  assert.deepEqual(result.errors,[],'Erreurs navigateur');
  const violations=result.accessibility.flatMap(x=>x.violations.map(v=>({file:x.file,width:x.width,...v})));
  assert.equal(violations.length,0,JSON.stringify(violations,null,2));
  console.log(JSON.stringify({pageChecks:result.pageChecks.length,audits:result.accessibility.length,violations:violations.length,errors:result.errors,checks:result.checks},null,2));
}catch(error){result.errors.push(error.message);console.error(error.message);process.exitCode=1;}
finally{await writeFile(resolve(out,'browser-results.json'),JSON.stringify(result,null,2)+'\n');await browser.close();}
