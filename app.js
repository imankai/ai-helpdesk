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
/* visitor without an account: general questions only, nothing personal is stored (US14) */
const GUEST={role:'guest',login:'guest',id:null,ini:'?',color:'#5a6a80'};
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
  Object.entries({reg:9,bill:7,pw:6,adv:5,wifi:4,adddrop:3,hours:2}).forEach(([i,c])=>{for(let j=0;j<c;j++)ev.push({k:'q',i,at:n-(k++)*5*HR})});
  /* questions the bot could not answer keep their text for the "Unanswered & not helpful" list */
  ['Is there a summer school this year?','Can I pay tuition in installments?','Is there a summer school this year?','How do I get a student ID card?']
    .forEach((t,j)=>ev.push({k:'q',i:'fb',t,at:n-(4+j*40)*HR}));
  [6,30,80,200,400].forEach(h=>ev.push({k:'esc',at:n-h*HR}));   /* "Talk to staff" escalations */
  for(let j=0;j<18;j++)if(j%5)ev.push({k:'fb',v:true,at:n-j*3*HR});
  return ev.concat(seedReview())};
/* "Not helpful" ratings with question, answer and comment, so the staff Review queue is not empty on first launch */
const seedReview=()=>{const n=Date.now();return[
  {k:'fb',v:false,at:n-3*HR,role:'guest',uid:null,q:'Where is the library?',a:'The campus map does not include services such as the library, canteen, gym or registrar yet. Please ask at the information desk.',c:'Please add the library to the map.'},
  {k:'fb',v:false,at:n-15*HR,role:'student',uid:'249900003',q:'Can I pay tuition in installments?',a:"I'm not sure about that, so I won't guess. Contact the Student Service Center.",c:'No answer about installments.'},
  {k:'fb',v:false,at:n-30*HR,role:'student',uid:'249900001',q:'How do I reset my password?',a:'Open the Student Portal login page and choose “Forgot password”.',c:''},
  {k:'fb',v:false,at:n-45*HR,role:'guest',uid:null,q:'What are the Student Service Center hours?',a:'Mon–Fri 9:00–18:00.',c:'Is it open on Saturday?',rev:n-40*HR}]};
/* ---------- knowledge base (US16): FAQ and office entries edited by staff, with versions.
   The bot, chat suggestions and the FAQ page read only the active version of published entries. ---------- */
