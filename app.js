/* ---------- demo data ---------- */
/* Demo accounts. Password for all: demo123. Everything here is fictional. */
const ACCOUNTS={
  '249900001':{role:'student',full:'Kamshat',name:'Kamshat',ini:'K',color:'#a63a82',major:'Information Systems',year:3,advisor:'Advisor Daniyar T.',
    tuition:1250000,paid:800000,due:'2026-11-05',hold:'library',sch:'none',
    courses:[{c:"INF 401 Software Engineering",p:null,ok:true},{c:"INF 415 Information Security",p:"INF 320 Computer Networks",ok:false},{c:"MGT 301 Project Management",p:null,ok:true}]},
  '249900002':{role:'student',full:'Imangali',name:'Imangali',ini:'I',color:'#2f6fd0',major:'Information Systems',year:3,advisor:'Advisor Aigerim N.',
    grant:true,tuition:0,paid:0,due:null,hold:null,sch:'none',
    courses:[{c:"INF 330 Information Systems Analysis",p:null,ok:true},{c:"INF 340 Data Mining",p:"MAT 301 Statistics",ok:false},{c:"INF 350 Web Technologies",p:null,ok:true}]},
  '249900003':{role:'student',full:'Kenan',name:'Kenan',ini:'K',color:'#c2570c',major:'Information Systems',year:3,advisor:'Advisor Aigerim N.',
    tuition:1250000,paid:1250000,due:'2026-11-01',hold:null,sch:'active',
    courses:[{c:"INF 401 Software Engineering",p:null,ok:true},{c:"INF 360 Cloud Computing",p:"INF 320 Computer Networks",ok:true},{c:"INF 370 Enterprise Systems",p:"INF 330 Information Systems Analysis",ok:false}]},
  '249900004':{role:'student',full:'Zhanibek',name:'Zhanibek',ini:'Z',color:'#167a50',major:'Information Systems',year:3,advisor:'Advisor Daniyar T.',
    tuition:1250000,paid:900000,due:'2026-11-12',hold:null,sch:'review',
    courses:[{c:"INF 380 Machine Learning",p:"MAT 301 Statistics",ok:false},{c:"INF 390 Mobile Development",p:null,ok:true},{c:"MGT 301 Project Management",p:null,ok:true}]},
  staff:{role:'staff',full:'Help Desk Staff',name:'Help Desk Staff',ini:'HS',color:'#3b4a5f'}
};
Object.entries(ACCOUNTS).forEach(([k,a])=>{a.login=k;a.id=k;a.first=a.name.split('.')[0]});
const HOLD_INFO={library:['Library','Overdue book blocks registration'],finance:['Finance','Unpaid tuition blocks registration']};
const OFFICES=["Registrar","IT Support","Finance","Student Affairs"];


/* ---------- state ---------- */
let U=null;                 /* logged-in account */
const PASS='demo123';
const STATUS=['Open','In progress','Resolved'];
const HR=3600e3;
/* tickets from other students, so the staff queue is not empty on first launch */
const seedTickets=()=>{const n=Date.now();return[
  {n:10226,uid:'249900004',who:'Zhanibek',office:'Registrar',desc:'I need an enrollment certificate for the military office.',status:'Open',at:n-2*HR,priority:'medium',replies:[]},
  {n:10227,uid:'249900001',who:'Kamshat',office:'IT Support',desc:'Wi-Fi in dormitory block B drops every few minutes.',status:'In progress',at:n-26*HR,priority:'high',replies:[{text:'We passed this to the network team. Please tell us your room number.',at:n-20*HR}]},
  {n:10228,uid:'249900003',who:'Kenan',office:'Finance',desc:'My payment of 200 000 ₸ is not shown in the billing account.',status:'Open',at:n-30*HR,priority:'high',replies:[]},
  {n:10229,uid:'249900002',who:'Imangali',office:'Student Affairs',desc:'How do I apply for a dormitory place for spring 2027?',status:'Resolved',at:n-72*HR,priority:'low',replies:[{text:'Applications open on 01.12.2026 in Student Portal → Dormitory.',at:n-70*HR}]},
  {n:10230,uid:'249900005',who:'Dana',office:'Registrar',desc:'My name is spelled incorrectly in the transcript.',status:'Open',at:n-19*HR,priority:'medium',replies:[]},
  {n:10231,uid:'249900006',who:'Timur',office:'IT Support',desc:'Cannot log in to the Student Portal after a password reset.',status:'Open',at:n-HR,priority:'high',replies:[]},
  {n:10224,uid:'249900005',who:'Dana',office:'Registrar',desc:'I need a copy of my transcript.',status:'Resolved',at:n-120*HR,priority:'low',replies:[{text:'The transcript was sent to your university email.',at:n-118*HR}],rating:{stars:5,comment:'Fast and clear, thank you!',at:n-117*HR}},
  {n:10225,uid:'249900006',who:'Timur',office:'IT Support',desc:'My portal account was locked.',status:'Resolved',at:n-96*HR,priority:'medium',replies:[{text:'The account is unlocked. Please log in again.',at:n-90*HR}],rating:{stars:4,comment:'Solved, but I waited a day.',at:n-88*HR}}
]};
const seedAnn=()=>[{id:1,text:'Registration for Spring 2027 opens on 16.11.2026. Clear all holds before that date.',level:'info',active:true,at:Date.now()-6*HR}];
/* demo history for Analytics: questions asked and Helpful / Not helpful ratings. Real activity is added on top. */
const seedEvents=()=>{const n=Date.now(),ev=[];let k=0;
  Object.entries({reg:9,bill:7,pw:6,adv:5,wifi:4,adddrop:3,hours:2,fb:2}).forEach(([i,c])=>{for(let j=0;j<c;j++)ev.push({k:'q',i,at:n-(k++)*5*HR})});
  for(let j=0;j<18;j++)ev.push({k:'fb',v:j%5!==0,at:n-j*3*HR});
  return ev};
