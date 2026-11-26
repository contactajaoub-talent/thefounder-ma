// Local browser contract tests. CAPTCHA and HTTP responses are explicit fixtures;
// these results do not certify live Turnstile or cloud persistence.
import {chromium} from 'playwright';
import {fileURLToPath} from 'node:url';
import {spawn,spawnSync} from 'node:child_process';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
const root=fileURLToPath(new URL('..',import.meta.url)),endpoint='https://thefounder-crm.vercel.app/api/diagnostic';
const build=spawnSync(process.execPath,['scripts/build.mjs'],{cwd:root,encoding:'utf8',env:{...process.env,THEFOUNDER_INTAKE_URL:endpoint,THEFOUNDER_TURNSTILE_SITE_KEY:'local-fixture'}});
assert.equal(build.status,0,build.stderr);
const server=spawn(process.execPath,['scripts/dev-server.mjs','--dist'],{cwd:root,windowsHide:true,env:{...process.env,PORT:'4188'},stdio:['ignore','pipe','pipe']});
await new Promise((ready,fail)=>{server.stdout.once('data',ready);server.once('error',fail);server.once('exit',code=>fail(Error('Server exited '+code)));});
let browser;
try{
 browser=await chromium.launch({channel:'chrome',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.route('https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit',r=>r.fulfill({contentType:'text/javascript',body:`window.turnstile={render:(el,options)=>{window.captchaOptions=options;return 'fixture';},remove:()=>{},reset:()=>{},getResponse:()=> 'local-test-token'};`}));
 const requests=[];let answer={status:503,body:{error:'storage_failed'}},release;
 await page.route(endpoint,async route=>{
  if(route.request().method()==='OPTIONS')return route.fulfill({status:204,headers:{'Access-Control-Allow-Origin':'http://127.0.0.1:4188','Access-Control-Allow-Headers':'content-type','Access-Control-Allow-Methods':'POST'}});
  requests.push(route.request().postDataJSON());
  if(release)await new Promise(r=>release=r);
  if(answer.abort)return route.abort('timedout');
  return route.fulfill({status:answer.status,headers:{'Access-Control-Allow-Origin':'http://127.0.0.1:4188'},contentType:'application/json',body:JSON.stringify(answer.body)});
 });
 await page.goto('http://127.0.0.1:4188/diagnostic');
 const next=()=>page.locator('#next').click();
 for(const group of [['sector','size'],['departments','problems'],['tools'],['goals']]){for(const field of group)await page.locator('[data-field='+field+']').first().click();await next();}
 assert.equal(await page.locator('#f-phone').inputValue(),'+212 ');
 await page.locator('#f-company').fill('QA LOCAL DIAGNOSTIC');
 await next();assert.match(await page.locator('#form-error').textContent(),/nom/);
 await page.locator('#f-name').fill('Contact fictif');
 await page.locator('#f-company').fill('');await next();assert.match(await page.locator('#form-error').textContent(),/entreprise/);
 await page.locator('#f-company').fill('QA LOCAL DIAGNOSTIC');
 for(const phone of ['','.......','0600000000','+212','+1234567890123456']){await page.locator('#f-phone').fill(phone);await next();assert.match(await page.locator('#form-error').textContent(),/téléphone/);}
 await page.locator('#f-phone').fill('+212 600 000 000');await page.locator('#f-email').fill('invalid');await next();assert.match(await page.locator('#form-error').textContent(),/e-mail/);
 await page.locator('#f-email').fill('');await next();assert.match(await page.locator('#form-error').textContent(),/accord/);assert.equal(requests.length,0);
 await page.locator('#consent').check();
 await next();await page.locator('#next:not([disabled])').waitFor();
 assert.equal(await page.locator('.diagnostic-success').count(),0);assert.equal(await page.locator('#f-company').inputValue(),'QA LOCAL DIAGNOSTIC');assert.equal(requests[0].answers.email,'');assert.equal(requests[0].answers.phone,'+212600000000');
 answer={abort:true};await next();await page.locator('#next:not([disabled])').waitFor();assert.match(await page.locator('#form-error').textContent(),/Connexion impossible/);assert.equal(requests[1].submissionId,requests[0].submissionId);
 answer={status:200,body:{ok:true}};await next();await page.locator('#next:not([disabled])').waitFor();assert.equal(await page.locator('.diagnostic-success').count(),0);
 answer={status:201,body:{ok:true,reference:'internal-fixture-id'}};release=true;
 await page.locator('#next').evaluate(button=>{button.click();button.click();});
 await page.waitForFunction(()=>document.querySelector('#next').disabled);
 assert.equal(await page.locator('#f-name').isDisabled(),true);assert.equal(await page.locator('#back').isDisabled(),true);
 await page.waitForFunction(()=>document.querySelector('#next').textContent.includes('Transmission'));
 // Wait for the one pending request, then release the simulated persistence response.
 for(let i=0;i<100&&typeof release!=='function';i++)await new Promise(r=>setTimeout(r,20));
 assert.equal(typeof release,'function');assert.equal(requests.length,4);release();
 await page.locator('.diagnostic-success').waitFor();
 const text=await page.locator('.wizard').textContent();assert.match(text,/Merci pour votre confiance !/);assert.ok(!text.includes('internal-fixture-id'));assert.ok(!text.includes('Référence'));assert.equal(requests[3].submissionId,requests[0].submissionId);
 assert.equal(await page.evaluate(()=>window.captchaOptions.appearance),'interaction-only');
 for(const width of [390,768]){
  await page.setViewportSize({width,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await page.goto('http://127.0.0.1:4188/');await page.locator('#menu-button').click();assert.equal(await page.locator('#menu-button').getAttribute('aria-expanded'),'true');
  await page.locator('#main-navigation a[href="/diagnostic"]').first().click();await page.waitForURL('**/diagnostic');assert.equal(await page.locator('#step-label').textContent(),'ÉTAPE 01 / 05');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 }
 assert.deepEqual(errors,[]);
 console.log('PASS local browser: required fields, international phone, optional email, consent, failures, retained answers, idempotent retry, double click, persistence-only confirmation, responsive.');
}finally{await browser?.close();server.kill();}