/* built-in FAQ entries linked to a chat intent; for a signed-in student the personal answer (registration check, balance) wins */
const KB_INTENT={reg:'reg',adddrop:'adddrop',sched:'sched',pay:'bill',grant:'bill',pw:'pw',wifi:'wifi',portal:'portal',hours:'hours',offices:'offices'};
const KB_CATS=['reg','pay','grant','it','off'],KB_SRCS=['reg','bill','adv','it','cal','ssc','portal'];
const KB_OFFICES=[
 ['registrar',{en:["What does the Registrar do?","Registrar office"],kk:["Registrar не істейді?","Registrar бөлімі"],ru:["Чем занимается Registrar?","Отдел Registrar"]},
  {en:"Registrar handles course registration, enrollment certificates and transcripts. Send a request with a Help Desk ticket (office: Registrar) or contact the Student Service Center: "+SSC+".",
   kk:"Registrar курстарға тіркелу, оқу орнынан анықтама және транскрипт мәселелерімен айналысады. Help Desk арқылы өтінім жіберіңіз (бөлім: Registrar) немесе Студенттерге қызмет көрсету орталығына хабарласыңыз: "+SSC+".",
   ru:"Registrar занимается регистрацией на курсы, справками с места учёбы и транскриптами. Отправьте заявку через Help Desk (отдел: Registrar) или обратитесь в Центр обслуживания студентов: "+SSC+"."}],
 ['itsupport',{en:["What does IT Support do?","IT Support office"],kk:["IT Support не істейді?","IT Support бөлімі"],ru:["Чем занимается IT Support?","Отдел IT Support"]},
  {en:"IT Support helps with university accounts, passwords, Wi-Fi and the Student Portal. Try the self-help steps in the chat first; if they do not help, create a ticket for IT Support.",
   kk:"IT Support университет аккаунттары, құпиясөз, Wi-Fi және Student Portal бойынша көмектеседі. Алдымен чаттағы нұсқаулықты қолданып көріңіз; көмектеспесе, IT Support-қа өтінім ашыңыз.",
   ru:"IT Support помогает с университетскими аккаунтами, паролями, Wi-Fi и Student Portal. Сначала попробуйте шаги самопомощи в чате; если не помогло, создайте заявку в IT Support."}],
 ['finance',{en:["What does the Finance office do?","Finance office"],kk:["Finance бөлімі не істейді?","Finance бөлімі"],ru:["Чем занимается отдел Finance?","Отдел Finance"]},
  {en:"Finance handles tuition payments, billing questions and payment deadlines. Ask the assistant for your balance or create a ticket for Finance.",
   kk:"Finance оқу ақысын төлеу, есепшот сұрақтары және төлем мерзімдерімен айналысады. Қалдықты көмекшіден сұраңыз немесе Finance-қа өтінім ашыңыз.",
   ru:"Finance занимается оплатой обучения, вопросами по счетам и сроками оплаты. Спросите у ассистента свой баланс или создайте заявку в Finance."}],
 ['affairs',{en:["What does Student Affairs do?","Student Affairs office","Lost student ID"],kk:["Student Affairs не істейді?","Student Affairs бөлімі","Студенттік билетімді жоғалттым"],ru:["Чем занимается Student Affairs?","Отдел Student Affairs","Потерял студенческий билет"]},
  {en:"Student Affairs handles dormitory places, student ID cards and student life questions. Create a ticket for Student Affairs or contact the Student Service Center: "+SSC+".",
   kk:"Student Affairs жатақхана орындары, студенттік билет және студенттік өмір сұрақтарымен айналысады. Student Affairs-қа өтінім ашыңыз немесе Студенттерге қызмет көрсету орталығына хабарласыңыз: "+SSC+".",
   ru:"Student Affairs занимается местами в общежитии, студенческими билетами и вопросами студенческой жизни. Создайте заявку в Student Affairs или обратитесь в Центр обслуживания студентов: "+SSC+"."}]];
/* office directory (US10): rooms are real rooms of the campus map; hours are Monday to Friday; all contacts are fictional. "hours" is the Student Service Center entry */
const OFFICE_INFO={
  registrar:{name:'Registrar',room:'D205',open:9,close:17,tel:'8 (727) 000-00-01',mail:'registrar@university.demo'},
  itsupport:{name:'IT Support',room:'E205',open:9,close:18,tel:'8 (727) 000-00-02',mail:'it@university.demo'},
  finance:{name:'Finance',room:'F205',open:9,close:16,tel:'8 (727) 000-00-03',mail:'finance@university.demo'},
  affairs:{name:'Student Affairs',room:'G205',open:10,close:17,tel:'8 (727) 000-00-04',mail:'affairs@university.demo'},
  hours:{name:'Student Service Center',room:'H204',open:9,close:18,tel:'8 (727) 000-00-00',mail:'ssc@university.demo'}};
function seedKb(){const at=Date.now()-30*24*HR,by='Help Desk team';
  const mk=(id,kind,intent,cat,src,q,a)=>({id,kind,intent:intent||null,status:'published',vn:1,vers:[{n:1,act:'create',by,at,cat,src,q,a}],log:[]});
  const per=f=>Object.fromEntries(LANGS.map(l=>[l,f(l)])),lines=v=>Array.isArray(v)?v.join('\n'):v;
  return FAQ.map(f=>mk(f.id,'faq',KB_INTENT[f.id],f.cat,f.src,per(l=>[f.q(l)]),per(l=>lines(f.a(l)))))
    .concat(KB_OFFICES.map(([id,q,a])=>mk(id,'office',null,'off','ssc',q,a)))}
const fresh=()=>({v:5,tickets:seedTickets(),appts:[],chats:{},events:seedEvents(),notes:[],ann:seedAnn(),dismiss:{},kb:seedKb(),prefs:{}});
const loadSt=s=>{s.prefs=s.prefs||{};s.chats=s.chats||{};s.notes=s.notes||[];s.events=s.events||seedEvents();s.ann=s.ann||seedAnn();s.dismiss=s.dismiss||{};s.kb=s.kb||seedKb();
  if(!s.events.some(e=>e.q))s.events=s.events.concat(seedReview());return s};