const fresh=()=>({v:4,tickets:seedTickets(),appts:[],chats:{},events:seedEvents(),notes:[],ann:seedAnn(),dismiss:{}});
const loadSt=s=>{s.chats=s.chats||{};s.notes=s.notes||[];s.events=s.events||seedEvents();s.ann=s.ann||seedAnn();s.dismiss=s.dismiss||{};return s};
let st=fresh();
try{const s=JSON.parse(localStorage.getItem('hd-state')||'null');if(s&&s.v===4&&s.tickets)st=loadSt(s)}catch(e){}
function note(uid,type,o){st.notes.push(Object.assign({uid,type,at:Date.now(),read:false},o))}
function logQ(i){st.events.push({k:'q',i,at:Date.now(),uid:U&&U.login});save()}
function fbEvent(f,up){if(!f._ev){f._ev={k:'fb',v:up,at:Date.now(),uid:U&&U.login};st.events.push(f._ev)}else f._ev.v=up;save()}
const isMine=t=>t.uid===U.login;
/* chat history is kept per student ID (rendered rows only, without buttons) */
function rec(c,h){if(!U||U.role!=='student')return;
  const a=(st.chats=st.chats||{});(a[U.login]=a[U.login]||[]).push({c,h});if(a[U.login].length>60)a[U.login].shift();save()}
function loadChat(){const log=$('log'),h=(st.chats&&st.chats[U.login])||[];log.innerHTML='';
  if(!h.length)return boot();
  h.forEach(m=>{const d=document.createElement('div');d.className=m.c;d.innerHTML=m.h;log.appendChild(d)});scroll()}
const myAppts=()=>st.appts.filter(a=>a.who===U.login);
const money=n=>String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' ')+' ₸';
const dmy=iso=>iso.split('-').reverse().join('.');
const avatar=n=>{const a=Object.values(ACCOUNTS).find(x=>x.name===n);
  return '<span class="av sm" style="background:'+(a?a.color:'#5a6a80')+';color:#fff">'+esc(a?a.ini:n.split(/[ .]/).map(s=>s[0]).join('').slice(0,2).toUpperCase())+'</span>'};
const save=()=>{try{localStorage.setItem('hd-state',JSON.stringify(st))}catch(e){}};
let mode=null, lastLang='en', pendingDesc='';

