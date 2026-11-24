import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=process.env.PLAYWRIGHT_MODULE_PATH?require(process.env.PLAYWRIGHT_MODULE_PATH):require('playwright');
const base=process.env.BASE_URL||'http://127.0.0.1:4173';
const out=resolve(process.env.QA_OUTPUT_DIR||'docs/qa/preloader');
await mkdir(out,{recursive:true});
const results={base,scenarios:[],errors:[]};
const browser=await chromium.launch({headless:true,...(process.env.BROWSER_EXECUTABLE?{executablePath:process.env.BROWSER_EXECUTABLE}:{})});
async function context(options={}) {
  const value=await browser.newContext(options);
  if(process.env.VERCEL_OIDC_TOKEN)await value.route('**/*',route=>{
    const headers={...route.request().headers()};delete headers['x-vercel-trusted-oidc-idp-token'];
    if(new URL(route.request().url()).origin===new URL(base).origin)headers['x-vercel-trusted-oidc-idp-token']=process.env.VERCEL_OIDC_TOKEN;
    return route.continue({headers});
  });
  await value.addInitScript(()=>{
    window.__tfpQA={};
    document.addEventListener('thefounder:preloader-ready',()=>window.__tfpQA.removedAt=performance.now());
  });
  return value;
}
async function waitAt(page,ms) {
  await page.waitForFunction(delay=>performance.now()-window.__tfpQA.animationStart>=delay,ms);
}
try {
  for(const width of [320,375,768,1440,1920]) {
    const ctx=await context({viewport:{width,height:900}}),page=await ctx.newPage();
    page.on('pageerror',e=>results.errors.push(e.message));
    const failed=[];page.on('requestfailed',r=>failed.push(new URL(r.url()).pathname));
    await page.goto(base,{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>{
      const animation=document.getElementById('thefounder-preloader')?.getAnimations().find(x=>x.animationName==='tfp-screen-out');
      if(animation?.startTime!=null){window.__tfpQA.animationStart=animation.startTime;return true;}return false;
    });
    const timings=await page.locator('.tfp-lockup').evaluate(el=>[...el.querySelectorAll('img')].map(x=>({name:x.className,delay:getComputedStyle(x).animationDelay,duration:getComputedStyle(x).animationDuration})));
    assert.deepEqual(timings.map(x=>x.delay),['0.08s','0.59s','1.11s']);
    await waitAt(page,300);
    if(width===1440||width===375) {
      const early=await page.locator('.tfp-lockup').evaluate(el=>({symbol:+getComputedStyle(el.querySelector('.tfp-symbol')).opacity,name:+getComputedStyle(el.querySelector('.tfp-wordmark')).opacity}));
      assert.ok(early.symbol>0);assert.equal(early.name,0);
    }
    await waitAt(page,1500);
    const imageState=await page.locator('.tfp-lockup').evaluate(el=>[...el.querySelectorAll('img')].map(x=>{const style=getComputedStyle(x),r=x.getBoundingClientRect();return {name:x.className,complete:x.complete,width:x.naturalWidth,opacity:+style.opacity,visible:style.display!=='none',left:r.left,right:r.right,bottom:r.bottom,viewport:innerWidth,height:innerHeight};}));
    assert.equal(imageState.find(x=>x.name==='tfp-tagline').visible,width>650,'Signature PNG masquée sur mobile, où le kit prévoit sa version textuelle');
    for(const image of imageState){assert.equal(image.complete,true);assert.ok(image.width>0);if(image.visible){assert.equal(image.opacity,1);assert.ok(image.left>=-1&&image.right<=image.viewport+1&&image.bottom<=image.height,image.name+' hors écran');}}
    if(width===1440||width===375)await page.screenshot({path:resolve(out,`preloader-${width}.png`)});
    await page.locator('#thefounder-preloader').waitFor({state:'detached',timeout:3000});
    const elapsed=await page.evaluate(()=>window.__tfpQA.removedAt-window.__tfpQA.animationStart);
    assert.ok(elapsed>=1800&&elapsed<=2250,`Durée anormale : ${elapsed} ms`);
    assert.equal(await page.locator('main section').count(),6);
    await page.locator('.cta-secondary').click();assert.ok(page.url().endsWith('/realisations.html'));
    assert.equal(await page.locator('#thefounder-preloader').count(),0);
    assert.deepEqual(failed,[]);
    results.scenarios.push({scenario:'séquence, images, dimensions, durée, accès après fermeture et page secondaire',width,elapsedMs:Math.round(elapsed),images:imageState,timings,pass:true});
    await ctx.close();
  }
  const reduced=await context({reducedMotion:'reduce',viewport:{width:375,height:812}}),rp=await reduced.newPage();
  await rp.goto(base,{waitUntil:'domcontentloaded'});
  await rp.locator('#thefounder-preloader').waitFor({state:'detached',timeout:1000});
  await rp.locator('.cta-secondary').click();assert.ok(rp.url().endsWith('/realisations.html'));
  results.scenarios.push({scenario:'mouvement réduit : fermeture rapide et navigation',pass:true});await reduced.close();
  for(const motion of ['no-preference','reduce']) {
    const ctx=await context({javaScriptEnabled:false,reducedMotion:motion,viewport:{width:375,height:812}}),page=await ctx.newPage();
    await page.goto(base);await page.locator('#thefounder-preloader').waitFor({state:'hidden',timeout:3500});
    await page.locator('.cta-secondary').click();assert.ok(page.url().endsWith('/realisations.html'));
    results.scenarios.push({scenario:'sans JS : fermeture CSS et navigation',motion,pass:true});await ctx.close();
  }
  const blocked=await context(),bp=await blocked.newPage();
  await blocked.route('**/assets/preloader/preloader.js',route=>route.abort());
  await bp.goto(base);await bp.locator('#thefounder-preloader').waitFor({state:'hidden',timeout:3500});
  await bp.locator('.cta-secondary').click();assert.ok(bp.url().endsWith('/realisations.html'));
  results.scenarios.push({scenario:'échec du JS preloader : secours CSS et navigation',pass:true});await blocked.close();
  const live=await context(),lp=await live.newPage();await lp.goto(base,{waitUntil:'domcontentloaded'});
  await lp.emulateMedia({reducedMotion:'reduce'});await lp.locator('#thefounder-preloader').waitFor({state:'detached',timeout:1000});
  results.scenarios.push({scenario:'activation du mouvement réduit pendant le preloader',pass:true});await live.close();
  assert.deepEqual(results.errors,[]);
} catch(error) {results.errors.push(error.message);process.exitCode=1;console.error(error.message);}
finally {await writeFile(resolve(out,'preloader-results.json'),JSON.stringify(results,null,2));await browser.close();console.log(JSON.stringify({scenarios:results.scenarios.length,errors:results.errors},null,2));}
