import {createRequire} from 'node:module';
import {existsSync} from 'node:fs';
import {mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
import {pages} from '../scripts/site-files.mjs';
const require=createRequire(import.meta.url);
const playwright=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
const base=process.env.BASE_URL||'http://127.0.0.1:4173';
const out=resolve(process.env.QA_OUTPUT_DIR||'docs/qa/link-icons');await mkdir(out,{recursive:true});
const result={base,pages:[],checks:[],errors:[],webkit:'non exécuté : moteur non installé'};
const engines=['chromium',...(existsSync(playwright.webkit.executablePath())?['webkit']:[])];
for(const engine of engines){
 const browser=await playwright[engine].launch({headless:true,...(engine==='chromium'&&process.env.BROWSER_EXECUTABLE?{executablePath:process.env.BROWSER_EXECUTABLE}:{})});
 async function createContext(options={}){
 const context=await browser.newContext(options);
 if(process.env.VERCEL_OIDC_TOKEN)await context.route('**/*',route=>{
  const headers={...route.request().headers()};delete headers['x-vercel-trusted-oidc-idp-token'];
  if(new URL(route.request().url()).origin===new URL(base).origin)headers['x-vercel-trusted-oidc-idp-token']=process.env.VERCEL_OIDC_TOKEN;
  return route.continue({headers});
 });return context;
 }
 const context=await createContext();
 const page=await context.newPage();
 page.on('pageerror',e=>result.errors.push(e.message));
 page.on('console',m=>{if(m.type()==='error'&&!(m.text().includes('404')&&new URL(m.location().url||base).pathname==='/404.html'))result.errors.push(m.text())});
 page.on('requestfailed',r=>result.errors.push(new URL(r.url()).pathname+' '+r.failure()?.errorText));
 const visit=async(file='index.html')=>{await page.goto(new URL(file,base).href);if(file==='index.html')await page.locator('#thefounder-preloader').waitFor({state:'hidden'});};
 try{
  for(const width of [320,375,390,768,1024,1440]){
   await page.setViewportSize({width,height:900});
   for(const file of pages){
    await visit(file);
    // A positive SVG bounding box proves that the external symbol was resolved and drawn.
    await page.waitForFunction(()=>[...document.querySelectorAll('.link-icon svg')].filter(x=>x.getBoundingClientRect().width>0).every(x=>x.getBBox().width>0));
    const icons=await page.locator('.link-icon').evaluateAll(xs=>xs.map(x=>{
     const svg=x.querySelector('svg'),s=getComputedStyle(svg),r=x.getBoundingClientRect(),v=svg.getBoundingClientRect();
     return {visible:r.width>0,box:r.width,height:r.height,svgWidth:v.width,svgHeight:v.height,stroke:s.stroke,color:getComputedStyle(x).color,fill:s.fill,linecap:s.strokeLinecap,linejoin:s.strokeLinejoin,strokeWidth:s.strokeWidth,hidden:svg.getAttribute('aria-hidden'),focusable:svg.getAttribute('focusable'),ref:svg.querySelector('use').getAttribute('href'),bbox:svg.getBBox().width};
    }));
    for(const icon of icons){
     assert.equal(icon.ref,'/assets/icons/link.svg#arrow-up-right');assert.equal(icon.hidden,'true');assert.equal(icon.focusable,'false');
     if(icon.visible){assert.ok(icon.bbox>0);assert.equal(icon.box,icon.height);assert.equal(icon.svgWidth,icon.box);assert.equal(icon.svgHeight,icon.height);assert.equal(icon.fill,'none');assert.equal(icon.stroke,icon.color);assert.equal(icon.strokeWidth,'2px');assert.equal(icon.linecap,'round');assert.equal(icon.linejoin,'round');}
    }
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${file} ${width} sans débordement`);
    result.pages.push({engine,file,width,icons:icons.length,rendered:icons.filter(x=>x.visible).length,pass:true});
   }
  }
  for(const width of [375,1440]){
   await page.setViewportSize({width,height:900});await visit();
   const device=width===375?'mobile':'desktop';
   await page.locator('.hero').screenshot({path:resolve(out,`cta-${device}.png`)});
   await page.locator('.impact-section').screenshot({path:resolve(out,`sources-${device}.png`)});
   await page.locator('.solutions-section').screenshot({path:resolve(out,`solutions-${device}.png`)});
   const card=page.locator('.solution-card').first(),slot=card.locator('.card-link-icon');
   const size=await slot.evaluate(x=>({width:x.getBoundingClientRect().width,radius:getComputedStyle(x).borderRadius}));
   assert.equal(size.width,width===375?36:38);assert.equal(size.radius,width===375?'11px':'12px');
   const idle=await slot.evaluate(x=>getComputedStyle(x).backgroundColor);
   await card.focus();await page.waitForTimeout(250);
   assert.notEqual(await slot.evaluate(x=>getComputedStyle(x).backgroundColor),idle);
   assert.equal(await card.locator('.solution-arrow').evaluate(x=>getComputedStyle(x).backgroundColor),'rgb(115, 87, 255)');
   assert.notEqual(await card.evaluate(x=>getComputedStyle(x).outlineStyle),'none');
   await card.evaluate(x=>x.blur());
    if(width===1440){await card.scrollIntoViewIfNeeded();await page.waitForTimeout(350);await card.hover();await page.waitForFunction(()=>document.querySelector('.solution-card').matches(':hover'));await page.waitForTimeout(250);assert.notEqual(await slot.evaluate(x=>getComputedStyle(x).backgroundColor),idle);await page.locator('.solutions-section').screenshot({path:resolve(out,'solutions-hover-desktop.png')});}
   const cta=page.locator('.hero .cta-primary');
   assert.equal(await cta.getAttribute('href'),'/diagnostic');
   assert.equal(await cta.innerText(),'Explorer nos solutions');
   const alignment=await cta.evaluate(x=>{const a=x.getBoundingClientRect(),b=x.querySelector('.link-icon').getBoundingClientRect();return Math.abs((a.y+a.height/2)-(b.y+b.height/2));});assert.ok(alignment<1);
  }
  const touchContext=await createContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:3});
  const touchPage=await touchContext.newPage();await touchPage.goto(base);await touchPage.locator('#thefounder-preloader').waitFor({state:'hidden'});
  await touchPage.locator('.hero .cta-primary').evaluate(x=>{window.__linkClicks=[];x.addEventListener('click',e=>{e.preventDefault();window.__linkClicks.push(x.href);});});
  await touchPage.locator('.hero .cta-primary').tap();
  const clicks=await touchPage.evaluate(()=>window.__linkClicks);assert.equal(clicks.length,1);assert.equal(clicks[0],new URL('/diagnostic',base).href);
  assert.ok(await touchPage.locator('.hero .link-icon svg').evaluate(x=>x.getBBox().width>0));
  await touchPage.locator('.hero').screenshot({path:resolve(out,'cta-tactile.png')});await touchContext.close();
  const noJS=await createContext({javaScriptEnabled:false,viewport:{width:375,height:812}}),np=await noJS.newPage();await np.goto(base);
  await np.waitForFunction(()=>[...document.querySelectorAll('.link-icon svg')].filter(x=>x.getBoundingClientRect().width>0).every(x=>x.getBBox().width>0));
  assert.equal(await np.locator('.link-icon').count(),17);await noJS.close();
  result.checks.push(engine+' : symbole effectivement rendu sur les neuf pages, 6 largeurs, alignement CTA, cartes et sources, survol et focus préservés');
  result.checks.push(engine+' : CTA tactile activé au premier appui sans envoi, SVG visibles sans JavaScript');
  if(engine==='webkit')result.webkit='réussi sur WebKit automatisé ; aucun appareil iPhone physique utilisé';
 }finally{await browser.close();}
}
assert.equal(result.errors.length,0,JSON.stringify(result.errors));
await writeFile(resolve(out,'results.json'),JSON.stringify(result,null,2));
console.log(JSON.stringify({pageChecks:result.pages.length,checks:result.checks,webkit:result.webkit,errors:result.errors},null,2));
