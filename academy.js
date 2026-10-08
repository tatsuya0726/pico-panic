'use strict';
// Extension layer: retains v1 data, IDs, storage, and all eight original mechanics.
const AKEY='pico-panic-academy-v2';
let prefs={subject:'mixed',difficulty:'all',volume:.4,missed:[],best:{}};
try{const x=JSON.parse(localStorage.getItem(AKEY));if(x&&typeof x==='object'){if(x.subject==='mixed'||Object.hasOwn(SUBJECTS,x.subject))prefs.subject=x.subject;if(['all','1','2'].includes(x.difficulty))prefs.difficulty=x.difficulty;if(Number.isFinite(x.volume))prefs.volume=Math.max(0,Math.min(1,x.volume));if(Array.isArray(x.missed))prefs.missed=[...new Set(x.missed.filter(id=>typeof id==='string'&&DB.some(q=>q.id===id)))].slice(0,500);if(x.best&&typeof x.best==='object')for(const [k,v]of Object.entries(x.best))if(Number.isFinite(v)&&v>=0)prefs.best[k]=Math.min(999999,v);}}catch{}
function saveAcademy(){try{localStorage.setItem(AKEY,JSON.stringify(prefs))}catch{}}
function pool(){return DB.filter(q=>(prefs.subject==='mixed'||q.subject===prefs.subject)&&(prefs.difficulty==='all'||q.level===Number(prefs.difficulty)));}
function sourceLink(q){const s=SOURCES[q.source];return s?`<a href="${s[1]}" target="_blank" rel="noopener">出典：${s[0]}</a>`:'';}
const original={renderArea,act,next,render,resolve,tick,start,finish,pause,speak,cancelSpeech};
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
sound=ok=>PicoAudio.effect(ok?'correct':'wrong');
prime=()=>{PicoAudio.configure(saved.sound,prefs.volume);PicoAudio.init();try{voiceOK=saved.sound&&'speechSynthesis'in window&&typeof SpeechSynthesisUtterance!=='undefined';}catch{voiceOK=false}};
cancelSpeech=()=>{original.cancelSpeech();PicoAudio.duck(false)};
speak=q=>{if(!q.audio||!saved.sound||!voiceOK)return;const seq=++speechSeq;try{const u=new SpeechSynthesisUtterance(q.prompt);u.lang='en-US';u.rate=.85;u.volume=prefs.volume;u.onstart=()=>{if(seq===speechSeq)PicoAudio.duck(true)};u.onend=u.onerror=()=>{if(seq===speechSeq)PicoAudio.duck(false)};PicoAudio.duck(true);speechSynthesis.speak(u);}catch{voiceOK=false;PicoAudio.duck(false)}};
header=()=>`<header class="top"><button class="brand brandlink" id="brandHome" aria-label="ホームに戻る">PICO <em>PANIC</em></button><span class="pill">8教科 / ${Object.keys(names).length}アクション</span></header>`;
function bindBrand(){const b=$('#brandHome');if(b)b.onclick=()=>{if(S&&['active','feedback'].includes(S.phase)){pause();return;}home()};}
home=()=>{
 PicoAudio.stop();cancelAnimationFrame(raf);cancelSpeech();S=null;document.body.classList.remove('playing');document.body.classList.toggle('reduced',saved.reduce);
 const count=pool().length;
 app.innerHTML=header()+`<section class="home"><div class="intro"><div class="eyebrow">ひらめき、次から次へ。</div><h1>PICO<br><span>PANIC!</span></h1><p>ことばも、世界も、数字も。<br>小さなアクションで、知るを遊ぼう。</p><div class="actions"><button class="primary" id="start">${saved.practiced?'60秒チャレンジ':'練習してスタート'}</button><button class="secondary" id="practice">じっくり練習</button></div><p class="fine">60秒 ＋ 3段階ボス / 3ライフ<br>総合ベスト ${saved.best} pt · 選択コース ${prefs.best[prefs.subject+prefs.difficulty]||0} pt</p></div><div class="artwrap"><img class="heroart" src="hero.png" alt="ヘッドホンをつけたピコと雲"></div></section><section class="course"><h2>今日の好奇心は？</h2><div class="subject-grid">${[['mixed',['✦','全部ミックス']],...Object.entries(SUBJECTS)].map(([key,[icon,label]])=>`<button class="subject ${prefs.subject===key?'selected':''}" data-subject="${key}" aria-pressed="${prefs.subject===key}"><b>${icon}</b>${label}<small>${key==='mixed'?DB.length:DB.filter(q=>q.subject===key).length}問</small></button>`).join('')}</div><div class="course-controls"><label>難易度 <select id="difficulty"><option value="all">まぜて挑戦</option><option value="1">きほん</option><option value="2">チャレンジ</option></select></label><span id="poolCount">今回の問題プール：${count}問</span></div>${count?'':'<p role="status">この条件の問題はありません。難易度を変えてください。</p>'}</section><div class="settings"><label><input type="checkbox" id="slow" ${saved.slow?'checked':''}>ゆっくり</label><label><input type="checkbox" id="sound" ${saved.sound?'checked':''}>音声・BGM・効果音</label><label><input type="checkbox" id="reduce" ${saved.reduce?'checked':''}>動きを減らす</label><label>音量 <input id="volume" type="range" min="0" max="100" value="${prefs.volume*100}"></label></div><div class="actions"><button class="secondary" id="notebook">間違いノート (${prefs.missed.length})</button><button class="secondary" id="lab">アクション図鑑</button></div><p class="fine">タップ・キーボード対応。練習は時間制限なし。音声なしでも全文表示。<br>歴史は日本の幕末〜昭和。国旗は実際のSVG。記録はこのブラウザだけに保存。</p>`;
 $('#difficulty').value=prefs.difficulty;$('#difficulty').onchange=e=>{prefs.difficulty=e.target.value;saveAcademy();home()};
 document.querySelectorAll('[data-subject]').forEach(b=>b.onclick=()=>{prefs.subject=b.dataset.subject;saveAcademy();home()});
 for(const k of ['slow','sound','reduce'])$('#'+k).onchange=e=>{saved[k]=e.target.checked;persist();document.body.classList.toggle('reduced',saved.reduce);PicoAudio.configure(saved.sound,prefs.volume);if(!saved.sound)cancelSpeech()};
 $('#volume').oninput=e=>{prefs.volume=Number(e.target.value)/100;saveAcademy();PicoAudio.configure(saved.sound,prefs.volume)};
 $('#start').disabled=$('#practice').disabled=!count;
 $('#start').onclick=()=>{prime();start(saved.practiced?'run':'intro')};$('#practice').onclick=()=>{prime();start('practice')};$('#notebook').onclick=notebook;$('#lab').onclick=lab;bindBrand();
};
function notebook(){PicoAudio.stop();app.innerHTML=header()+`<h1 class="page-title">間違いノート</h1><p>正解するとノートから卒業。教科選択に関係なく、保存した問題を復習します。</p><div class="actions"><button id="retrySaved" class="primary" ${prefs.missed.length?'':'disabled'}>全部やり直す (${prefs.missed.length})</button><button id="home" class="secondary">ホーム</button></div><div class="review">${prefs.missed.map(id=>DB.find(q=>q.id===id)).filter(Boolean).map(q=>`<article><small>${SUBJECTS[q.subject][1]} / ${names[q.kind][2]}</small><strong>${q.prompt}</strong>${q.visual||''}<p>正解：${q.answer}</p><p>${q.why}</p>${sourceLink(q)}</article>`).join('')||'<p>まだ間違いはありません。</p>'}</div>`;$('#retrySaved').onclick=()=>{prime();start('retry',[...prefs.missed])};$('#home').onclick=home;bindBrand()}
function lab(){app.innerHTML=header()+`<h1 class="page-title">アクション図鑑</h1><p>実際の問題で操作を練習できます。教科・難易度の選択に関係なく、各操作を1問ずつ試せます。</p><button id="home" class="secondary">ホーム</button><div class="tiles">${Object.entries(names).map(([k,n])=>`<button class="tile" data-kind-demo="${k}"><b>${n[0]}</b>${n[2]}<small>${DB.filter(q=>q.kind===k).length}問</small></button>`).join('')}</div>`;$('#home').onclick=home;document.querySelectorAll('[data-kind-demo]').forEach(b=>b.onclick=()=>{prime();start('demo',[DB.find(q=>q.kind===b.dataset.kindDemo).id])});bindBrand()}
start=(mode,ids)=>{original.start(mode,ids);if(S?.phase==='active')PicoAudio.play('normal')};
selectQ=()=>{
 if(S.mode==='retry'||S.mode==='demo')return S.pool.shift();
 const choices=pool();if(!choices.length)return null;
 if(['practice','intro'].includes(S.mode)){if(S.round>=3)return null;return shuffle(choices.filter(q=>!S.results.some(r=>r.id===q.id)))[0]||choices[0]}
 if(S.total>=60&&!S.boss){S.boss=true;S.bossStep=0;PicoAudio.effect('boss');PicoAudio.play('boss')}
 if(S.boss){if(S.bossStep>=3)return null;S.bossStep++;return shuffle(choices.filter(q=>q.id!==S.q?.id))[0]||choices[0]}
 if(!S.deck.length){const recent=S.results.slice(-20).map(q=>q.id);const kinds=shuffle([...new Set(choices.map(q=>q.kind))]);if(kinds.length>1&&kinds[0]===S.q?.kind)[kinds[0],kinds[1]]=[kinds[1],kinds[0]];S.deck=kinds.map(k=>{const rows=choices.filter(q=>q.kind===k);return shuffle(rows.filter(q=>!recent.includes(q.id)))[0]||shuffle(rows)[0]})}return S.deck.shift();
};
practiceMode=()=>S&&['intro','practice','demo'].includes(S.mode);
next=()=>{original.next();if(!S||S.phase!=='active')return;if(practiceMode())S.limit=Infinity;else if(S.mode==='retry')S.limit=Infinity;else if(EXTRA_NAMES[S.q.kind])S.limit=Math.max(S.limit,S.q.kind==='memory'?20:['match','trace','type','echo'].includes(S.q.kind)?16:12)+(saved.slow?6:0);render();};
render=()=>{original.render();const q=S.q;if(S.mode==='demo')$('.hud .pill').textContent='PRACTICE';const h=$('.stagehead span');if(h)h.textContent=`${SUBJECTS[q.subject][1]} · ${names[q.kind][2]}`;if(q.visual)$('.prompt').insertAdjacentHTML('afterend',`<div class="visual">${q.visual}</div>`);const speech=$('#speechnote');if(speech&&q.subject!=='english')speech.remove();const bottom=$('.bottom p');if(bottom&&S.mode==='demo')bottom.textContent='図鑑の操作練習：時間制限なし';if(bottom&&S.mode==='retry')bottom.textContent='間違いを復習：時間制限なし';bindBrand();};
function exButton(label,action,selected=false){return `<button class="object${selected?' selected':''}" data-ex="${action}" ${selected?'aria-pressed="true"':''}>${label}</button>`}
function initInput(q,i){if(i.ready)return;i.ready=true;Object.assign(i,{value:q.min||0,text:'',weights:[],marked:[],card:0,left:null,matched:[],flipped:[],memoryDone:[],steps:[],shown:true,route:[0],rotation:0,first:null,removed:[],cursor:0});if(q.kind==='match')i.right=shuffle(q.pairs.map((_,k)=>k));if(q.kind==='memory')i.memory=shuffle(q.pairs.flatMap((p,k)=>p.map(label=>({label,pair:k}))));if(q.kind==='echo')i.echoOptions=shuffle([...new Set(q.sequence)]);if(q.kind==='swap'){i.letters=[...q.target];[i.letters[0],i.letters[i.letters.length-1]]=[i.letters[i.letters.length-1],i.letters[0]];}}
renderArea=()=>{
 const focus=document.activeElement?.dataset;const focused=focus?.ex?['ex',focus.ex]:focus?.act?['act',focus.act]:null;const restore=()=>{if(focused){const b=document.querySelector('[data-'+focused[0]+'="'+focused[1]+'"]');if(b&&!b.disabled)b.focus({preventScroll:true});}};const q=S.q,i=S.input;if(!EXTRA_NAMES[q.kind]){original.renderArea();restore();return;}initInput(q,i);let h='';const done=exButton('決定','submit');
 switch(q.kind){
 case'line':h=`<output class="readout" id="lineValue">${i.value}</output><label class="slider-label">${q.min} <input id="numberLine" type="range" min="${q.min}" max="${q.max}" value="${i.value}" aria-label="数直線"> ${q.max}</label>${done}`;break;
 case'keypad':h=`<output class="readout" aria-live="polite">${i.text||'？'}</output><div class="keypad">${[1,2,3,4,5,6,7,8,9,'⌫',0].map(v=>exButton(v,'digit:'+v)).join('')}${done}</div>`;break;
 case'balance':h=`<div class="scale"><div>${q.target} g</div><span>⚖</span><div>${i.weights.reduce((s,n)=>s+n,0)} g</div></div><div class="tray">${i.weights.map((w,k)=>exButton(w+'g','unweight:'+k)).join('')||'分銅をここへ'}</div><div class="options">${q.weights.map(w=>exButton('＋'+w+'g','weight:'+w)).join('')}</div>${done}`;break;
 case'paint':h=`<div class="paint-grid">${Array.from({length:q.den},(_,k)=>exButton(i.marked.includes(k)?'■':'□','mark:'+k,i.marked.includes(k))).join('')}</div><output>${i.marked.length} / ${q.den} マス</output>${done}`;break;
 case'timing':h=`<div class="timing-lane"><output class="readout" id="ticker" aria-live="off">${q.values[i.cursor]}</output></div>${saved.reduce?exButton('次の数字','advance'):''}${exButton('ストップ！','stop')}<span class="fine">${saved.reduce?'手動モード':'数字はくり返します。'}</span>`;break;
 case'sort':h=`<div class="sort-card">${q.cards[i.card]?.label||'完了'}</div><span>${i.card} / ${q.cards.length} 枚</span><div class="options">${q.bins.map((b,k)=>exButton(b,'bin:'+k)).join('')}</div>`;break;
 case'match':h=`<div class="pair-columns"><div>${q.pairs.map((p,k)=>`<button class="object ${i.left===k?'selected':''}" data-ex="left:${k}" ${i.matched.includes(k)?'disabled':''}>${i.matched.includes(k)?'✓ ':''}${p[0]}</button>`).join('')}</div><div>${i.right.map(k=>`<button class="object" data-ex="right:${k}" ${i.matched.includes(k)?'disabled':''}>${i.matched.includes(k)?'✓ ':''}${q.pairs[k][1]}</button>`).join('')}</div></div>`;break;
 case'search':h=`<div class="search-grid">${q.tiles.map((t,k)=>exButton(t,'mark:'+k,i.marked.includes(k))).join('')}</div>${done}`;break;
 case'memory':h=`<div class="memory-grid">${i.memory.map((c,k)=>`<button class="object" data-ex="flip:${k}" aria-label="カード${k+1}${i.flipped.includes(k)||i.memoryDone.includes(k)?'：'+c.label.replace(/<[^>]+>/g,''):''}" ${i.memoryDone.includes(k)?'disabled':''}>${i.flipped.includes(k)||i.memoryDone.includes(k)?c.label:'？'}</button>`).join('')}</div>${i.flipped.length===2?exButton('もう一度めくる','unflip'):''}`;break;
 case'echo':h=i.shown?`<div class="sequence">${q.sequence.map((v,k)=>`<span>${k+1}. ${v}</span>`).join('')}</div>${exButton('覚えた！','hide')}`:`<p>入力 ${i.steps.length} / ${q.sequence.length}</p><div class="options">${i.echoOptions.map((v,k)=>exButton(v,'echo:'+k)).join('')}</div>${exButton('見本を見る（最初から）','show')}`;break;
 case'trace':h=`<div class="trace-grid">${q.tiles.map((t,k)=>exButton(`${k===0?'START<br>':k===8?'GOAL<br>':''}${t}${i.route.includes(k)?' ●':''}`,'route:'+k,i.route.includes(k))).join('')}</div>${exButton('1つ戻る','undoRoute')}`;break;
 case'rotate':h=`<div class="rotate-arrow" style="transform:rotate(${i.rotation*90}deg)" aria-label="時計回り${i.rotation*90}度">↑</div><output>${i.rotation*90}度</output><div class="options">${exButton('↶ 左90°','rotate:-1')}${exButton('右90° ↷','rotate:1')}</div>${done}`;break;
 case'swap':h=`<div class="options">${i.letters.map((l,k)=>exButton(l,'swap:'+k,i.first===k)).join('')}</div>${done}`;break;
 case'erase':h=`<div class="options">${q.tokens.map((t,k)=>exButton(i.removed.includes(k)?`<s>${t}</s>`:t,'erase:'+k,i.removed.includes(k))).join('')}</div>${done}`;break;
 case'type':h=`<label class="type-label">読み <input id="reading" type="text" autocomplete="off" maxlength="30" value="${esc(i.text)}" aria-label="ひらがなの読み"></label>${done}`;break;
 }
 $('#area').innerHTML=h;const generation=S.generation;document.querySelectorAll('[data-ex]').forEach(b=>b.onclick=()=>{if(S?.phase==='active'&&S.generation===generation)extraAct(b.dataset.ex)});
 restore();if($('#numberLine'))$('#numberLine').oninput=e=>{i.value=Number(e.target.value);$('#lineValue').textContent=i.value};
 if($('#reading')){$('#reading').oninput=e=>{i.text=e.target.value};$('#reading').onkeydown=e=>{if(e.key==='Enter'&&!e.isComposing)extraAct('submit')}};
};
function extraAct(a){if(!S||S.phase!=='active')return;if(S.t>S.limit){resolve(false,true);return;}const q=S.q,i=S.input,[w,value]=a.split(':'),v=Number(value);PicoAudio.effect('tap');
 if(w==='digit')i.text=value==='⌫'?i.text.slice(0,-1):(i.text+value).slice(0,6);
 if(w==='weight'&&i.weights.length<20)i.weights.push(v);if(w==='unweight')i.weights.splice(v,1);
 if(w==='mark')i.marked=i.marked.includes(v)?i.marked.filter(k=>k!==v):[...i.marked,v];
 if(w==='advance')i.cursor=(i.cursor+1)%q.values.length;
 if(w==='stop'){resolve(q.values[i.cursor]===q.target);return;}
 if(w==='bin'){if(q.cards[i.card].bin!==v){resolve(false);return;}i.card++;if(i.card===q.cards.length){resolve(true);return;}}
 if(w==='left')i.left=v;
 if(w==='right'&&i.left!==null){if(i.left!==v){resolve(false);return;}i.matched.push(v);i.left=null;if(i.matched.length===q.pairs.length){resolve(true);return;}}
 if(w==='flip'&&i.flipped.length<2&&!i.flipped.includes(v)&&!i.memoryDone.includes(v)){i.flipped.push(v);if(i.flipped.length===2&&i.memory[i.flipped[0]].pair===i.memory[i.flipped[1]].pair){i.memoryDone.push(...i.flipped);i.flipped=[];if(i.memoryDone.length===i.memory.length){renderArea();resolve(true);return;}}}
 if(w==='unflip')i.flipped=[];
 if(w==='hide')i.shown=false;if(w==='show'){i.shown=true;i.steps=[];}
 if(w==='echo'){const label=i.echoOptions[v];if(label!==q.sequence[i.steps.length]){resolve(false);return;}i.steps.push(label);if(i.steps.length===q.sequence.length){resolve(true);return;}}
 if(w==='route'){const last=i.route.at(-1);if(v===last)return;if(Math.abs(v%3-last%3)+Math.abs(Math.floor(v/3)-Math.floor(last/3))!==1)return;if(q.tiles[v]%2){resolve(false);return;}if(!i.route.includes(v))i.route.push(v);if(v===8){resolve(true);return;}}
 if(w==='undoRoute'&&i.route.length>1)i.route.pop();if(w==='rotate')i.rotation=(i.rotation+v+4)%4;
 if(w==='swap'){if(i.first===null)i.first=v;else{[i.letters[i.first],i.letters[v]]=[i.letters[v],i.letters[i.first]];i.first=null;}}
 if(w==='erase')i.removed=i.removed.includes(v)?i.removed.filter(k=>k!==v):[...i.removed,v];
 if(w==='submit'){const ok={line:()=>i.value===q.target,keypad:()=>i.text!==''&&Number(i.text)===q.target,balance:()=>i.weights.reduce((s,n)=>s+n,0)===q.target,paint:()=>i.marked.length===q.num,search:()=>q.tiles.every((t,k)=>(t===q.target)===i.marked.includes(k)),rotate:()=>i.rotation===q.target,swap:()=>i.letters.join('')===q.target.join(''),erase:()=>q.tokens.filter((_,k)=>!i.removed.includes(k)).join('')===q.target,type:()=>i.text.normalize('NFKC').trim()===q.target}[q.kind];resolve(!!ok?.());return;}
 renderArea();
}
act=a=>{if(S?.phase==='active')PicoAudio.effect('tap');original.act(a)};
tick=now=>{if(S?.phase==='active'&&S.q.kind==='timing'&&!saved.reduce){const i=S.input,q=S.q;i.cursor=Math.floor(S.t/(saved.slow?.95:.7))%q.values.length;const t=$('#ticker');if(t)t.textContent=q.values[i.cursor];}original.tick(now)};
resolve=(ok,timeout=false)=>{if(!S||S.phase!=='active')return;const id=S.q.id;if(ok)prefs.missed=prefs.missed.filter(k=>k!==id);else if(!prefs.missed.includes(id))prefs.missed.push(id);saveAcademy();original.resolve(ok,timeout);if(S.mode==='demo'&&!ok)S.life=3;};
pause=()=>{if(!S||!['active','feedback'].includes(S.phase))return;PicoAudio.stop();original.pause();const modal=$('.modal');modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');modal.setAttribute('aria-label','一時停止');modal.insertAdjacentHTML('beforeend','<div class="actions"><button id="mutePause" class="secondary">音のON/OFF</button><button id="backHome" class="secondary">ホームへ</button></div>');$('#mutePause').onclick=()=>{saved.sound=!saved.sound;persist();PicoAudio.configure(saved.sound,prefs.volume);$('#mutePause').textContent=saved.sound?'音：ON':'音：OFF'};$('#backHome').onclick=home;$('#resume').onclick=()=>{const el=$('.overlay');el?.remove();S.phase=S.beforePause;S.last=performance.now();prime();PicoAudio.play(S.boss?'boss':'normal');if(S.phase==='active')speak(S.q)};$('#resume').focus()};
finish=()=>{if(!S)return;PicoAudio.stop();const mode=S.mode,results=S.results;if(mode==='run'){const key=prefs.subject+prefs.difficulty;prefs.best[key]=Math.max(prefs.best[key]||0,S.score);saveAcademy();}if(mode==='demo')S.mode='practice';original.finish();if(mode==='demo')saved.practiced=true;document.querySelectorAll('.review article').forEach((el,k)=>{if(results[k])el.insertAdjacentHTML('beforeend',(results[k].visual||'')+sourceLink(results[k]))});bindBrand();if(S.life>0&&results.length)PicoAudio.effect('win')};
document.addEventListener('visibilitychange',()=>{if(document.hidden){PicoAudio.suspend();cancelSpeech()}});
addEventListener('pagehide',()=>{PicoAudio.suspend();cancelSpeech()});
addEventListener('popstate',()=>{home()});
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'&&S){if(S.phase==='paused')$('#resume')?.click();else pause();return;}
 if(e.key==='Tab'&&S?.phase==='paused'){const buttons=[...document.querySelectorAll('.modal button')];const first=buttons[0],last=buttons.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}
});
// One history entry allows browser Back to leave a running round safely.
const begin=start;start=(mode,ids)=>{if(!history.state?.picoRound)history.pushState({picoRound:true},'');begin(mode,ids)};
home();
