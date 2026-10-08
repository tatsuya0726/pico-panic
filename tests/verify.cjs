const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{spawn}=require('node:child_process');
const root=path.resolve(__dirname,'..'),port=4181;
const server=spawn(process.execPath,['serve.cjs'],{cwd:root,env:{...process.env,PORT:String(port)},stdio:'pipe',windowsHide:true});
const report={started:new Date().toISOString(),checks:[],screenshots:[],errors:[]};
let browser;
const check=(name,details)=>{report.checks.push({name,details});console.log('PASS',name,details||'')};
(async()=>{
 await new Promise((r,j)=>{server.stdout.once('data',r);server.once('error',j)});
 const executablePath=process.env.PICO_BROWSER||(process.platform==='win32'?'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe':undefined);
 browser=await chromium.launch({executablePath,headless:true});
 const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
 const page=await context.newPage();page.on('pageerror',e=>report.errors.push(e.message));
 await page.goto(`http://127.0.0.1:${port}/`);
 const data=await page.evaluate(()=>DB);assert.equal(data.length,352);assert.equal(new Set(data.map(q=>q.id)).size,data.length);
 check('catalog',Object.fromEntries([...new Set(data.map(q=>q.subject))].map(s=>[s,data.filter(q=>q.subject===s).length])));
 const click=async action=>{await page.locator(`[data-ex="${action}"]`).click({timeout:2500})};
 const old=async action=>{await page.locator(`[data-act="${action}"]`).click({timeout:2500})};
 async function load(q){await page.evaluate(id=>{saved.sound=false;prime();start('demo',[id]);},q.id)}
 async function solve(q){
  switch(q.kind){
  case'move':{let pos=4;for(const n of q.path){await old('move:'+(n-pos));pos=n;}break;}
  case'pack':for(const v of q.want)await old('pack:'+v);await old('submit');break;
  case'order':for(let k=0;k<q.words.length;k++)await old('word:'+k);await old('submit');break;
  case'clock':for(let k=0;k<q.hour%12;k++)await old('hour');for(let k=0;k<q.minute/15;k++)await old('minute');await old('submit');break;
  case'cafe':for(let k=0;k<q.coffee;k++)await old('coffee:1');for(let k=0;k<q.milk;k++)await old('milk:1');await old('submit');break;
  case'reply':await old('reply:'+q.correct);break;
  case'place':await old('place:'+q.target);await old('submit');break;
  case'switch':for(let k=0;k<q.want.length;k++)if(q.want[k]!==q.initial[k])await old('switch:'+k);await old('submit');break;
  case'line':await page.locator('#numberLine').fill(String(q.target));await page.locator('#numberLine').dispatchEvent('input');await click('submit');break;
  case'keypad':for(const d of String(q.target))await click('digit:'+d);await click('submit');break;
  case'balance':{let n=q.target;for(const w of [...q.weights].reverse())while(n>=w){await click('weight:'+w);n-=w;}await click('submit');break;}
  case'paint':for(let n=0;n<q.num;n++)await click('mark:'+n);await click('submit');break;
  case'timing':for(let k=0;k<q.values.indexOf(q.target);k++)await click('advance');await click('stop');break;
  case'sort':for(const card of q.cards)await click('bin:'+card.bin);break;
  case'match':for(let k=0;k<q.pairs.length;k++){await click('left:'+k);await click('right:'+k)}break;
  case'search':for(let k=0;k<q.tiles.length;k++)if(q.tiles[k]===q.target)await click('mark:'+k);await click('submit');break;
  case'memory':{const pairs=await page.evaluate(()=>S.input.memory.map(x=>x.pair));for(let k=0;k<q.pairs.length;k++)for(let n=0;n<pairs.length;n++)if(pairs[n]===k)await click('flip:'+n);break;}
  case'echo':{const options=await page.evaluate(()=>S.input.echoOptions);await click('hide');for(const value of q.sequence)await click('echo:'+options.indexOf(value));break;}
  case'trace':for(const n of q.path.slice(1))await click('route:'+n);break;
  case'rotate':for(let k=0;k<q.target;k++)await click('rotate:1');await click('submit');break;
  case'swap':await click('swap:0');await click('swap:'+(q.target.length-1));await click('submit');break;
  case'erase':await click('erase:1');await click('submit');break;
  case'type':await page.locator('#reading').fill(q.target);await click('submit');break;
  default:throw Error('No solver: '+q.kind);
  }
  assert.equal(await page.evaluate(()=>S.results.at(-1)?.ok),true,q.id);
 }
 // Real UI interactions for every question. Setup uses the same demo/retry lifecycle as UI.
 for(const q of data){await load(q);await solve(q);}
 check('all 352 questions solved through controls');
 const kinds=[...new Set(data.map(q=>q.kind))];
 for(const kind of kinds){const q=data.find(q=>q.kind===kind);await load(q);await page.evaluate(()=>{S.limit=.01;S.t=.02;tick(performance.now())});assert.equal(await page.evaluate(()=>S.results.at(-1)?.timeout),true,kind);}
 check('timeouts recorded for all 23 mechanics');
 // Feedback is guarded against double submissions.
 await load(data.find(q=>q.kind==='keypad'));await click('submit');const count=await page.evaluate(()=>S.results.length);await page.evaluate(()=>{extraAct('submit');resolve(true);act('submit')});assert.equal(await page.evaluate(()=>S.results.length),count);check('double-submit guard');
 // Wrong answer persists, correct retry removes it, legacy settings/high score survive.
 await page.evaluate(()=>{saved.best=8765;saved.practiced=true;persist();prefs.missed=['move0'];saveAcademy();home()});await page.reload();assert.equal(await page.evaluate(()=>saved.best),8765);await page.locator('#notebook').click();await page.locator('#retrySaved').click();await old('move:-1');assert.deepEqual(await page.evaluate(()=>prefs.missed),[]);check('v1 migration and persistent retry graduation');
 await page.evaluate(()=>{localStorage.setItem(KEY,'{bad');localStorage.setItem(AKEY,'{"missed":["bad",null,2],"volume":99,"subject":"bad","difficulty":"bad"}')});await page.reload();assert.equal(await page.evaluate(()=>prefs.volume),1);assert.deepEqual(await page.evaluate(()=>prefs.missed),[]);check('corrupt and hostile-shape storage fallback');
 await page.evaluate(()=>{localStorage.setItem(KEY,JSON.stringify({version:1,best:777,practiced:true,sound:false,slow:true,reduce:true}));localStorage.removeItem(AKEY)});await page.reload();
 // Subject/difficulty pools and boss all respect selected course.
 for(const subject of ['mixed',...new Set(data.map(q=>q.subject))])for(const level of ['all','1','2']){
  const ids=await page.evaluate(([subject,level])=>{prefs.subject=subject;prefs.difficulty=level;return pool().map(q=>q.id)},[subject,level]);
  assert(ids.length>0,subject+' '+level+' must contain questions');
  const sampled=await page.evaluate(()=>{start('run');const rows=[S.q];S.total=60;for(let i=0;i<3;i++){next();rows.push(S.q)}next();return {ids:rows.map(q=>q.id),phase:S.phase}});
  assert(sampled.ids.every(id=>ids.includes(id)));assert.equal(sampled.phase,'done');
 }
 check('all nonempty subject/difficulty combinations and 3-stage boss stay in pool');
 await page.evaluate(()=>{prefs.subject='mixed';prefs.difficulty='all';saved.sound=true;saved.reduce=true;prefs.volume=.3;saveAcademy();home()});await page.locator('#start').click();
 await page.waitForTimeout(300);assert.equal(await page.evaluate(()=>PicoAudio.state().playing),true);
 const peaks=[];for(let k=0;k<10;k++){await page.waitForTimeout(35);peaks.push(await page.evaluate(()=>PicoAudio.state().peak));}assert(Math.max(...peaks)>.0001);assert(Math.max(...peaks)<1);check('real Web Audio waveform nonzero and below clipping',Math.max(...peaks));
 await page.locator('#pause').click();assert.equal(await page.evaluate(()=>PicoAudio.state().playing),false);const t=await page.evaluate(()=>S.t);await page.waitForTimeout(100);assert.equal(await page.evaluate(()=>S.t),t);await page.locator('#resume').click();assert.equal(await page.evaluate(()=>PicoAudio.state().playing),true);check('gesture audio startup and pause/resume freeze');
 await page.evaluate(()=>{S.total=60;next()});assert.equal(await page.evaluate(()=>PicoAudio.state().mode),'boss');await page.evaluate(()=>{PicoAudio.duck(true)});assert.equal(await page.evaluate(()=>PicoAudio.state().duck),true);await page.evaluate(()=>{cancelSpeech();PicoAudio.configure(false,.3)});assert.equal(await page.evaluate(()=>PicoAudio.state().playing),false);check('boss BGM, ducking reset, mute stop');
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'))});assert.equal(await page.evaluate(()=>PicoAudio.state().playing),false);assert.equal(await page.evaluate(()=>S.phase),'paused');await page.evaluate(()=>{delete document.hidden;home()});check('background pauses game and audio');
 await page.locator('#start').click();await page.goBack();assert.equal(await page.evaluate(()=>S),null);check('browser Back returns to home and stops round');
 // Responsive screenshots and actual document overflow checks, every mechanic.
 fs.mkdirSync(path.join(root,'verification','screenshots'),{recursive:true});
 for(const viewport of [{width:320,height:568},{width:390,height:844},{width:844,height:390},{width:1280,height:800}]){
  await page.setViewportSize(viewport);await page.evaluate(()=>{saved.sound=false;home()});
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'home overflow '+viewport.width);
  const filename=`home-${viewport.width}x${viewport.height}.png`;await page.screenshot({path:path.join(root,'verification/screenshots',filename),fullPage:true});report.screenshots.push(filename);
  for(const kind of kinds){await load(data.find(q=>q.kind===kind));assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${kind} overflow ${viewport.width}`);}
  for(const kind of ['match','memory','trace','move','clock','keypad']){await load(data.find(q=>q.kind===kind));const name=`${kind}-${viewport.width}x${viewport.height}.png`;await page.screenshot({path:path.join(root,'verification/screenshots',name),fullPage:true});report.screenshots.push(name);}
 }
 check('92 mechanic viewport checks + 28 screenshots, no horizontal overflow');
 await page.evaluate(()=>home());await page.locator('#lab').click();assert.equal(await page.locator('[data-kind-demo]').count(),23);await page.locator('[data-kind-demo="trace"]').click();await page.locator('#pause').click();await page.locator('#backHome').click();assert.equal(await page.evaluate(()=>S),null);check('encyclopedia demo and quit-to-home');
 await load(data.find(q=>q.kind==='keypad'));await page.locator('[data-ex="digit:1"]').focus();await page.keyboard.press('Enter');assert.equal(await page.locator('[data-ex="digit:1"]').evaluate(el=>document.activeElement===el),true);await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>S.phase),'paused');await page.keyboard.press('Shift+Tab');assert.equal(await page.locator('#backHome').evaluate(el=>document.activeElement===el),true);await page.keyboard.press('Tab');assert.equal(await page.locator('#resume').evaluate(el=>document.activeElement===el),true);await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>S.phase),'active');check('keyboard focus retained, Escape and modal Tab loop');
 const noAudio=await browser.newContext();const p2=await noAudio.newPage();await p2.addInitScript(()=>{window.AudioContext=undefined;window.webkitAudioContext=undefined;window.SpeechSynthesisUtterance=undefined;Object.defineProperty(window,'localStorage',{get(){throw Error('blocked')}})});await p2.goto(`http://127.0.0.1:${port}/`);await p2.locator('#start').click();assert.equal(await p2.evaluate(()=>S.phase),'active');await noAudio.close();check('audio/speech unavailable and storage blocked still playable');
 assert.deepEqual(report.errors,[]);check('zero uncaught browser errors');
 report.finished=new Date().toISOString();report.passed=true;
})().catch(e=>{console.error(e);report.failure=e.stack;process.exitCode=1}).finally(async()=>{await browser?.close();server.kill();fs.mkdirSync(path.join(root,'verification'),{recursive:true});fs.writeFileSync(path.join(root,'verification','results.json'),JSON.stringify(report,null,2)+'\n')});