/* ---------- helpers ---------- */
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function detect(t){
  if(/[әғқңөұүһі]/i.test(t)) return 'kk';
  if(/[а-яё]/i.test(t)) return 'ru';
  return /[a-z]/i.test(t)?'en':lastLang;
}
function slots(L){
  const out=[], d=new Date(); d.setHours(0,0,0,0);
  while(out.length<4){d.setDate(d.getDate()+1);const w=d.getDay();
    if(w===2||w===4){for(const [h,m] of [[10,30],[14,0]]){const x=new Date(d);x.setHours(h,m);out.push(x)}}}
  return out.slice(0,4);
}
const fmt=(d,L)=>new Date(d).toLocaleString(T[L].loc,{weekday:'short',day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'});

function scroll(){const l=$('log');l.scrollTop=l.scrollHeight}
function userMsg(t){
  const r=document.createElement('div');r.className='row me';
  r.innerHTML='<div class="av" style="background:'+U.color+';color:#fff">'+U.ini+'</div><div class="bub">'+esc(t)+'</div>';rec(r.className,r.innerHTML);put(r);
}
function sys(t){const d=document.createElement('div');d.className='sys';d.textContent=t;rec('sys',esc(t));put(d)}
/* append to the chat; an active "typing" row always stays last */
function put(el){const l=$('log');l.appendChild(el);const ty=l.querySelector('.typing');if(ty&&ty!==el)l.appendChild(ty);scroll()}
/* bot replies are queued: "Help Desk is typing…" for 0.6–1.2 s, then the message. chatEpoch drops replies after a login change or reset. */
let chatEpoch=0,botChain=Promise.resolve();
function bot(o,L){const e=chatEpoch;
  botChain=botChain.then(()=>new Promise(res=>{
    if(e!==chatEpoch)return res();
    const ty=document.createElement('div');ty.className='row typing';
    ty.innerHTML='<div class="av">HD</div><div class="bub"><span class="dots"><i></i><i></i><i></i></span><span class="tl">'+esc(tr('typing'))+'</span></div>';put(ty);
    setTimeout(()=>{ty.remove();if(e===chatEpoch)botNow(o,L);res()},600+Math.random()*600)}))}
/* bot({title,text,list,ol,src,acts:[[label,fn]],fb:true,staff}) */
function botNow(o,L){
  const r=document.createElement('div');r.className='row'+(o.staff?' staff':'');
  let h='';
  if(o.title)h+='<b class="t">'+esc(o.title)+'</b>';
  if(o.text)h+=esc(o.text);
  if(o.html)h+=o.html;
  if(o.list)h+='<ul>'+o.list.map(x=>'<li'+(x.cls?' class="'+x.cls+'"':'')+'>'+esc(x.t??x)+'</li>').join('')+'</ul>';
  if(o.ol)h+='<ol>'+o.ol.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ol>';
  if(o.after)h+='<div style="margin-top:6px">'+esc(o.after)+'</div>';
  if(o.src)h+='<span class="src" data-l="'+(T[L].srcL||'Source')+'">'+esc(o.src)+'</span>';
  r.innerHTML='<div class="av">'+(o.staff?'ST':'HD')+'</div><div class="bub">'+h+'</div>';
  rec(r.className,r.innerHTML);
  const bub=r.querySelector('.bub');
  if(o.acts){const a=document.createElement('div');a.className='acts';
    o.acts.forEach(([lab,fn])=>{const b=document.createElement('button');b.textContent=lab;
      b.onclick=()=>{a.querySelectorAll('button').forEach(x=>x.disabled=true);fn(lab)};a.appendChild(b)});bub.appendChild(a)}
  if(o.fb){const f=document.createElement('div');f.className='fb';
    [T[L].helpful,T[L].notHelpful].forEach((lab,i)=>{const b=document.createElement('button');b.textContent=lab;b.setAttribute('aria-pressed','false');
      b.onclick=()=>{f.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');fbEvent(f,i===0);
        if(i===1){bot({text:fill(T[L].fb,{c:SSC}),acts:[[T[L].mkT,()=>startTicket(L)],[T[L].talk,()=>human(L)]]},L)}};
      f.appendChild(b)});bub.appendChild(f)}
  put(r);
}
const later=(fn,ms=380)=>setTimeout(fn,ms);

/* ---------- intents ---------- */
/* Keyword patterns per intent in English, Kazakh and Russian. They only classify the question; displayed text lives in i18n.js. */
const I=[
 ['human',/\b(human|staff|person|operator|agent|live)\b|оператор|человек|сотрудник|қызметкер|адаммен|адам/i],
 ['ticket',/ticket|заявк|өтінім/i],
 ['pw',/password|пароль|құпиясөз|құпия сөз/i],
 ['wifi',/wi-?fi|wireless|вай-?фай|интернет|ғаламтор/i],
 ['portal',/portal|log ?in|can'?t log|портал|войти|не могу зайти|кіре алмай/i],
 ['bill',/grant|грант|balance|tuition|pay|fee|bill|owe|financial|aid|scholarship|баланс|оплат|долг|стипенд|плат|деньг|төлем|ақы|қарыз|шәкіртақы/i],
 ['adv',/advis|appointment|meeting|эдвайзер|советник|консульт|встреч|кеңесші|кездесу/i],
 ['reg',/regist|enrol|prereq|курс|тіркел|регистр|пререквиз|пән/i],
 ['adddrop',/add.?drop|drop a course|add a course|deadline|дедлайн|соңғы мерзім/i],
 ['sched',/schedule|timetable|расписан|кесте/i],
 ['offices',/which office|who (can|should)|contact|в какой отдел|к кому|қай бөлім|кімге хабарлас/i],
 ['hours',/hours|open|office|часы|работает|офис|жұмыс уақыты|кеңсе/i],
 ['greet',/^(hi|hello|hey|привет|здравств|сәлем|салем)/i]
];
function answer(t){
  const L=detect(t); lastLang=L; const S=T[L];
  if(mode==='desc'){pendingDesc=t;mode=null;return later(()=>askOffice(L))}
  const hit=(I.find(([,re])=>re.test(t))||['fb'])[0];logQ(hit);
  later(()=>H[hit](L));
}
const H={
 greet:L=>bot({text:T[L].greet},L),
 reg:L=>{const S=T[L],h=U.hold&&S.holds[U.hold];bot({title:S.regT,text:h?h[0]:S.noHold,
   list:U.courses.map(x=>({t:fill(x.ok?S.cOk:S.cNo,{c:x.c,p:x.p}),cls:x.ok?'yes':'no'})),
   after:S.win+(h?' '+h[1]:''),src:S.S.reg,fb:true},L)},
 bill:L=>{const S=T[L],b=U.tuition-U.paid;
   if(U.grant)return bot({text:fill(S.grant,{c:SSC}),list:S.grantL,src:S.S.bill,fb:true},L);
   bot({text:b?fill(S.bill,{b:money(b),d:dmy(U.due)}):S.billPaid,
     list:S.billL.map(x=>fill(x,{t:money(U.tuition),p:money(U.paid)})).concat(S.sch[U.sch]),src:S.S.bill,fb:true},L)},
 adv:L=>{const S=T[L],ap=myAppts();
   if(ap.length){return bot({text:fill(S.hasAppt,{s:fmt(ap[0].at,L)}),src:S.S.adv,fb:true},L)}
   bot({text:fill(S.adv,{a:U.advisor}),src:S.S.adv,acts:slots(L).map(d=>[fmt(d,L),()=>book(d,L)])},L)},
 pw:L=>it(L,'pw'),wifi:L=>it(L,'wifi'),portal:L=>it(L,'portal'),
 ticket:L=>startTicket(L),
 human:L=>human(L),
 adddrop:L=>bot({text:T[L].adddrop,src:T[L].S.cal,fb:true},L),
 sched:L=>bot({text:T[L].sched,src:T[L].S.portal,fb:true},L),
 hours:L=>bot({text:T[L].hours,src:T[L].S.ssc,fb:true},L),
 offices:L=>{const f=FAQ.find(x=>x.id==='offices');bot({text:f.a(L),src:T[L].S[f.src],fb:true},L)},
 fb:L=>bot({text:fill(T[L].fb,{c:SSC}),acts:[[T[L].mkT,()=>startTicket(L)],[T[L].talk,()=>human(L)]]},L)
};
function it(L,k){const S=T[L];
  bot({ol:S[k],src:S.S.it},L);
  later(()=>bot({text:S.helped,acts:[[S.yes,()=>bot({text:S.yesR},L)],[S.no,()=>bot({text:S.noR,acts:[[S.mkT,()=>startTicket(L,'IT Support')],[S.talk,()=>human(L)]]},L)]]},L),250);
}
let presetOffice=null;
function startTicket(L,office){presetOffice=office||null;mode='desc';bot({text:T[L].tAsk},L);$('q').focus()}
function askOffice(L){
  if(presetOffice) return makeTicket(presetOffice,L);
  bot({text:T[L].tOff,acts:OFFICES.map(o=>[o,()=>makeTicket(o,L)])},L);
}
function makeTicket(o,L){
  const n=Math.max(10225,...st.tickets.map(t=>t.n))+1;
  st.tickets.unshift({n,uid:U.login,who:U.name,office:o,desc:pendingDesc||'—',status:'Open',at:Date.now(),priority:'medium',replies:[]});save();sync();
  bot({text:fill(T[L].tDone,{n,o}),acts:[['My tickets →',()=>show('tickets')]]},L);
}
function book(d,L){
  st.appts=st.appts.filter(a=>a.who!==U.login).concat({who:U.login,at:d.getTime(),with:U.advisor});note(U.login,'appt',{at:d.getTime()});save();sync();
  bot({text:fill(T[L].booked,{s:fmt(d,L),a:U.advisor}),src:T[L].S.adv},L);
}
function human(L){
  bot({text:T[L].queue},L);
  setTimeout(()=>{sys(T[L].joined);bot({text:T[L].staff,staff:true},L)},2200);
}

