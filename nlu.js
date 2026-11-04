/* Question understanding without a server or libraries: normalisation, a synonym and transliteration dictionary per topic,
   typo tolerance (Levenshtein) and scoring of knowledge base entries. Used by the chat engine in app.js. */

/* ---------- normalisation ---------- */
/* Kazakh letters are folded to their nearest Russian letters for comparison, so "тіркелу" and "тиркелу" match */
const KK_FOLD={'і':'и','ү':'у','ұ':'у','қ':'к','ғ':'г','ң':'н','ә':'а','ө':'о','һ':'х'};
const nluNorm=t=>t.toLowerCase().replace(/ё/g,'е').replace(/['’`]/g,'').replace(/[^\p{L}\p{N}]+/gu,' ').replace(/\s+/g,' ').trim();
/* a Latin "i" typed inside a Cyrillic word is read as Kazakh "і" */
const nluFold=w=>(/[а-я]/.test(w)?w.replace(/i/g,'и'):w).replace(/[іүұқғңәөһ]/g,c=>KK_FOLD[c]);
const nluToks=t=>{const s=nluNorm(t);return s?s.split(' ').map(nluFold):[]};

/* filler words: matched only exactly and never counted as content */
const NSTOP=new Set(('i me my mine the a an is are am was be to of in on at for from by with about do does did can could will would should shall '+
  'how what when where which who why please pls and or it its this that there here you your have has had need want get see not dont doesnt cant '+
  'я мне меня мой моя мои мое как где когда что это в во на по с со к ко о об от до за и или а но не ли же бы можно нужно надо хочу '+
  'пожалуйста подскажите скажите какой какая какое какие какого каких сколько есть у уже ещё еще мы вы ты он она они '+
  'мен маган менин сен сиз калай кайда кашан не ма ме ба бе па пе бар кандай керек ушин жане осы сол бул немесе туралы бойынша '+
  'кажет келеди').split(' ').map(nluFold));

/* ---------- topics: synonyms, slang and transliteration in EN / RU / KK ----------
   intent: chat handler in app.js (personal answers or actions); kb: id of the knowledge base entry that answers the topic.
   A word starting with "=" is matched exactly only (no prefix or typo matching). Short stems such as "тіркел" match word endings. */
const TOPICS={
 adddrop:{kb:'adddrop',syn:['add drop','adddrop','add and drop','drop a course','add a course','change a course','swap a course','drop','add drop deadline',
   'эдд дроп','адд дроп','эд дроп','ад дроп','эддроп','адддроп','дроп','добавить предмет','убрать предмет','поменять предмет','сменить предмет','заменить предмет',
   'добавить курс','убрать курс','поменять курс','дропнуть','пән қосу','пәнді алып тастау','пәнді ауыстыру','пән ауыстыру']},
 pw:{kb:'pw',syn:['password','forgot password','reset password','change password','pasword','passcode','parol',
   'пароль','парол','забыл пароль','забыла пароль','не помню пароль','сбросить пароль','поменять пароль','восстановить пароль','пароль от портала',
   'құпиясөз','құпия сөз','парольді ұмыттым','құпиясөзді ұмыттым']},
 wifi:{kb:'wifi',syn:['wifi','wi fi','wireless','internet','no internet','wifi not working','vaifai',
   'вайфай','вай фай','вафля','интернет','инет','не ловит','сеть не ловит','вайфай не работает','интернет не работает','нет интернета',
   'ғаламтор','интернет жоқ','вайфай жоқ']},
 portal:{kb:'portal',syn:['portal','student portal','log in','login','cant log in','cannot log in','sign in','cant sign in',
   'портал','войти','не могу войти','не могу зайти','зайти в портал','не заходит','вход','логин','личный кабинет',
   'порталға кіру','порталға кіре алмаймын','кіре алмай','кіре алмаймын','жүйеге кіру']},
 grant:{intent:'bill',kb:'grant',syn:['grant','state grant','keep grant','lose grant','on a grant',
   'грант','на гранте','госгрант','гос грант','грантник','грантница','потерять грант','сохранить грант','мемлекеттік грант','грантпен','грантта']},
 scholarship:{intent:'bill',syn:['scholarship','stipend','merit scholarship','stipendiya',
   'стипендия','стипенд','степуха','стипуха','стипа','шәкіртақы']},
 pay:{intent:'bill',kb:'pay',syn:['pay','payment','pay tuition','tuition','tuition fee','fee','fees','balance','bill','billing','how much','owe','debt',
   'оплата','оплат','платить','заплатить','сколько платить','сколько стоит','=долг','=долги','задолженност','баланс','=счет','деньги','стоимость обучения',
   'төлем','төлеу','ақы','оқу ақысы','қарыз','қанша төлеу']},
 cert:{kb:'registrar',syn:['certificate','enrollment certificate','reference letter','transcript','registrar',
   'справка','справк','справка с места учебы','выписка','транскрипт','регистратор','анықтама','оқу орнынан анықтама']},
 reg:{intent:'reg',kb:'reg',syn:['registration','register','registering','enroll','enrol','enrollment','course registration','sign up for courses','sign up for classes',
   'prerequisite','prereq','hold','registraciya',
   'регистрация','регистрац','зарегистр','рега','регаться','записаться на курсы','запись на курсы','записаться на предметы','выбор курсов','выбрать курсы',
   'пререквизит','блокировк','тіркел','тіркеу','курсқа жазылу','пәнге жазылу']},
 adv:{intent:'adv',syn:['advisor','adviser','advising','appointment','advisor meeting','meeting with advisor','book advisor','edvaizer',
   'эдвайзер','адвайзер','эдвизор','эдвайзор','советник','куратор','записаться к эдвайзеру','встреча с эдвайзером','консультация',
   'кеңесші','кеңесшіге жазылу','кездесу']},
 sched:{kb:'sched',syn:['schedule','timetable','class schedule','my classes','classes today','raspisanie',
   'расписание','расписан','расписание пар','пары','когда пары','занятия','кесте','сабақ кестесі','сабақ']},
 rooms:{intent:'rooms',syn:['room','classroom','lecture hall','auditorium','building',
   'кабинет','аудитори','корпус','=ауд','бөлме','дәрісхана']},
 ticket:{intent:'ticket',syn:['ticket','create ticket','open a ticket','submit a request','request','complaint',
   'тикет','заявка','заявк','создать заявку','подать заявку','оставить заявку','жалоба','өтінім','өтініш','өтінім ашу']},
 human:{intent:'human',syn:['human','operator','staff member','real person','live agent','talk to staff','talk to a person','speak to someone',
   'оператор','человек','живой человек','сотрудник','позовите оператора','связаться с сотрудником','поговорить с человеком',
   'адам','адаммен','қызметкер','оператормен сөйлесу']},
 hours:{kb:'hours',syn:['hours','opening hours','working hours','when open','open hours',
   'часы работы','график работы','во сколько открывается','до скольки работает','режим работы',
   'жұмыс уақыты','қашан ашылады','жұмыс кестесі']},
 offices:{kb:'offices',syn:['which office','what office','who to contact','who should i contact','contact','department',
   'в какой отдел','какой отдел','к кому обратиться','куда обращаться','куда обратиться','отдел',
   'қай бөлім','кімге хабарласу','кімге жүгіну','бөлім']},
 greet:{intent:'greet',syn:['hi','hello','hey','good morning','привет','здравствуйте','здравствуй','добрый день','салам','сәлем','салем','сәлеметсіз','қайырлы күн']}
};
/* flat phrase index, built once */
const NLU_PHRASES=[];
Object.entries(TOPICS).forEach(([topic,o])=>o.syn.forEach(p=>{
  const exact=p[0]==='=',words=nluToks(exact?p.slice(1):p);if(words.length)NLU_PHRASES.push({topic,words,exact})}));

/* ---------- typo tolerance ---------- */
function lev(a,b,max){
  if(Math.abs(a.length-b.length)>max)return max+1;
  let prev=Array.from({length:b.length+1},(_,j)=>j);
  for(let i=1;i<=a.length;i++){const cur=[i];let low=i;
    for(let j=1;j<=b.length;j++){cur[j]=Math.min(prev[j]+1,cur[j-1]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1));if(cur[j]<low)low=cur[j]}
    if(low>max)return max+1;prev=cur}
  return prev[b.length]}
/* cost of reading token t as dictionary word w: 0 same, 0.5 same stem with another ending, 1–2 typos, Infinity no match.
   1 typo is allowed for words of 4–6 letters, 2 for longer ones; filler words and short words must match exactly. */
function wcost(t,w,exact){
  if(t===w)return 0;
  if(exact||NSTOP.has(t)||NSTOP.has(w))return Infinity;
  if(w.length>=4&&t.startsWith(w))return .5;
  if(t.length>=5&&w.startsWith(t))return .5;
  const max=t.length>=7?2:t.length>=4?1:0;if(!max)return Infinity;
  const d=lev(t,w,max);return d<=max?d:Infinity}

/* ---------- analysis of one text ---------- */
const nluCache=new Map();
/* -> {toks, tags: Map topic -> weight, words: content tokens not explained by a topic} */
function nluAnalyze(text){
  if(nluCache.has(text))return nluCache.get(text);
  const toks=nluToks(text),matches=[];
  for(const p of NLU_PHRASES){const used=[],costs=[];let ok=true;
    for(const w of p.words){let best=Infinity,bi=-1;
      toks.forEach((t,i)=>{if(used.includes(i))return;const c=wcost(t,w,p.exact);if(c<best){best=c;bi=i}});
      if(bi<0){ok=false;break}used.push(bi);costs.push(best)}
    if(ok)matches.push({topic:p.topic,len:p.words.length,used,costs})}
  /* each token belongs to the topic that explains it best: lowest cost, then the longer phrase */
  const owner=toks.map(()=>null);
  matches.forEach(m=>m.used.forEach((i,k)=>{const o=owner[i],c=m.costs[k];
    if(!o||c<o.c||(c===o.c&&m.len>o.len))owner[i]={topic:m.topic,c,len:m.len}}));
  const tags=new Map();
  matches.forEach(m=>{if(m.used.every(i=>owner[i].topic===m.topic))tags.set(m.topic,Math.max(tags.get(m.topic)||0,m.len))});
  const words=toks.filter((t,i)=>!owner[i]&&!NSTOP.has(t)&&t.length>=3&&!/^\d+$/.test(t));
  const r={toks,tags,words};nluCache.set(text,r);if(nluCache.size>2000)nluCache.clear();return r}
/* strongest topic of a question; ties go to the topic listed first in TOPICS */
function nluTopic(a){let best=null,bw=0;for(const t of Object.keys(TOPICS)){const w=a.tags.get(t)||0;if(w>bw){bw=w;best=t}}return best}

/* ---------- knowledge base scoring ---------- */
/* similarity of a question to every question variant of the published entries (all languages).
   Shared topics weigh 3; content words weigh by rarity (idf), so rare words count more. Returns [{e,s,v}] best first. */
const NLU_TW=3;
function kbRank(q,entries){
  const vs=[];
  entries.forEach(e=>{const d=kbData(e);LANGS.forEach(l=>(d.q[l]||[]).forEach(v=>vs.push({e,v,a:nluAnalyze(v)})))});
  if(!vs.length)return[];
  const df=new Map();vs.forEach(x=>new Set(x.a.words).forEach(w=>df.set(w,(df.get(w)||0)+1)));
  const vocab=[...df.keys()],idf=w=>Math.log(1+vs.length/(df.get(w)||1));
  const near=(w,list)=>list.some(x=>wcost(w,x)<=2||wcost(x,w)<=2);
  /* question words unknown to the knowledge base are ignored instead of lowering the score */
  const qw=q.words.map(w=>{const k=vocab.find(x=>wcost(w,x)<=2||wcost(x,w)<=2);return k?{w,i:idf(k)}:null}).filter(Boolean);
  const qAll=q.toks.filter(t=>!NSTOP.has(t));
  const best=new Map();
  vs.forEach(({e,v,a})=>{
    let mV=0,tV=0,mQ=0,tQ=0;
    a.tags.forEach((_,t)=>{tV+=NLU_TW;if(q.tags.has(t))mV+=NLU_TW});
    a.words.forEach(w=>{const i=idf(w);tV+=i;if(near(w,qAll))mV+=i});
    q.tags.forEach((_,t)=>{tQ+=NLU_TW;if(a.tags.has(t))mQ+=NLU_TW});
    const vAll=a.toks.filter(t=>!NSTOP.has(t));
    qw.forEach(({w,i})=>{tQ+=i;if(near(w,vAll))mQ+=i});
    const s=tV&&tQ&&(mV||mQ)?.6*mV/tV+.4*mQ/tQ:0;
    const b=best.get(e);if(!b||s>b.s)best.set(e,{e,s,v})});
  return[...best.values()].filter(x=>x.s>0).sort((a,b)=>b.s-a.s)}
const NLU_HIGH=.6,NLU_MED=.35;