let st=fresh();
try{const s=JSON.parse(localStorage.getItem('hd-state')||'null');if(s&&s.v===5&&s.tickets)st=loadSt(s)}catch(e){}
function note(uid,type,o){st.notes.push(Object.assign({uid,type,at:Date.now(),read:false},o))}
/* current time; a function so the test page can check other days and hours */
function clock(){return new Date()}
/* reminders can be turned off per student (user menu or chat) */
const remOn=()=>!(U&&st.prefs[U.login]&&st.prefs[U.login].remOff);
function setRem(on){(st.prefs[U.login]=st.prefs[U.login]||{}).remOff=!on;save()}
/* tuition reminder from 7 days before the deadline (also when it has already passed), once per deadline */
function payReminder(){
  if(!U||U.role!=='student'||!remOn()||!U.due)return;
  const b=U.tuition-U.paid,now=clock(),today=new Date(now.getFullYear(),now.getMonth(),now.getDate());
  if(b<=0||(new Date(U.due+'T00:00')-today)/864e5>7||st.notes.some(n=>n.uid===U.login&&n.type==='pay'&&n.due===U.due))return;
  note(U.login,'pay',{due:U.due,amt:b,at:now.getTime()});save()}
/* visitors are anonymous: no ID is stored with their questions or ratings */
const uidOf=()=>U&&U.role!=='guest'?U.login:null;
/* staff questions in Test assistant are not real demand, so they stay out of Analytics */
function logQ(i,t){if(U&&U.role==='staff')return;const e={k:'q',i,at:Date.now(),uid:uidOf()};if(t)e.t=t.slice(0,200);st.events.push(e);save()}
/* a rating keeps the question, the bot answer and the time; the comment is added later */
/* looked up by id, because another tab may replace st in the meantime */
const fbFind=f=>f._id&&st.events.find(e=>e.id===f._id);
function fbEvent(f,up){const e=fbFind(f);
  if(e){e.v=up;e.at=Date.now();delete e.rev}
  else st.events.push({id:f._id=Date.now()+'-'+Math.random().toString(36).slice(2,6),k:'fb',v:up,at:Date.now(),role:U.role,uid:uidOf(),q:f._q,a:f._a,c:''});
  save();if(U.role==='staff')sync()}        /* staff see their own rating in the Review queue right away */
function fbComment(f,c){const e=fbFind(f);if(e){e.c=c;save();if(U.role==='staff')sync()}}
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
  if(isKazakh(t)) return 'kk';
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
let curQ='';                /* the question being answered, saved with a rating */
function bot(o,L){const e=chatEpoch;if(o.fb&&o.q==null)o.q=curQ;
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
  if(o.fb){const f=document.createElement('div');f.className='fb';f._q=o.q||'';f._a=plainAnswer(o);
    [[T[L].helpful,true],[T[L].notHelpful,false]].forEach(([lab,up])=>{const b=document.createElement('button');b.type='button';b.className='fbv';b.textContent=lab;b.setAttribute('aria-pressed','false');
      b.onclick=()=>{f.querySelectorAll('.fbv').forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');fbEvent(f,up);fbMore(f,up,L)};
      f.appendChild(b)});bub.appendChild(f)}
  put(r);
}
const plainAnswer=o=>[o.title,o.text,o.html&&o.html.replace(/<[^>]+>/g,' '),...(o.list||[]).map(x=>x.t??x),...(o.ol||[]),o.after]
  .filter(Boolean).join(' · ').replace(/\s+/g,' ').trim().slice(0,600);
/* after a rating: optional comment field (inline, so the next question is never delayed) and, for "Not helpful", next steps */
function fbMore(f,up,L){
  let x=f.querySelector('.fbx');
  if(!x){x=document.createElement('div');x.className='fbx';
    x.innerHTML='<span class="fbok">'+esc(trL('fb.saved',L))+'</span><form class="fbc"><input maxlength="200" autocomplete="off" placeholder="'+esc(trL('fb.ph',L))+'" aria-label="'+esc(trL('fb.ph',L))+'"><button type="submit">'+esc(trL('fb.send',L))+'</button></form><div class="fbn"></div>';
    x.querySelector('form').onsubmit=e=>{e.preventDefault();const c=e.target.querySelector('input').value.trim();if(!c)return;
      fbComment(f,c);const t=document.createElement('span');t.className='fbok';t.textContent=trL('fb.thanks',L);e.target.replaceWith(t);x.querySelector('.fbok').remove();$('q').focus()};
    f.appendChild(x)}
  const n=x.querySelector('.fbn');n.innerHTML='';
  const acts=up?[]:U.role==='student'?[[T[L].mkT,()=>startTicket(L)],[T[L].talk,()=>human(L)]]:U.role==='guest'?[[trL('guest.exit',L),toLogin]]:[];
  acts.forEach(([lab,fn])=>{const b=document.createElement('button');b.type='button';b.className='link';b.textContent=lab;b.onclick=fn;n.appendChild(b)})}
const later=(fn,ms=380)=>setTimeout(fn,ms);

/* ---------- Campus map: the only source of places the bot may name (US13). Nothing outside this list exists. ---------- */
const CAMPUS=(()=>{
  const m=new Map(),add=(id,b,f,t,barrel)=>m.set(id,{id,b,f,t,barrel:!!barrel});
  const rng=(b,f,a,z,t)=>{for(let n=a;n<=z;n++)add(b+n,b,f,t)};
  for(const b of ['D','E','F','G']){          /* id = building + floor + number */
    rng(b,1,101,108,'classroom');
    rng(b,2,201,204,'classroom');rng(b,2,205,209,'office');
    rng(b,3,301,304,'classroom');rng(b,3,305,309,'office')}
  ['H01','H02','H03'].forEach(id=>add(id,'H',null,'lecture'));
  rng('H',1,101,103,'classroom');
  rng('H',2,201,203,'classroom');rng('H',2,204,209,'office');
  rng('H',3,301,303,'classroom');rng('H',3,304,309,'office');
  rng('I',1,101,103,'classroom');add('I110','I',1,'lecture');add('I111','I',1,'lecture');
  rng('I',2,201,203,'classroom');rng('I',2,204,208,'office');add('I209','I',2,'study');add('I210','I',2,'lecture');add('I211','I',2,'lecture');
  rng('I',3,301,303,'classroom');rng('I',3,304,308,'office');add('I309','I',3,'study');add('I310','I',3,'lecture');add('I311','I',3,'lecture');
  ['A1','A2','B1','B2','C1','C2'].forEach(id=>add(id,null,null,'lecture',true));   /* "barrels": separate lecture halls */
  return m})();
const CAMPUS_BLDS=['D','E','F','G','H','I'];
const CAMPUS_TYPES=['classroom','lecture','office','study'];
const roomNum=id=>parseInt(id.replace(/^[A-Z]/,''),10);
/* compress sorted ids into runs: D101,D102,D103 -> "D101–D103" */
function runs(ids){
  ids=ids.slice().sort((a,b)=>roomNum(a)-roomNum(b));const out=[];
  for(let i=0;i<ids.length;){let j=i;while(j+1<ids.length&&roomNum(ids[j+1])===roomNum(ids[j])+1)j++;
    out.push(j>i?ids[i]+'–'+ids[j]:ids[i]);i=j+1}
  return out}
/* what is on one floor, e.g. "F301–F304 classrooms, F305–F309 teacher's offices" */
function floorSummary(b,f,L){
  const rooms=[...CAMPUS.values()].filter(r=>r.b===b&&r.f===f);
  return CAMPUS_TYPES.map(t=>({t,ids:rooms.filter(r=>r.t===t).map(r=>r.id)})).filter(g=>g.ids.length)
    .sort((a,b)=>Math.min(...a.ids.map(roomNum))-Math.min(...b.ids.map(roomNum)))     /* in room-number order */
    .map(g=>runs(g.ids).join(', ')+' '+(g.ids.length===1?trL('cm.t.'+g.t,L).toLowerCase():trL('cm.p.'+g.t,L))).join(', ')}
/* lines for "Where are the lecture halls?": buildings with identical layouts are merged (D, E, F, G) */
function typeSummary(type,L){
  const lines=[];
  if(type!=='barrel'){
    const per={};
    for(const r of CAMPUS.values())if(r.t===type&&r.b)((per[r.b]=per[r.b]||{})[r.f||0]=per[r.b][r.f||0]||[]).push(r.id);
    const groups={};
    for(const b of CAMPUS_BLDS)if(per[b]){const sig=JSON.stringify(Object.entries(per[b]).map(([f,ids])=>[f,ids.map(i=>i.slice(1))]));(groups[sig]=groups[sig]||[]).push(b)}
    for(const [sig,bs] of Object.entries(groups)){
      const b0=bs[0],parts=Object.keys(per[b0]).sort((x,y)=>(+x||9)-(+y||9)).map(f=>
        +f?trL('cm.fl',L,{n:f})+': '+runs(per[b0][f].map(i=>i.slice(1))).join(', '):runs(per[b0][f]).join(', '));
      lines.push(bs.join(', ')+' · '+parts.join('; '))}}
  if(type==='barrel'||type==='lecture'){
    const ids=[...CAMPUS.values()].filter(r=>r.barrel).map(r=>r.id);
    lines.push(ids.join(', ')+' ('+trL('cm.p.barrel',L)+')')}
  return lines}
/* recognise room numbers: F305, f305, F 305, F-305, H01, A1 (letters A–I; Cyrillic look-alikes accepted) */
const HOMO={'А':'A','В':'B','С':'C','Е':'E','Н':'H','І':'I'};
const LOC=/where|find|locat|room|hall|office|barrel|how (do i )?(get|find|reach)|где|кабинет|аудитори|зал|бочк|как (пройти|найти|добраться)|қайда|бөшке|бөлме|қалай/i;
function roomTokens(text,force){
  const s=text.toUpperCase().replace(/[АВСЕНІ]/g,c=>HOMO[c]),out=[],re=/(^|[^A-Z0-9А-ЯЁӘІҢҒҮҰҚӨҺ])([A-I])([\s-]?)(\d{1,3})(?!\d)/g;
  let m;while((m=re.exec(s))){if(m[3]===' '&&!force)continue;out.push(m[2]+m[4])}
  return out}
/* [а-яё]* is used instead of \w* because \w does not match Cyrillic */
const TYPEQ=[['study',/study room|кабинет[а-яё]* для уч[её]б|уч[её]бн[а-яё]* кабинет|оқу кабинет|оқуға арналған/i],
  ['office',/teacher'?s?'? offices?|кабинет[а-яё]* преподавател|преподавательск|оқытушы|мұғалім/i],
  ['lecture',/lecture|лекци|дәріс/i],['classroom',/classroom|аудитори/i],['barrel',/barrel|бочк|бөшке/i]];
const SVC=/library|canteen|cafeteria|dining|gym\b|sport|registrar|dorm|clinic|медпункт|библиотек|столов|буфет|спортзал|общежити|регистратор|кітапхана|асхана|жатақхана|спорт/i;
/* a 2-3 digit number with no building letter next to a room word, e.g. "room 305", "кабинет 305", "305 бөлме";
   the room word is required so that sums like "pay 450 000" are not read as rooms */
const RW='(?:rooms?|lecture halls?|halls?|offices?|кабинет[а-яё]*|комнат[а-яё]*|аудитори[а-яё]*|ауд\\.?|бөлме[а-яәіңғүұқөһ]*|№)';
function bareNum(text){const m=new RegExp(RW+'\\s*(?:№|no\\.?|#)?\\s*(\\d{2,3})(?!\\d|[:.,]\\d)|(?:^|[^\\w.,:])(\\d{2,3})\\s*-?\\s*'+RW,'i').exec(text);
  return m?m[1]||m[2]:null}
/* map rooms similar to an unknown id: the same number zero-padded (H1 -> H01), else up to 3 rooms that start with it (I11 -> I110, I111) */
function similarRooms(id){const b=id[0],n=id.slice(1),same=[...CAMPUS.keys()].filter(k=>k[0]===b&&k!==id);
  const pad=same.filter(k=>+k.slice(1)===+n);if(pad.length)return pad;
  const pre=same.filter(k=>k.slice(1).startsWith(n));return pre.length<=3?pre:[]}
function campusIntent(t){
  const loc=LOC.test(t),ids=roomTokens(t,loc);
  if(ids.length)return{k:'rooms',ids:[...new Set(ids)].slice(0,3)};
  if(!loc)return null;
  const n=bareNum(t);if(n)return{k:'bare',n};
  const ty=TYPEQ.find(([,re])=>re.test(t));
  if(ty)return{k:'type',type:ty[0]};
  return SVC.test(t)&&WHERE.test(t)?{k:'svc'}:null}
/* "not on the map" is the answer only to where-questions; "Registrar office" alone goes to the knowledge base */
const WHERE=/where|find|locat|how (do i )?(get|reach)|где|найти|как (пройти|добраться)|қайда|қалай бар/i;

/* ---------- understanding the question (nlu.js) ---------- */
/* route(t) decides how to answer; answer(t) shows it. Kept apart so the test page can check routing directly.
   -> {k:'campus',c} | {k:'kb',e} | {k:'h',i} | {k:'guest',i} | {k:'dym',list} | {k:'fb'} */
function route(t){
  const c=campusIntent(t);if(c)return{k:'campus',c};
  const q=nluAnalyze(t),rank=kbRank(q,kbLive()),best=rank[0],T=nluTopic(q),stu=U.role==='student';
  /* two equally strong topics with their own entries ("password and wifi"): ask instead of guessing */
  const top=[...q.tags].filter(([,w])=>w===q.tags.get(T)).map(([k])=>TOPICS[k]);
  const amb=top.length>1&&top.every(tp=>!tp.intent)?top.map(tp=>kbLive().find(x=>x.id===tp.kb)).filter(Boolean):[];
  if(amb.length>1&&!(best&&best.s>=.9))return{k:'dym',list:amb.slice(0,3)};    /* a near-exact question variant still wins */
  /* a ticket number asks about that ticket, not for a new one */
  if(T==='ticket'&&/\b\d{4,6}\b/.test(t))return stu?{k:'h',i:'tkstatus'}:{k:'guest',i:'tkstatus'};
  /* high confidence in a knowledge base entry: answer it (a student still gets the personal answer for registration or billing).
     A question with only a weak word ("office") needs a near-exact variant, otherwise its topic decides */
  if(best&&best.s>=(q.tags.size?NLU_HIGH:q.weak.size?.9:NLU_HIGH))return forEntry(best.e);
  if(T){const tp=TOPICS[T],e=tp.kb&&kbLive().find(x=>x.id===tp.kb);
    if(tp.intent&&PERSONAL.includes(tp.intent))return stu?{k:'h',i:tp.intent}:e?{k:'kb',e}:{k:'guest',i:tp.intent};
    if(tp.intent)return{k:'h',i:tp.intent};
    if(e)return{k:'kb',e}}             /* archived entries are not live, so their topic is not answered */
  /* medium confidence: offer the closest questions */
  if(best&&best.s>=NLU_MED)return{k:'dym',list:rank.filter(x=>x.s>=NLU_MED*.8).slice(0,3).map(x=>x.e)};
  return{k:'fb'}}
const forEntry=e=>e.intent&&PERSONAL.includes(e.intent)&&U.role==='student'?{k:'h',i:e.intent}:{k:'kb',e};
function answer(t){
  const L=detect(t); lastLang=L; curQ=t;
  if(mode==='desc'){pendingDesc=t;mode=null;return later(()=>askOffice(L))}
  const ep=chatEpoch;later(()=>{if(ep===chatEpoch)respond(route(t),L,t)});     /* dropped if the user logged out in the meantime */
}
/* low confidence is logged with the question text for the "Unanswered" list in Analytics */
function respond(r,L,t){
  if(r.k==='campus'){logQ('campus');return H.campus(L,r.c)}
  if(r.k==='kb'){logQ(r.e.intent||'kb:'+r.e.id);return kbAnswer(r.e,L)}
  if(r.k==='h'){logQ(r.i);return U.role==='guest'&&PERSONAL.includes(r.i)?guestOnly(L):H[r.i](L)}
  if(r.k==='guest'){logQ(r.i);return guestOnly(L)}
  if(r.k==='dym'){logQ('dym');
    return bot({text:trL('nlu.dym',L),acts:r.list.map(e=>[kbData(e).q[L][0],()=>respond(forEntry(e),L,t)])},L)}
  logQ('fb',t);H.fb(L)}
/* intents that use a student's own data; a visitor is asked to sign in instead */
const PERSONAL=['reg','bill','adv','ticket','human','tkstatus','remoff','remon'];
const kbData=e=>e.vers.find(v=>v.n===e.vn);
const kbLive=()=>(st.kb||[]).filter(e=>e.status==='published');
/* languages that still lack a question variant or an answer; publishing is blocked while any is missing */
const kbMissing=d=>LANGS.filter(l=>!(d.q[l]||[]).some(s=>s.trim())||!(d.a[l]||'').trim());
const IT_K=['pw','wifi','portal'];
function kbAnswer(e,L){const d=kbData(e),S=T[L],lines=d.a[L].split('\n').map(s=>s.trim()).filter(Boolean),it=IT_K.includes(e.intent);
  const o={src:S.S[d.src]||'',fb:!it};if(lines.length>1)o.ol=lines;else o.text=lines[0];
  /* office entries carry the directory card; a closed office offers a ticket instead */
  const of=OFFICE_INFO[e.id];
  if(of){const s=officeState(of,L);o.list=officeRows(of,L);o.after=s.text;
    o.acts=[[trL('cm.map',L),()=>openMap(of.room)]].concat(!s.open&&U.role==='student'?[[S.mkT,()=>startTicket(L,OFFICES.includes(of.name)?of.name:null)]]:[])}
  if(e.id==='offices')o.list=Object.values(OFFICE_INFO).map(x=>trL('of.line',L,{n:x.name,r:x.room,a:x.open+':00',b:x.close+':00'}));
  bot(o,L);
  /* IT self-help keeps its "Did this help?" step with a ticket for IT Support */
  if(it)later(()=>bot({text:S.helped,acts:[[S.yes,()=>bot({text:S.yesR},L)],[S.no,()=>bot({text:S.noR,acts:[[S.mkT,()=>startTicket(L,'IT Support')],[S.talk,()=>human(L)]]},L)]]},L),250)}
function officeRows(of,L){const r=CAMPUS.get(of.room);return[
  trL('of.room',L,{r:of.room,b:r.b,f:r.f}),trL('cm.ent',L)+': '+trL('cm.ent.'+r.b,L),
  trL('of.hours',L,{a:of.open+':00',b:of.close+':00'}),trL('of.phone',L)+': '+of.tel,'Email: '+of.mail]}
/* open or closed right now (Monday to Friday, local time) */
function officeState(of,L){const now=clock(),d=now.getDay(),h=now.getHours()+now.getMinutes()/60,work=d>=1&&d<=5,t=of.open+':00';
  if(work&&h>=of.open&&h<of.close)return{open:true,text:trL('of.open',L,{t:of.close+':00'})};
  if(work&&h<of.open)return{open:false,text:trL('of.closed',L,{t})};
  const n=new Date(now);do n.setDate(n.getDate()+1);while(n.getDay()%6===0);
  return{open:false,text:trL('of.closedd',L,{d:n.toLocaleDateString(T[L].loc,{weekday:'long'}),t})}}
const H={
 greet:L=>bot({text:T[L].greet},L),
 /* the student's own latest tickets only; a number from another student gets the same "not found" as a wrong number */
 tkstatus:L=>{const mine=st.tickets.filter(isMine).sort((a,b)=>b.at-a.at),m=/\b\d{4,6}\b/.exec(curQ),acts=[[trL('nav.tickets',L),()=>show('tickets')]],src=trL('nav.tickets',L);
   const upd=t=>{const r=(t.replies||[]).slice(-1)[0];return new Date(r?r.at:t.at).toLocaleDateString(T[L].loc)};
   const line=t=>trL('tks.line',L,{n:t.n,o:t.office,s:trL('st.'+t.status,L),d:upd(t)});
   if(m){const t=mine.find(x=>x.n===+m[0]);if(!t)return bot({text:trL('tks.nf',L,{n:m[0]}),acts,src,fb:true},L);
     const r=(t.replies||[]).slice(-1)[0];return bot({text:line(t),after:r?trL('tks.reply',L,{r:r.text}):'',acts,src,fb:true},L)}
   if(!mine.length)return bot({text:trL('tks.none',L),acts:[[T[L].mkT,()=>startTicket(L)]],src,fb:true},L);
   bot({title:trL('tks.latest',L),list:mine.slice(0,3).map(line),acts,src,fb:true},L)},
 remoff:L=>{setRem(false);fillMenu();sync();bot({text:trL('rem.offc',L)},L)},
 remon:L=>{setRem(true);fillMenu();sync();bot({text:trL('rem.onc',L)},L)},
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
 ticket:L=>startTicket(L),
 human:L=>human(L),
 rooms:L=>bot({text:trL('cm.ask',L),src:trL('cm.src',L),acts:[[trL('cm.map',L),()=>openMap()]],fb:true},L),
 campus:(L,c)=>{
   const src=trL('cm.src',L),cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
   if(c.k==='svc')return bot({text:trL('cm.svc',L),src,fb:true},L);
   if(c.k==='type'){const t=c.type;
     return bot({title:trL('cm.listh',L,{t:cap(trL('cm.p.'+t,L))}),list:typeSummary(t,L),after:t==='barrel'?'':trL('cm.numnote',L),src,
       acts:[[trL('cm.map',L),()=>openMap()]],fb:true},L)}
   if(c.k==='bare'){const n=c.n,bs=CAMPUS_BLDS.filter(b=>CAMPUS.has(b+n));   /* buildings come from the map only */
     if(!bs.length)return bot({text:trL('cm.nf',L,{r:n}),src,fb:true},L);
     if(bs.length===1)return roomCard(bs[0]+n,L);
     return bot({text:trL('cm.which',L,{r:n,b:bs.join(', ')}),src,acts:bs.map(b=>[trL('cm.bld',L,{b}),()=>roomCard(b+n,L)])},L)}
   c.ids.forEach(id=>{
     if(CAMPUS.has(id))return roomCard(id,L);
     const sim=similarRooms(id);
     bot({text:trL('cm.nf',L,{r:id}),after:sim.length?trL('cm.dym',L,{r:sim.join(' / ')}):'',src,
       acts:sim.length?sim.map(k=>[k,()=>roomCard(k,L)]):null,fb:true},L)})},
 fb:L=>U.role!=='student'?bot({text:trL('g.nf',L,{c:SSC}),acts:[[trL('g.faq',L),()=>show('faq')],[trL('cm.title',L),()=>openMap()]],fb:true},L):
   bot({text:fill(T[L].fb,{c:SSC}),fb:true,acts:[[T[L].mkT,()=>startTicket(L)],[T[L].talk,()=>human(L)]]},L)
};
function roomCard(id,L){const r=CAMPUS.get(id),rows=[];
  if(r.b)rows.push(trL('cm.building',L)+': '+r.b);
  if(r.f)rows.push(trL('cm.floor',L)+': '+r.f);
  rows.push(trL('cm.type',L)+': '+trL('cm.t.'+r.t,L)+(r.barrel?' ('+trL('cm.t.barrel',L)+')':''));
  if(r.b)rows.push(trL('cm.ent',L)+': '+trL('cm.ent.'+r.b,L));
  const hint=r.barrel?trL('cm.hint.barrel',L,{id}):r.f?trL('cm.hint.floor',L,{b:r.b,f:r.f,r:floorSummary(r.b,r.f,L)}):trL('cm.hint.nofloor',L,{id,b:r.b});
  bot({title:id,list:rows,after:hint,src:trL('cm.src',L),acts:[[trL('cm.map',L),()=>openMap(id)]],fb:true},L)}
let presetOffice=null;
/* personal features: a visitor is asked to sign in; staff in Test assistant are told it needs a student account */
const guestOnly=L=>U.role==='staff'?bot({text:trL('test.only',L)},L):bot({text:trL('g.only',L),acts:[[trL('guest.exit',L),toLogin]]},L);
function startTicket(L,office){if(U.role!=='student')return guestOnly(L);presetOffice=office||null;mode='desc';bot({text:T[L].tAsk},L);$('q').focus()}
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
  bot({text:fill(T[L].booked,{s:fmt(d,L),a:U.advisor}),after:remOn()?'':trL('rem.offnote',L),src:T[L].S.adv},L);
}
function human(L){if(U.role!=='student')return guestOnly(L);
  st.events.push({k:'esc',at:Date.now()});save();      /* counted as an escalation in Analytics */
  bot({text:T[L].queue},L);
  setTimeout(()=>{sys(T[L].joined);bot({text:T[L].staff,staff:true},L)},2200);
}

