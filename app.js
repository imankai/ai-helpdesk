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
/* Student Portal record (US17): cumulative GPA and credits earned, and the courses of the current and the last term.
   g: final letter grade, null = not posted yet. Fall 2026 is in progress, so its final grades are not posted. All values are fictional. */
const GRADE_DL='2026-12-28';      /* official posting deadline for Fall 2026 final grades (academic calendar) */
const ACAD={
  '249900001':{gpa:3.12,cr:128,courses:[{c:'INF451',t:'Team Software Project',cr:6,g:null,term:'f26'},{c:'INF320',t:'Computer Networks',cr:5,g:null,term:'f26'},
    {c:'INF310',t:'Database Systems',cr:5,g:'B+',term:'s26'},{c:'INF305',t:'Operating Systems',cr:5,g:'B',term:'s26'},{c:'MGT210',t:'Business Communication',cr:3,g:'A-',term:'s26'}]},
  '249900002':{gpa:3.67,cr:134,courses:[{c:'INF451',t:'Team Software Project',cr:6,g:null,term:'f26'},{c:'MAT301',t:'Statistics',cr:5,g:null,term:'f26'},
    {c:'INF320',t:'Computer Networks',cr:5,g:'A',term:'s26'},{c:'INF310',t:'Database Systems',cr:5,g:'A-',term:'s26'},{c:'ENG210',t:'Academic English',cr:3,g:'A',term:'s26'}]},
  '249900003':{gpa:2.85,cr:121,courses:[{c:'INF451',t:'Team Software Project',cr:6,g:null,term:'f26'},{c:'INF330',t:'Information Systems Analysis',cr:5,g:null,term:'f26'},
    {c:'INF320',t:'Computer Networks',cr:5,g:'B-',term:'s26'},{c:'INF310',t:'Database Systems',cr:5,g:'C+',term:'s26'},{c:'MGT210',t:'Business Communication',cr:3,g:'B',term:'s26'}]},
  '249900004':{gpa:3.40,cr:126,courses:[{c:'INF451',t:'Team Software Project',cr:6,g:null,term:'f26'},{c:'MAT301',t:'Statistics',cr:5,g:null,term:'f26'},
    {c:'INF310',t:'Database Systems',cr:5,g:'B+',term:'s26'},{c:'INF305',t:'Operating Systems',cr:5,g:'A-',term:'s26'},{c:'HIS101',t:'History of Kazakhstan',cr:3,g:'A',term:'s26'}]}};
/* on-campus housing (US20): dormitory number and room; 249900002 does not live in a dormitory. Fictional. */
const DORMS={'249900001':{d:1,r:'312'},'249900003':{d:2,r:'105'},'249900004':{d:2,r:'418'}};
Object.entries(ACCOUNTS).forEach(([k,a])=>{a.login=k;a.id=k;a.first=a.name.split('.')[0];if(ACAD[k])a.acad=ACAD[k];if(a.role==='student')a.dorm=DORMS[k]||null});
/* course code -> title, from the students' records and their registration lists ("INF 401 Software Engineering") */
const COURSE_T={};
Object.values(ACAD).forEach(a=>a.courses.forEach(x=>{COURSE_T[x.c]=x.t}));
Object.values(ACCOUNTS).forEach(a=>(a.courses||[]).forEach(x=>{const m=/^([A-Z]+) (\d+) (.+)$/.exec(x.c);if(m&&!COURSE_T[m[1]+m[2]])COURSE_T[m[1]+m[2]]=m[3]}));
/* attendance (US18): absence limit per course of the current term, and the absences at the start of the demo.
   Absences live in st.att, so a teacher's mark (staff "Attendance (demo)") reaches the student's tab. */
const ATT_LIM={INF451:6,INF320:6,MAT301:5,INF330:6};
const ATT_SEED={'249900001':{INF451:2,INF320:1},'249900002':{INF451:4,MAT301:1},'249900003':{INF451:1,INF330:3},'249900004':{INF451:0,MAT301:2}};
const seedAtt=()=>JSON.parse(JSON.stringify(ATT_SEED));
const ATT_WARN=2;             /* warn when this many absences or fewer are left before the limit */
/* library (US19): demo catalog with fictional copy counts and shelves; "next" is the nearest return date when no copy is available.
   The library's own location is not on the campus map, so the bot names shelves only. */
const CATALOG=[
  {id:'cc',t:'Clean Code',a:'Robert C. Martin',c:'INF451',n:4,av:2,sh:'B-12'},
  {id:'pp',t:'The Pragmatic Programmer',a:'Andrew Hunt, David Thomas',c:'INF451',n:3,av:0,sh:'B-12',next:'2026-11-18'},
  {id:'rf',t:'Refactoring',a:'Martin Fowler',c:'INF451',n:2,av:1,sh:'B-12'},
  {id:'se',t:'Software Engineering',a:'Ian Sommerville',c:'INF401',n:5,av:3,sh:'B-10'},
  {id:'dp',t:'Design Patterns',a:'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides',c:'INF401',n:2,av:1,sh:'B-11'},
  {id:'cn',t:'Computer Networking: A Top-Down Approach',a:'James Kurose, Keith Ross',c:'INF320',n:6,av:4,sh:'C-03'},
  {id:'db',t:'Database System Concepts',a:'Abraham Silberschatz, Henry Korth, S. Sudarshan',c:'INF310',n:5,av:2,sh:'C-07'},
  {id:'os',t:'Operating System Concepts',a:'Abraham Silberschatz, Peter Galvin, Greg Gagne',c:'INF305',n:4,av:0,sh:'C-08',next:'2026-11-19'},
  {id:'sa',t:'Systems Analysis and Design',a:'Kenneth Kendall, Julie Kendall',c:'INF330',n:3,av:1,sh:'D-01'},
  {id:'ml',t:'Machine Learning',a:'Tom Mitchell',c:'INF380',n:2,av:2,sh:'D-02'},
  {id:'wd',t:'Learning Web Design',a:'Jennifer Robbins',c:'INF350',n:3,av:2,sh:'D-05'},
  {id:'sec',t:'Security Engineering',a:'Ross Anderson',c:'INF415',n:2,av:0,sh:'C-11',next:'2026-11-24'},
  {id:'st',t:'Statistics',a:'David Freedman, Robert Pisani, Roger Purves',c:'MAT301',n:4,av:3,sh:'A-09'},
  {id:'al',t:'Introduction to Algorithms',a:'Thomas Cormen, Charles Leiserson, Ronald Rivest, Clifford Stein',c:'INF210',n:3,av:1,sh:'A-04'}];
/* books on loan; 249900001 has two, one overdue (this is her library hold on registration). Staff can check their own loans too. */
const LOANS=[{uid:'249900001',b:'cc',due:'2026-11-25'},{uid:'249900001',b:'os',due:'2026-10-30'},
  {uid:'249900002',b:'cn',due:'2026-11-20'},{uid:'249900004',b:'st',due:'2026-12-01'},{uid:'staff',b:'se',due:'2026-11-27'}];
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
const KB_CATS=['reg','pay','grant','it','off','life','acad'],KB_SRCS=['reg','bill','adv','it','cal','ssc','portal','ev','clubs','fac'];
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
 ['housing',{en:["What does the Housing Office do?","Housing Office"],kk:["Housing Office не істейді?","Housing Office бөлімі"],ru:["Чем занимается Housing Office?","Отдел Housing Office"]},
  {en:"The Housing Office handles dormitory repairs, room changes and other housing requests of students who live on campus. If you live in a dormitory, describe the problem in the chat and the assistant creates a housing request.",
   kk:"Housing Office кампуста тұратын студенттердің жатақханадағы жөндеу, бөлме ауыстыру және басқа тұрғын үй өтінімдерімен айналысады. Жатақханада тұрсаңыз, мәселені чатта жазыңыз, көмекші өтінім жасайды.",
   ru:"Housing Office занимается ремонтом в общежитиях, сменой комнаты и другими жилищными заявками студентов, живущих на кампусе. Если вы живёте в общежитии, опишите проблему в чате, и ассистент создаст заявку."}],
 ['affairs',{en:["What does Student Affairs do?","Student Affairs office","Lost student ID"],kk:["Student Affairs не істейді?","Student Affairs бөлімі","Студенттік билетімді жоғалттым"],ru:["Чем занимается Student Affairs?","Отдел Student Affairs","Потерял студенческий билет"]},
  {en:"Student Affairs handles dormitory places, student ID cards and student life questions. Create a ticket for Student Affairs or contact the Student Service Center: "+SSC+".",
   kk:"Student Affairs жатақхана орындары, студенттік билет және студенттік өмір сұрақтарымен айналысады. Student Affairs-қа өтінім ашыңыз немесе Студенттерге қызмет көрсету орталығына хабарласыңыз: "+SSC+".",
   ru:"Student Affairs занимается местами в общежитии, студенческими билетами и вопросами студенческой жизни. Создайте заявку в Student Affairs или обратитесь в Центр обслуживания студентов: "+SSC+"."}],
 /* US22: the bot sends students here when a teacher is not in the directory */
 ['deans',{en:["What does the Dean's Office do?","Dean's Office","Dean's Office contacts"],kk:["Деканат не істейді?","Деканат","Деканат байланыстары"],ru:["Чем занимается деканат?","Деканат","Контакты деканата"]},
  {en:"The Dean's Office handles academic questions of the faculty: teachers and courses, academic leave, exam re-takes and transfers. Come during office hours or write an email.",
   kk:"Деканат факультеттің академиялық мәселелерімен айналысады: оқытушылар мен курстар, академиялық демалыс, емтиханды қайта тапсыру және ауысу. Жұмыс уақытында келіңіз немесе электрондық хат жазыңыз.",
   ru:"Деканат занимается академическими вопросами факультета: преподаватели и курсы, академический отпуск, пересдачи и переводы. Приходите в часы работы или напишите на почту."}]];
/* office directory (US10): rooms are real rooms of the campus map; hours are Monday to Friday; all contacts are fictional. "hours" is the Student Service Center entry */
const OFFICE_INFO={
  registrar:{name:'Registrar',room:'D205',open:9,close:17,tel:'8 (727) 000-00-01',mail:'registrar@university.demo'},
  itsupport:{name:'IT Support',room:'E205',open:9,close:18,tel:'8 (727) 000-00-02',mail:'it@university.demo'},
  finance:{name:'Finance',room:'F205',open:9,close:16,tel:'8 (727) 000-00-03',mail:'finance@university.demo'},
  affairs:{name:'Student Affairs',room:'G205',open:10,close:17,tel:'8 (727) 000-00-04',mail:'affairs@university.demo'},
  housing:{name:'Housing Office',room:'G206',open:9,close:17,tel:'8 (727) 000-00-05',mail:'housing@university.demo'},
  hours:{name:'Student Service Center',room:'H204',open:9,close:18,tel:'8 (727) 000-00-00',mail:'ssc@university.demo'},
  /* the Dean's Office has no phone in the directory: teacher answers (US22) never show a phone number */
  deans:{name:"Dean's Office",room:'H205',open:9,close:17,mail:'deans@university.demo'}};
/* ---------- campus life and teachers (US21, US22): knowledge base entries with extra fields (x), edited by staff like the others.
   q[lang]: first line is the title / name, other lines are other names or keywords the bot recognises; a[lang]: description or note.
   Event dates are relative to today (rel: days from today, wd: the next such weekday, 0 = Sunday), so the demo is always current;
   an event edited by staff gets a fixed date. Places are rooms of the campus map only. All people and emails are fictional. ---------- */
const EV_SEED=[
 ['ev-ai',{rel:0,a:'17:00',b:'18:30',place:'H02'},
  {en:['Guest Lecture: AI in Everyday Life','guest lecture'],kk:['Қонақ дәрісі: Күнделікті өмірдегі жасанды интеллект','қонақ дәрісі'],ru:['Гостевая лекция: ИИ в повседневной жизни','гостевая лекция']},
  {en:'An open lecture about how AI tools help with study, work and daily life, followed by questions from the audience. Open to students, staff and visitors.',
   kk:'Жасанды интеллект құралдарының оқуға, жұмысқа және күнделікті өмірге қалай көмектесетіні туралы ашық дәріс, соңында сұрақ-жауап. Студенттерге, қызметкерлерге және қонақтарға ашық.',
   ru:'Открытая лекция о том, как инструменты ИИ помогают в учёбе, работе и повседневной жизни, после неё — вопросы из зала. Открыта для студентов, сотрудников и гостей.'}],
 ['ev-python',{rel:1,a:'16:00',b:'18:00',place:'I211'},
  {en:['Python Workshop for Beginners','Python workshop','python'],kk:['Бастаушыларға арналған Python шеберханасы','Python шеберханасы'],ru:['Воркшоп по Python для начинающих','воркшоп по Python','питон']},
  {en:'A hands-on introduction to Python: variables, loops and a small project. Bring a laptop; no experience needed.',
   kk:'Python тіліне практикалық кіріспе: айнымалылар, циклдер және шағын жоба. Ноутбук ала келіңіз; тәжірибе қажет емес.',
   ru:'Практическое введение в Python: переменные, циклы и небольшой проект. Возьмите ноутбук; опыт не нужен.'}],
 ['ev-hack',{rel:2,a:'10:00',b:'18:00',place:'I210'},
  {en:['Campus Hackathon','hackathon'],kk:['Кампус хакатоны','хакатон'],ru:['Хакатон на кампусе','хакатон']},
  {en:'A one-day team hackathon: build a prototype that makes student life easier. Teams of 3–4 people; lunch is provided.',
   kk:'Бір күндік командалық хакатон: студенттік өмірді жеңілдететін прототип жасаңыз. Командада 3–4 адам; түскі ас беріледі.',
   ru:'Однодневный командный хакатон: создайте прототип, который упростит студенческую жизнь. Команды по 3–4 человека; обед предоставляется.'}],
 ['ev-career',{rel:4,a:'11:00',b:'15:00',place:'H01'},
  {en:['Career Fair: IT Companies','career fair','job fair'],kk:['Мансап жәрмеңкесі: IT компаниялар','мансап жәрмеңкесі','бос жұмыс орындары'],ru:['Ярмарка вакансий: IT-компании','ярмарка вакансий','ярмарка']},
  {en:'Meet IT companies that offer internships and junior positions. Bring your CV.',
   kk:'Тағылымдама және бастапқы лауазымдар ұсынатын IT компаниялармен танысыңыз. Түйіндемеңізді ала келіңіз.',
   ru:'Познакомьтесь с IT-компаниями, которые предлагают стажировки и позиции junior. Возьмите резюме.'}],
 ['ev-movie',{wd:5,a:'19:00',b:'21:30',place:'B1'},
  {en:['Friday Movie Night','movie night','movie'],kk:['Жұма кинокеші','кинокеш','фильм'],ru:['Пятничный киновечер','киновечер','кино']},
  {en:'A relaxed evening with a film chosen by student vote on the big screen. Free entry.',
   kk:'Студенттер дауыс беріп таңдаған фильмді үлкен экранда көретін жайлы кеш. Кіру тегін.',
   ru:'Спокойный вечер с фильмом, выбранным голосованием студентов, на большом экране. Вход свободный.'}],
 ['ev-chess',{rel:8,a:'15:00',b:'18:00',place:'I111'},
  {en:['Open Chess Tournament','chess tournament'],kk:['Ашық шахмат турнирі','шахмат турнирі'],ru:['Открытый шахматный турнир','шахматный турнир']},
  {en:'A rapid chess tournament for all levels, organised by the Chess Club. Boards and clocks are provided.',
   kk:'Шахмат үйірмесі ұйымдастыратын барлық деңгейге арналған жылдам шахмат турнирі. Тақталар мен сағаттар беріледі.',
   ru:'Турнир по быстрым шахматам для всех уровней, организует Шахматный клуб. Доски и часы предоставляются.'}],
 ['ev-volunteer',{rel:9,a:'10:00',b:'13:00',place:'C1'},
  {en:['Volunteer Day: Campus Clean-up','volunteer day','cleanup'],kk:['Еріктілер күні: кампусты тазалау','еріктілер күні','сенбілік'],ru:['День волонтёра: уборка кампуса','день волонтёра','субботник']},
  {en:'Meet at barrel C1 and help tidy up the campus grounds. Gloves and bags are provided; volunteer hours are counted.',
   kk:'C1 бөшкесінің жанында жиналып, кампус аумағын тазалауға көмектесіңіз. Қолғап пен қаптар беріледі; еріктілік сағаттары есептеледі.',
   ru:'Сбор у бочки C1, помогаем навести порядок на территории кампуса. Перчатки и мешки выдаём; волонтёрские часы засчитываются.'}],
 ['ev-pitch',{rel:20,a:'18:00',b:'20:00',place:'I310'},
  {en:['Startup Pitch Evening','startup pitch','pitch night'],kk:['Стартап питч кеші','стартап питч'],ru:['Вечер стартап-питчей','питч стартапов','стартап']},
  {en:'Student teams present startup ideas in 5 minutes each; a jury of staff gives feedback. Come to pitch or to listen.',
   kk:'Студент командалары стартап идеяларын 5 минуттан таныстырады; қызметкерлерден құралған қазылар алқасы пікір айтады. Таныстыруға немесе тыңдауға келіңіз.',
   ru:'Студенческие команды за 5 минут представляют идеи стартапов; жюри из сотрудников даёт обратную связь. Приходите выступить или послушать.'}],
 /* two events that already took place: never shown as upcoming */
 ['ev-quiz',{rel:-3,a:'18:00',b:'20:00',place:'A2'},
  {en:['Freshers Quiz Night','quiz night','quiz'],kk:['Бірінші курстарға арналған квиз','квиз'],ru:['Квиз для первокурсников','квиз']},
  {en:'A team quiz about the university and general knowledge for first-year students.',
   kk:'Бірінші курс студенттеріне арналған университет және жалпы білім туралы командалық квиз.',
   ru:'Командный квиз об университете и на общую эрудицию для первокурсников.'}],
 ['ev-cyber',{rel:-10,a:'14:00',b:'16:00',place:'I211'},
  {en:['Cybersecurity Workshop','cybersecurity workshop','cybersecurity'],kk:['Киберқауіпсіздік шеберханасы','киберқауіпсіздік'],ru:['Воркшоп по кибербезопасности','кибербезопасность']},
  {en:'A practical session on strong passwords, phishing and safe use of public Wi-Fi.',
   kk:'Мықты құпиясөз, фишинг және қоғамдық Wi-Fi-ды қауіпсіз пайдалану туралы практикалық сабақ.',
   ru:'Практическое занятие о надёжных паролях, фишинге и безопасном использовании общественного Wi-Fi.'}]];
const CLUB_SEED=[
 ['cl-prog',{wd:3,a:'18:00',b:'20:00',place:'I209',who:'Alem Bytova',mail:'a.bytova@university.demo'},
  {en:['Programming Club','programming','coding club','coding'],kk:['Бағдарламалау үйірмесі','бағдарламалау','программалау'],ru:['Клуб программирования','программирование','кружок программирования','кодинг']},
  {en:'Weekly coding practice, preparation for programming contests and small team projects. Beginners are welcome; bring a laptop.',
   kk:'Апта сайынғы бағдарламалау жаттығулары, олимпиадаларға дайындық және шағын командалық жобалар. Бастаушыларды да күтеміз; ноутбук ала келіңіз.',
   ru:'Еженедельная практика программирования, подготовка к олимпиадам и небольшие командные проекты. Новичкам рады; возьмите ноутбук.'}],
 ['cl-chess',{wd:2,a:'17:00',b:'19:00',place:'I309',who:'Dias Gambitov',mail:'d.gambitov@university.demo'},
  {en:['Chess Club','chess'],kk:['Шахмат үйірмесі','шахмат'],ru:['Шахматный клуб','шахматы','шахмат']},
  {en:'Casual games, chess puzzles and training for tournaments. All levels; boards are provided.',
   kk:'Еркін ойындар, шахмат есептері және турнирлерге дайындық. Барлық деңгейге; тақталар беріледі.',
   ru:'Свободные партии, шахматные задачи и подготовка к турнирам. Любой уровень; доски предоставляются.'}],
 ['cl-debate',{wd:4,a:'18:00',b:'20:00',place:'H03',who:'Madina Rhetorikova',mail:'m.rhetorikova@university.demo'},
  {en:['Debate Club','debate','debates','public speaking'],kk:['Дебат клубы','дебат','шешендік'],ru:['Дебатный клуб','дебаты','ораторское искусство']},
  {en:'Parliamentary-style debates in English, Kazakh and Russian, and public speaking practice.',
   kk:'Ағылшын, қазақ және орыс тілдерінде парламенттік үлгідегі дебаттар және шешендік өнер жаттығулары.',
   ru:'Дебаты в парламентском формате на английском, казахском и русском и практика публичных выступлений.'}],
 ['cl-music',{wd:5,a:'17:00',b:'19:00',place:'B2',who:'Arsen Melodiyev',mail:'a.melodiyev@university.demo'},
  {en:['Music Club','music','band','choir'],kk:['Музыка үйірмесі','музыка','хор'],ru:['Музыкальный клуб','музыка','хор']},
  {en:'Jam sessions, a student band and a choir; we perform at campus concerts. Any instrument or voice is welcome.',
   kk:'Джем-сессиялар, студенттік топ және хор; кампустағы концерттерде өнер көрсетеміз. Кез келген аспап пен дауысқа қуаныштымыз.',
   ru:'Джем-сейшены, студенческая группа и хор; выступаем на концертах кампуса. Рады любому инструменту и голосу.'}],
 ['cl-robot',{wd:1,a:'16:00',b:'18:00',place:'E104',who:'Aruzhan Circuitova',mail:'a.circuitova@university.demo'},
  {en:['Robotics Club','robotics','robots','arduino'],kk:['Робототехника үйірмесі','робототехника'],ru:['Клуб робототехники','робототехника','роботы']},
  {en:'Build and program robots with Arduino and sensors; we prepare for student robotics competitions.',
   kk:'Arduino мен датчиктер арқылы роботтар құрастырып, бағдарламалаймыз; студенттік робототехника жарыстарына дайындаламыз.',
   ru:'Собираем и программируем роботов на Arduino с датчиками; готовимся к студенческим соревнованиям по робототехнике.'}],
 ['cl-volunteer',{wd:6,a:'11:00',b:'13:00',place:'C2',who:'Yerlan Helperov',mail:'y.helperov@university.demo'},
  {en:['Volunteer Club','volunteering','volunteer'],kk:['Еріктілер клубы','еріктілік','волонтер'],ru:['Волонтёрский клуб','волонтёрство','волонтер']},
  {en:'Charity events, help at campus events and city projects. Volunteer hours are recorded for your activity certificate.',
   kk:'Қайырымдылық шаралары, кампус іс-шаралары мен қалалық жобаларға көмек. Еріктілік сағаттары белсенділік анықтамасына жазылады.',
   ru:'Благотворительные акции, помощь на мероприятиях кампуса и городские проекты. Волонтёрские часы записываются в справку об активности.'}]];
/* teacher directory: courses (INF451 and every course of the demo students), email, office (teacher's offices of the campus map only), office hours (d: 0 = Sunday … 6 = Saturday). No phones. */
const T_NOTE=[{en:'Outside office hours, please email first to agree on a time.',kk:'Консультация уақытынан тыс кездесу үшін алдымен электрондық пошта арқылы уақытты келісіңіз.',ru:'Вне часов консультаций сначала напишите на почту, чтобы договориться о времени.'},
  {en:'Please write the course code in the subject of your email.',kk:'Хаттың тақырыбына курс кодын жазыңыз.',ru:'Пожалуйста, указывайте код курса в теме письма.'}];
const TEACH_SEED=[
 ['t-demova','Dr. Aidana Demova','Айдана Демова',['INF451','INF401'],'a.demova','E206',[[1,'14:00','16:00'],[3,'10:00','11:00']],0],
 ['t-specimenov','Prof. Timur Specimenov','Тимур Спесименов',['INF451','INF390'],'t.specimenov','E207',[[2,'15:00','17:00']],1],
 ['t-brightwater','Dr. Selena Brightwater','Селена Брайтуотер',['INF320','INF360'],'s.brightwater','D206',[[4,'11:00','13:00']],0],
 ['t-primerbekov','Dr. Marat Primerbekov','Марат Примербеков',['MAT301','INF380'],'m.primerbekov','F206',[[1,'10:00','12:00'],[5,'14:00','15:00']],1],
 ['t-quill','Dr. Nora Quill','Нора Квилл',['INF330','INF370','INF340'],'n.quill','F207',[[3,'14:00','16:00']],0],
 ['t-mockbayev','Dr. Ruslan Mockbayev','Руслан Мокбаев',['INF310','INF305'],'r.mockbayev','D207',[[5,'10:00','12:00']],1],
 ['t-lumen','Dr. Iris Lumen','Ирис Люмен',['INF350','MAT301'],'i.lumen','G207',[[2,'10:00','12:00']],0],
 ['t-sampleuly','Prof. Ernar Sampleuly','Ернар Сэмплұлы',['MGT210','MGT301'],'e.sampleuly','G208',[[4,'14:00','16:00']],1],
 ['t-imaginova','Dr. Asel Imaginova','Әсел Имагинова',['ENG210','HIS101'],'a.imaginova','H305',[[1,'15:00','17:00']],0],
 ['t-nightingale','Dr. Leo Nightingale','Лео Найтингейл',['INF415'],'l.nightingale','I305',[[3,'11:00','12:30']],1]];
const KB_X=['event','club','teacher'];
function seedKb(){const at=Date.now()-30*24*HR,by='Help Desk team';
  const mk=(id,kind,intent,cat,src,q,a,x)=>({id,kind,intent:intent||null,status:'published',vn:1,vers:[Object.assign({n:1,act:'create',by,at,cat,src,q,a},x?{x}:{})],log:[]});
  const per=f=>Object.fromEntries(LANGS.map(l=>[l,f(l)])),lines=v=>Array.isArray(v)?v.join('\n'):v;
  return FAQ.map(f=>mk(f.id,'faq',KB_INTENT[f.id],f.cat,f.src,per(l=>[f.q(l)]),per(l=>lines(f.a(l)))))
    .concat(KB_OFFICES.map(([id,q,a])=>mk(id,'office',null,'off','ssc',q,a)))
    .concat(EV_SEED.map(([id,x,q,a])=>mk(id,'event',null,'life','ev',q,a,x)))
    .concat(CLUB_SEED.map(([id,x,q,a])=>mk(id,'club',null,'life','clubs',q,a,x)))
    .concat(TEACH_SEED.map(([id,en,cy,courses,m,room,oh,nt])=>mk(id,'teacher',null,'acad','fac',{en:[en],kk:[cy],ru:[cy.replace('ұ','у').replace('Ә','А')]},T_NOTE[nt],
      {courses,mail:m+'@university.demo',room,oh:oh.map(([d,a,b])=>({d,a,b}))})))}
/* housing requests (US20), so the staff list is not empty on first launch. status: submitted -> progress -> done; upd = last update */
const seedHousing=()=>{const n=Date.now();return[
  {n:101,uid:'249900003',who:'Kenan',dorm:2,room:'105',type:'repair',desc:'The shower drain in my room is blocked.',status:'progress',at:n-30*HR,upd:n-20*HR},
  {n:102,uid:'249900004',who:'Zhanibek',dorm:2,room:'418',type:'move',desc:'I would like to move to a quieter room on another floor.',status:'submitted',at:n-6*HR,upd:n-6*HR}]};
const fresh=()=>({v:5,tickets:seedTickets(),appts:[],chats:{},events:seedEvents(),notes:[],ann:seedAnn(),dismiss:{},kb:seedKb(),prefs:{},att:seedAtt(),housing:seedHousing(),evreg:{}});
const loadSt=s=>{s.prefs=s.prefs||{};s.att=s.att||seedAtt();s.housing=s.housing||seedHousing();s.evreg=s.evreg||{};
  /* data saved before US20–US22 gets the new built-in entries (Housing Office, Dean's Office, events, clubs, teachers) */
  if(s.kb)seedKb().forEach(e=>{if((e.id==='housing'||e.id==='deans'||KB_X.includes(e.kind))&&!s.kb.some(x=>x.id===e.id))s.kb.push(e)});
  s.chats=s.chats||{};s.notes=s.notes||[];s.events=s.events||seedEvents();s.ann=s.ann||seedAnn();s.dismiss=s.dismiss||{};s.kb=s.kb||seedKb();
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
/* one student's current-term courses with absences and limit; left < 0 means the limit is exceeded */
function attList(uid){const a=ACCOUNTS[uid]&&ACCOUNTS[uid].acad,m=(st.att&&st.att[uid])||{};
  return a?a.courses.filter(x=>x.term==='f26').map(x=>({c:x.c,t:x.t,abs:m[x.c]||0,lim:ATT_LIM[x.c],left:ATT_LIM[x.c]-(m[x.c]||0)})):[]}
/* absence warnings go to the student's notifications: "close to the limit" (2 or fewer left) and, separately, "limit exceeded".
   One warning per course and absence count, so every new absence near the limit warns again. They are warnings, not reminders, so they are always sent. */
function attCheck(uid){let n=0;
  attList(uid).forEach(x=>{const type=x.left<0?'attover':x.left<=ATT_WARN?'att':null;if(!type)return;
    if(st.notes.some(o=>o.uid===uid&&o.type===type&&o.c===x.c&&o.abs===x.abs))return;
    note(uid,type,{c:x.c,t:x.t,abs:x.abs,lim:x.lim,left:Math.max(x.left,0)});n++});
  if(n)save();return n}
/* staff demo: a teacher marks one more absence; returns the number of warnings sent */
function markAbsence(uid,code){const m=st.att[uid]=st.att[uid]||{};m[code]=(m[code]||0)+1;save();return attCheck(uid)}
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
  /* "Where can I find Clean Code?" is a catalog question, not "the library is not on the map" */
  /* a dormitory problem ("кран сломался в комнате 214") is a housing request, not a campus room; "where is the dormitory" stays a campus question */
  const c=campusIntent(t),q=nluAnalyze(t),dormQ=q.tags.has('housing')&&!WHERE.test(t);
  /* "где кабинет преподавателя" asks about one teacher (US22); "Where are the teachers' offices?" stays a campus question */
  const teachQ=q.tags.has('teacher')&&c&&c.k==='type'&&!/offices|кабинеты|кабинетов|кабинеттер/i.test(t);
  if(c&&!teachQ&&!(c.k==='svc'&&bookSearch(t).length)&&!(dormQ&&c.k!=='rooms'))return{k:'campus',c};
  let T=nluTopic(q);if(T==='ticket'&&q.tags.has('housing'))T='housing';    /* "подать заявку на ремонт в общаге" */
  const rank=kbRank(q,kbLive()),best=rank[0],stu=U.role==='student'||(U.role==='staff'&&STAFF_SELF.includes(T&&TOPICS[T].intent));
  /* two equally strong topics with their own entries ("password and wifi"): ask instead of guessing */
  const top=[...q.tags].filter(([,w])=>w===q.tags.get(T)).map(([k])=>TOPICS[k]);
  const amb=top.length>1&&top.every(tp=>!tp.intent)?top.map(tp=>kbLive().find(x=>x.id===tp.kb)).filter(Boolean):[];
  if(amb.length>1&&!(best&&best.s>=.9))return{k:'dym',list:amb.slice(0,3)};    /* a near-exact question variant still wins */
  /* a ticket number asks about that ticket, not for a new one */
  if(T==='ticket'&&/\b\d{4,6}\b/.test(t))return stu?{k:'h',i:'tkstatus'}:{k:'guest',i:'tkstatus'};
  /* campus events, clubs and teachers (US21, US22): open to everyone */
  const kr=kindRoute(t,q,T);if(kr)return{k:'h',i:kr};
  /* high confidence in a knowledge base entry: answer it (a student still gets the personal answer for registration or billing).
     A question with only a weak word ("office") needs a near-exact variant, otherwise its topic decides */
  if(best&&best.s>=(q.tags.size?NLU_HIGH:q.weak.size?.9:NLU_HIGH))return forEntry(best.e);
  /* "Do you have Clean Code?": a full catalog title (two words or more) is a library question even without a library word */
  if(!T&&bookTitleIn(t))return{k:'h',i:'lib'};
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
  if(mode==='hdesc'){mode=null;return later(()=>housingCard({desc:t,type:hType(t)||'other'},L))}
  const ep=chatEpoch;later(()=>{if(ep===chatEpoch)respond(route(t),L,t)});     /* dropped if the user logged out in the meantime */
}
/* low confidence is logged with the question text for the "Unanswered" list in Analytics */
function respond(r,L,t){
  if(t!=null)curQ=t;          /* handlers read the course or ticket number from curQ; a second question sent quickly must not replace it */
  if(r.k==='campus'){logQ('campus');return H.campus(L,r.c)}
  if(r.k==='kb'){logQ(r.e.intent||'kb:'+r.e.id);return kbAnswer(r.e,L)}
  if(r.k==='h'){logQ(r.i);return U.role==='guest'&&PERSONAL.includes(r.i)?guestOnly(L):H[r.i](L)}
  if(r.k==='guest'){logQ(r.i);return guestOnly(L)}
  if(r.k==='dym'){logQ('dym');
    return bot({text:trL('nlu.dym',L),acts:r.list.map(e=>[kbData(e).q[L][0],()=>respond(forEntry(e),L,t)])},L)}
  logQ('fb',t);H.fb(L)}
/* intents that use a student's own data; a visitor is asked to sign in instead */
const PERSONAL=['reg','bill','adv','ticket','human','tkstatus','remoff','remon','grades','attend','loans','housing','hstatus'];
/* personal intents that also work for a staff account with the staff member's own data (library loans) */
const STAFF_SELF=['loans'];
const kbData=e=>e.vers.find(v=>v.n===e.vn);
/* FAQ and office entries: the bot's general answers, chat suggestions and the FAQ page */
const kbLive=()=>(st.kb||[]).filter(e=>e.status==='published'&&!KB_X.includes(e.kind));
/* published events, clubs or teachers (US21, US22) */
const kbKind=k=>(st.kb||[]).filter(e=>e.status==='published'&&e.kind===k);
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
  trL('of.hours',L,{a:of.open+':00',b:of.close+':00'})].concat(of.tel?[trL('of.phone',L)+': '+of.tel]:[],['Email: '+of.mail])}
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
 /* US17: grades card from the signed-in student's own record; a course code in the question ("INF451", "inf 451") shows that course only */
 grades:L=>{const A=U.acad,code=courseCode(curQ),src=trL('gr.src',L),sum=trL('gr.sum',L,{g:A.gpa.toFixed(2),n:A.cr});
   const dl=dmy(GRADE_DL),one=code&&A.courses.find(x=>x.c===code);
   if(code&&!one)return bot({text:trL('gr.nf',L,{c:code,l:A.courses.map(x=>x.c).join(', ')}),html:gradeCard(A,A.courses,L),src,fb:true},L);
   if(one)return bot({text:one.g?trL('gr.one',L,{c:one.c+' '+one.t,g:one.g,n:one.cr}):trL('gr.npc',L,{c:one.c+' '+one.t,d:dl}),html:gradeCard(A,[one],L),src,fb:true},L);
   bot({title:trL('gr.title',L),text:sum,html:gradeCard(A,A.courses,L),after:A.courses.some(x=>!x.g)?trL('gr.dl',L,{d:dl}):'',src,fb:true},L)},
 /* US18: absences and limit of the signed-in student's current courses, all or the one named in the question */
 attend:L=>{const list=attList(U.login),code=courseCode(curQ),src=trL('att.src',L),one=code&&list.find(x=>x.c===code);
   if(code&&!one)return bot({text:trL('att.nf',L,{c:code,l:list.map(x=>x.c).join(', ')}),html:attCard(list,L),src,fb:true},L);
   if(one)return bot({text:trL('att.one',L,{c:one.c+' '+one.t,a:one.abs,l:one.lim,n:Math.max(one.left,0)}),html:attCard([one],L),after:attWarnText(one,L),src,fb:true},L);
   bot({title:trL('att.title',L),html:attCard(list,L),after:list.map(x=>attWarnText(x,L)).filter(Boolean).join(' '),src,fb:true},L)},
 /* US19: catalog search by title, author or course code; open to visitors */
 lib:L=>{const src=trL('lib.src',L),found=bookSearch(curQ);
   if(!found.length){const q=libQuery(curQ);return bot({text:q?trL('lib.nf',L,{q}):trL('lib.ask',L),src,fb:true},L)}
   if(found.length===1){const b=found[0];return bot({title:b.t,list:bookRows(b,L),src,fb:true},L)}
   bot({title:trL('lib.title',L),list:found.map(b=>({t:bookLine(b,L),cls:b.av?'yes':'no'})),src,fb:true},L)},
 /* US19: the user's own loans with due dates; overdue ones are marked and linked to the library hold */
 loans:L=>{const src=trL('ln.src',L),now=clock(),today=new Date(now.getFullYear(),now.getMonth(),now.getDate());
   const mine=LOANS.filter(x=>x.uid===U.login).map(x=>Object.assign({bk:CATALOG.find(b=>b.id===x.b),late:Math.round((today-new Date(x.due+'T00:00'))/864e5)},x)).sort((a,b)=>a.due<b.due?-1:1);
   if(!mine.length)return bot({text:trL('ln.none',L),src,fb:true},L);
   const over=mine.filter(x=>x.late>0);
   bot({title:trL('ln.title',L),list:mine.map(x=>x.late>0?{t:trL('ln.over',L,{t:x.bk.t,d:dmy(x.due),n:x.late}),cls:'no'}:trL('ln.line',L,{t:x.bk.t,d:dmy(x.due)})),
     after:over.length?trL(U.hold==='library'?'ln.hold':'ln.ret',L):'',src,fb:true},L)},
 /* US20: dormitory repair or housing request; the dormitory and room come from the student's record */
 housing:L=>{const D=U.dorm,src=trL('h.src',L);
   if(!D)return noDorm(L);
   const ty=hType(curQ);if(ty)return housingCard({desc:curQ,type:ty},L);
   bot({text:trL('h.info',L,{d:dormName(D.d,L),r:D.r}),list:myHousing().slice(0,3).map(h=>hLine(h,L)),src,acts:[[trL('h.new',L),()=>newHousing(L)]]},L)},
 hstatus:L=>{const mine=myHousing(),src=trL('h.src',L);
   if(!mine.length)return U.dorm?bot({text:trL('h.none',L),src,acts:[[trL('h.new',L),()=>newHousing(L)]]},L):noDorm(L);
   const h=mine[0];
   bot({text:trL('h.stat',L,{n:'H-'+h.n,t:trL('h.t.'+h.type,L),s:trL('h.st.'+h.status,L),u:dtL(h.upd,L)}),after:mine.length>1?trL('h.older',L):'',list:mine.slice(1,3).map(x=>hLine(x,L)),src,fb:true},L)},
 /* US21: upcoming events for a period (next 7 days, a day, the weekend, next week, all) or one event by its name; past events are never listed as upcoming */
 events:L=>{const src=trL('ev.src',L),now=clock(),hit=bestHits('event',curQ);
   if(hit.length){const e=hit[0],x=kbData(e).x;
     if(evEnd(x)<=now)return bot({text:trL('ev.past',L,{t:kbData(e).q[L][0],d:evDate(x,L)}),src,fb:true},L);
     return evCard(e,L,{fb:true})}
   const up=evUpcoming(),r=evRange(curQ),sel=up.filter(e=>{const x=kbData(e).x;return evStart(x)<r.to&&evEnd(x)>r.from});
   if(!sel.length){
     if(!up.length)return bot({text:trL('ev.noneall',L),src,fb:true},L);
     bot({text:trL('ev.none',L,{r:evRangeText(r,L)}),after:trL('ev.next',L),src,fb:true},L);return evCard(up[0],L)}
   bot({title:evRangeText(r,L,true),text:trL('ev.count',L,{n:sel.length}),src,fb:true},L);
   sel.forEach(e=>evCard(e,L))},
 /* US21: a club by name or topic ("Is there a programming club?"), or the list of clubs */
 clubs:L=>{const src=trL('cl.src',L),all=kbKind('club'),hit=bestHits('club',curQ);
   if(hit.length)return hit.forEach((e,i)=>clubCard(e,L,{fb:!i}));
   const ask=clubAsked(curQ),list=all.map(e=>{const d=kbData(e);return d.q[L][0]+' — '+clubWhen(d.x,L)});
   bot({title:trL('cl.title',L),text:ask?trL('cl.nf',L,{q:ask}):trL('cl.list',L,{n:all.length}),list,src,fb:true,
     acts:all.map(e=>[kbData(e).q[L][0],()=>clubCard(e,L)])},L)},
 /* US22: teacher by name, by course code, or the teachers of the signed-in student's own courses; never a teacher who does not teach the course */
 teacher:L=>{const t=curQ,src=trL('t.src',L),code=courseCode(t),hits=bestHits('teacher',t),my=myCourses();
   const cn=c=>c+(COURSE_T[c]?' '+COURSE_T[c]:''),many=(head,list)=>{if(list.length===1)return tCard(list[0],L,{text:head,fb:true});bot({text:head,src,fb:true},L);list.forEach(e=>tCard(e,L))};
   if(hits.length){
     if(code&&hits.every(e=>!kbData(e).x.courses.includes(code))){const tl=teachersOf(code),n=kbData(hits[0]).q[L][0];
       return tl.length?many(trL('t.no',L,{n,c:cn(code)}),tl):deanNf(trL('t.no0',L,{n,c:cn(code)}),L)}
     return hits.forEach((e,i)=>tCard(e,L,{fb:!i}))}
   if(code){const tl=teachersOf(code);if(!tl.length)return deanNf(trL('t.nfc',L,{c:cn(code)}),L);
     const mine=my.includes(code),k=mine?(tl.length>1?'t.minen':'t.mine1'):my.length&&MYQ.test(t)?'t.notmine':tl.length>1?'t.many':'t.one';
     return many(trL(k,L,{c:cn(code),n:tl.length,l:my.join(', ')}),tl)}
   const nm=teacherAsked(t);if(nm)return deanNf(trL('t.nf',L,{q:nm}),L);
   if(my.length){const tl=[...new Set(my.flatMap(teachersOf))];return many(trL('t.myall',L,{l:my.join(', ')}),tl)}
   bot({text:trL('t.ask',L),src,fb:true},L)},
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
/* course code in a question: 2–4 Latin letters and 3 digits, "INF451", "INF 451", "inf-451" (room ids such as F305 have one letter) */
function courseCode(t){const m=/(^|[^A-Za-z])([A-Za-z]{2,4})\s?-?(\d{3})(?!\d)/.exec(t||'');return m?(m[2]+m[3]).toUpperCase():null}
/* table card: course, grade, credits, then GPA and credits earned */
function gradeCard(A,list,L){
  return '<div class="tw"><table class="bt"><thead><tr><th>'+esc(trL('gr.course',L))+'</th><th>'+esc(trL('gr.grade',L))+'</th><th>'+esc(trL('gr.cr',L))+'</th></tr></thead><tbody>'+
    list.map(x=>'<tr><td><b>'+esc(x.c)+'</b> '+esc(x.t)+'<small>'+esc(trL('gr.t.'+x.term,L))+'</small></td><td>'+(x.g?'<b>'+esc(x.g)+'</b>':'<span class="no">'+esc(trL('gr.np',L))+'</span>')+'</td><td>'+x.cr+'</td></tr>').join('')+
    '</tbody></table></div><div class="kv"><span>GPA <b>'+A.gpa.toFixed(2)+'</b></span><span>'+esc(trL('gr.total',L))+' <b>'+A.cr+'</b></span></div>'}
/* ---------- housing requests (US20) ---------- */
const H_TYPES=['repair','move','other'];
const H_MOVE=/room change|change (my )?room|another room|different room|move (to|out)|roommate|пересел|сменить комнату|поменять комнату|другую комнату|другой комнат|бөлме ауыстыр|бөлмені ауыстыр|бөлмемді ауыстыр|басқа бөлме/i;
const H_REPAIR=/light|lamp|bulb|\btap\b|faucet|leak|broken|break|repair|fix|heat|radiator|socket|outlet|door|lock|window|shower|toilet|sink|drain|свет|ламп|кран|теч|протек|слома|ремонт|почин|отоплен|батаре|розетк|двер|замок|окн|душ|туалет|унитаз|раковин|жарық|шам|сынды|сынған|бұзыл|жөнде|ағып|есік|терезе|құлып/i;
/* suggested request type from the text; null when the text gives no hint */
const hType=t=>H_MOVE.test(t)?'move':H_REPAIR.test(t)?'repair':null;
const dormName=(d,L)=>trL('h.dorm',L,{n:d});
const dtL=(ts,L)=>new Date(ts).toLocaleString(T[L].loc,{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'});
const myHousing=()=>st.housing.filter(h=>h.uid===U.login).sort((a,b)=>b.at-a.at);
const hLine=(h,L)=>trL('h.line',L,{n:'H-'+h.n,t:trL('h.t.'+h.type,L),s:trL('h.st.'+h.status,L),u:dtL(h.upd,L)});
/* a student without a dormitory cannot submit a request: explain and give the Housing Office contacts from the office directory */
function noDorm(L){const of=OFFICE_INFO.housing;
  bot({text:trL('h.nodorm',L),list:officeRows(of,L),after:officeState(of,L).text,src:trL('h.src',L),acts:[[trL('cm.map',L),()=>openMap(of.room)]],fb:true},L)}
function newHousing(L){if(!U.dorm)return noDorm(L);mode='hdesc';bot({text:trL('h.ask',L)},L);$('q').focus()}
/* confirmation card: suggested type, dormitory and room filled in; the type can be changed before confirming */
function housingCard(d,L){const D=U.dorm;if(!D)return noDorm(L);
  bot({title:trL('h.confirmT',L),list:[trL('h.typeL',L)+': '+trL('h.t.'+d.type,L),trL('h.dormL',L)+': '+dormName(D.d,L),trL('h.roomL',L)+': '+D.r,trL('h.descL',L)+': '+d.desc],
    after:trL('h.confirmQ',L),src:trL('h.src',L),
    acts:[[trL('h.confirm',L),()=>makeHousing(d,L)]].concat(H_TYPES.filter(x=>x!==d.type).map(x=>[trL('h.as',L,{t:trL('h.t.'+x,L)}),()=>housingCard({desc:d.desc,type:x},L)]),
      [[trL('h.cancel',L),()=>bot({text:trL('h.cancelled',L)},L)]])},L)}
function makeHousing(d,L){const D=U.dorm,n=Math.max(100,...st.housing.map(h=>h.n))+1,at=Date.now();
  st.housing.push({n,uid:U.login,who:U.name,dorm:D.d,room:D.r,type:d.type,desc:d.desc.slice(0,300),status:'submitted',at,upd:at});save();sync();
  bot({text:trL('h.done',L,{n:'H-'+n,t:trL('h.t.'+d.type,L),d:dormName(D.d,L),r:D.r}),after:trL('h.track',L),src:trL('h.src',L)},L)}
/* staff changes the status (submitted, progress, done): the last update time is saved and the student is notified */
function setHStatus(n,s){const h=st.housing.find(x=>x.n===n);if(!h||h.status===s)return false;
  h.status=s;h.upd=Date.now();note(h.uid,'hreq',{n:h.n,s});save();return true}
/* ---------- campus events, clubs and teachers (US21, US22) ---------- */
const pad2=n=>String(n).padStart(2,'0');
const isoDay=d=>d.getFullYear()+'-'+pad2(d.getMonth()+1)+'-'+pad2(d.getDate());
const today0=()=>{const n=clock();return new Date(n.getFullYear(),n.getMonth(),n.getDate())};
const addDays=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x};
/* the day of an event: a fixed date, the next such weekday (today included) or days from today */
function evDay(x){const d=today0();
  if(x.date)return new Date(x.date+'T00:00');
  if(x.wd!=null)return addDays(d,(x.wd-d.getDay()+7)%7);
  return addDays(d,x.rel||0)}
const atTime=(d,t)=>{const [h,m]=t.split(':'),x=new Date(d);x.setHours(+h,+m,0,0);return x};
const evStart=x=>atTime(evDay(x),x.a),evEnd=x=>atTime(evDay(x),x.b);
/* weekday names from the browser: 15.11.2026 is a Sunday, so 15 + d is weekday d */
const wdName=(d,L,long)=>new Date(2026,10,15+d).toLocaleDateString(T[L].loc,{weekday:long?'long':'short'});
/* dates are written dd.mm.yyyy in every language (the browser's Kazakh format differs between browsers) */
const dmText=d=>pad2(d.getDate())+'.'+pad2(d.getMonth()+1);
const dayText=(d,L)=>wdName(d.getDay(),L)+', '+dmText(d)+'.'+d.getFullYear();
const evDate=(x,L)=>dayText(evDay(x),L);
/* upcoming = not finished yet (an event that is on right now is still upcoming); earliest first */
const evUpcoming=()=>{const now=clock();return kbKind('event').filter(e=>evEnd(kbData(e).x)>now).sort((a,b)=>evStart(kbData(a).x)-evStart(kbData(b).x))};
/* period named in the question; "this week" is today and the next 6 days */
const DAYRE=[[1,/monday|понедельник|дүйсенбі|дуйсенби|ponedelnik|duisenbi/i],[2,/tuesday|вторник|сейсенбі|сейсенби|vtornik|seisenbi/i],
  [3,/wednesday|(^|[^а-яё])сред[уаы]([^а-яё]|$)|сәрсенбі|сарсенби|sredu|sreda|sarsenbi/i],[4,/thursday|четверг|бейсенбі|бейсенби|chetverg|beisenbi/i],
  [5,/friday|пятниц|жұма|жума|pyatnic|zhuma/i],[6,/saturday|суббот|(^|[^а-яәіңғүұқөһ])сенб[іи]|subbot|(^|[^a-z])senbi/i],[0,/sunday|воскресень|жексенбі|жексенби|voskresen|zheksenbi/i]];
const TODAYRE=/today|tonight|сегодня|бүгін|бугин|segodnya|bugin/i,TMRWRE=/tomorrow|завтра|ертең|ертен|zavtra|erten/i,WKNDRE=/weekend|выходн|демалыс|vyhodn/i,
  NEXTWRE=/next week|следующ[а-яё]* недел|келесі апта|келеси апта|kelesi apta|sleduyushch/i,THISWRE=/week|недел|апта|apta|nedel/i;
const DAYANY=t=>[TODAYRE,TMRWRE,WKNDRE,NEXTWRE,THISWRE].some(r=>r.test(t))||DAYRE.some(([,r])=>r.test(t));
function evRange(t){const d=today0();
  if(NEXTWRE.test(t)){const f=addDays(d,((8-d.getDay())%7)||7);return{k:'next',from:f,to:addDays(f,7)}}
  if(WKNDRE.test(t)){const w=d.getDay(),f=w===0||w===6?d:addDays(d,6-w);return{k:'wknd',from:f,to:addDays(f,f.getDay()===6?2:1)}}
  if(TODAYRE.test(t))return{k:'day',from:d,to:addDays(d,1)};
  if(TMRWRE.test(t))return{k:'day',from:addDays(d,1),to:addDays(d,2)};
  const wd=DAYRE.find(([,re])=>re.test(t));if(wd){const f=addDays(d,(wd[0]-d.getDay()+7)%7);return{k:'day',from:f,to:addDays(f,1)}}
  if(THISWRE.test(t))return{k:'week',from:d,to:addDays(d,7)};
  return{k:'all',from:d,to:new Date(8.64e15)}}
/* heading of the list, or the period alone for "no events in …" */
function evRangeText(r,L,head){const a=dmText(r.from),b=dmText(addDays(r.to,-1));
  if(r.k==='day')return head?trL('ev.h.day',L,{d:dayText(r.from,L)}):dayText(r.from,L);
  if(r.k==='all')return head?trL('ev.h.all',L):'';
  return head?trL('ev.h.'+r.k,L,{a,b}):a+'–'+b}
/* a place of the campus map with its type and building */
function placeText(id,L){const r=CAMPUS.get(id);if(!r)return id;const t=trL('cm.t.'+r.t,L).toLowerCase();
  return r.barrel?trL('pl.br',L,{r:id,t}):r.f?trL('pl.f',L,{r:id,t,b:r.b,f:r.f}):trL('pl.b',L,{r:id,t,b:r.b})}
/* registrations stay inside the site: per account in the demo data, for a visitor only until the page is closed */
let guestReg=[];
const evRegs=()=>U.role==='guest'?guestReg:((st.evreg=st.evreg||{})[U.login]=st.evreg[U.login]||[]);
function evCard(e,L,o){o=o||{};const d=kbData(e),x=d.x,reg=evRegs().includes(e.id);
  bot({title:d.q[L][0],text:d.a[L],list:[trL('ev.date',L)+': '+evDate(x,L),trL('ev.time',L)+': '+x.a+'–'+x.b,trL('ev.place',L)+': '+placeText(x.place,L)]
      .concat(reg?[{t:trL('ev.youreg',L),cls:'yes'}]:[]),
    src:trL('ev.src',L),fb:!!o.fb,acts:[[trL(reg?'ev.regd':'ev.reg',L),()=>evRegister(e,L)],[trL('cm.map',L),()=>openMap(x.place)]]},L)}
function evRegister(e,L){const d=kbData(e),x=d.x,t=d.q[L][0],src=trL('ev.src',L),acts=[[trL('cm.map',L),()=>openMap(x.place)]];
  if(evEnd(x)<=clock())return bot({text:trL('ev.closed',L,{t}),src},L);
  const r=evRegs();if(r.includes(e.id))return bot({text:trL('ev.already',L,{t}),acts,src},L);
  r.push(e.id);if(U.role!=='guest')save();
  bot({text:trL('ev.ok',L,{t,d:evDate(x,L),h:x.a+'–'+x.b,p:placeText(x.place,L)}),after:U.role==='guest'?trL('ev.guest',L):'',acts,src},L)}
const clubWhen=(x,L)=>wdName(x.wd,L,true)+', '+x.a+'–'+x.b+' · '+x.place;
function clubCard(e,L,o){const d=kbData(e),x=d.x;
  bot({title:d.q[L][0],text:d.a[L],list:[trL('cl.meets',L)+': '+wdName(x.wd,L,true)+', '+x.a+'–'+x.b,trL('ev.place',L)+': '+placeText(x.place,L),trL('cl.contact',L)+': '+x.who+', '+x.mail],
    src:trL('cl.src',L),fb:!!(o&&o.fb),acts:[[trL('cm.map',L),()=>openMap(x.place)]]},L)}
/* how well a question names an entry. Events and clubs: the longest title or keyword line whose words all appear in the question.
   Teachers: the surname (last word of a name line). Word endings and 1–2 typos are allowed ("хакатоне", "Демовой", "программирования"). */
const lineWords=s=>nluToks(s).filter(w=>w.length>=3&&!NSTOP.has(w));
const nearW=(t,w)=>t===w||(w.length>=4&&t.startsWith(w)&&t.length-w.length<=5)||(w.length>=5&&Math.abs(t.length-w.length)<=2&&lev(t,w,w.length>=7?2:1)<=(w.length>=7?2:1));
/* Russian forms of a surname ending in -a: "Демовой", "Демову" */
const surnameForm=(t,w)=>w.length>=5&&/а$/.test(w)&&t.startsWith(w.slice(0,-1))&&Math.abs(t.length-w.length)<=2;
function hitScore(e,toks){const d=kbData(e);let best=0;
  LANGS.forEach(l=>(d.q[l]||[]).forEach(s=>{const w=lineWords(s);if(!w.length)return;
    if(e.kind==='teacher'){const sn=w[w.length-1];if(sn.length>=4&&toks.some(t=>nearW(t,sn)||surnameForm(t,sn)))best=1}
    else if(w.every(x=>toks.some(t=>nearW(t,x))))best=Math.max(best,w.length)}));
  return best}
function bestHits(kind,t){const toks=nluToks(t),sc=kbKind(kind).map(e=>[e,hitScore(e,toks)]).filter(x=>x[1]>0),max=Math.max(0,...sc.map(x=>x[1]));
  return sc.filter(x=>x[1]===max).map(x=>x[0])}
const topHit=(kind,t)=>{const toks=nluToks(t);return Math.max(0,...kbKind(kind).map(e=>hitScore(e,toks)))};
/* which handler, if any, a question about events, clubs or teachers goes to */
const CONSULT=/консульт|consult|konsult|кеңес бер/i;
const WHATON=/what'?s on|what is on|what is happening|what'?s happening|что (будет|проходит|интересного)|чем заняться|не болады|не өтеді|chto budet|ne bolady/i;
function kindRoute(t,q,T){const strong=q.tags.size>0;
  if(T==='teacher'||(T==='adv'&&CONSULT.test(t)&&courseCode(t)))return 'teacher';   /* "консультация по INF451"; "консультация" alone stays with the advisor */
  if(T==='events'||T==='clubs')return T;
  if(T!=='lib'&&topHit('teacher',t))return 'teacher';                                 /* a teacher's surname */
  if((!strong||T==='reg')&&!bookTitleIn(t)){const e=topHit('event',t),c=topHit('club',t);if(e||c)return e>=c?'events':'clubs'}   /* "register for the hackathon" */
  if(!strong&&WHATON.test(t)&&(DAYANY(t)||/campus|кампус|kampus/i.test(t)))return 'events';                                      /* "что будет в пятницу" */
  return null}
/* subject of a club question that matched no club ("Is there a dance club?" -> "dance") */
const CLUB_GEN=new Set('student students university campus join any there студенческий студенческие студентов студент университет кампус вступить студенттік университет кампус'.split(' ').map(nluFold));
function clubAsked(t){const w=nluAnalyze(t).words.filter(x=>!CLUB_GEN.has(x)&&!KK_LAT.has(x));if(!w.length)return null;
  const ws=t.match(/\p{L}[\p{L}'’-]*/gu)||[];return ws.filter(x=>w.includes(nluToks(x)[0])).join(' ')||w.join(' ')}
const teachersOf=code=>kbKind('teacher').filter(e=>kbData(e).x.courses.includes(code));
/* the signed-in student's current schedule */
const myCourses=()=>U&&U.role==='student'&&U.acad?U.acad.courses.filter(x=>x.term==='f26').map(x=>x.c):[];
const MYQ=/(^|[^\p{L}])(my|мой|моя|моего|моих|мои|моему|менің|менин|moi|moy)([^\p{L}]|$)|\p{L}(ым|ім)([^\p{L}]|$)/iu;
/* a teacher name that is not in the directory: a capitalised word not explained by any topic, or the word after "Dr" / "преподаватель" */
const T_CUE=/^(dr|prof|professor|mr|mrs|ms|профессор|доктор|преподавател\p{L}*|препод\p{L}*|учител\p{L}*|оқытушы\p{L}*|мұғалім\p{L}*|named|зовут)$/iu;
const T_GEN=new Set(('email mail почта пошта room office hours show tell give find need help hello thanks покажи скажи дай найди нужна нужен кто такой такая '+
  'спасибо здравствуйте көрсет көрсетіңіз кім қай рахмет').split(' ').map(nluFold));
function teacherAsked(t){const q=nluAnalyze(t),ws=t.match(/\p{L}[\p{L}'’-]*/gu)||[];
  for(let i=0;i<ws.length;i++){const w=ws[i],k=nluToks(w)[0];if(!k||!q.words.includes(k)||T_GEN.has(k)||courseCode(w))continue;
    if(/^\p{Lu}/u.test(w)||(i>0&&T_CUE.test(ws[i-1])))return w.replace(/['’]s$/,'')}
  return null}
const ohText=(oh,L)=>oh.map(h=>wdName(h.d,L)+' '+h.a+'–'+h.b).join(', ');
/* teacher card: courses, email, office on the map, office hours. No phone. */
function tCard(e,L,o){o=o||{};const d=kbData(e),x=d.x,r=CAMPUS.get(x.room),name=d.q[L][0];
  bot(Object.assign(o.text?{text:o.text,html:'<b class="t">'+esc(name)+'</b>'}:{title:name},{
    list:[trL('t.courses',L)+': '+x.courses.map(c=>c+(COURSE_T[c]?' '+COURSE_T[c]:'')).join(', '),'Email: '+x.mail,
      trL('t.room',L,{r:x.room,b:r?r.b:'',f:r?r.f:''}),trL('t.oh',L)+': '+ohText(x.oh,L)],
    after:d.a[L],src:trL('t.src',L),fb:!!o.fb,acts:[[trL('cm.map',L),()=>openMap(x.room)]]}),L)}
/* teacher or course not in the directory: the Dean's Office from the office directory (room, hours, email; no phone) */
function deanNf(text,L){const of=OFFICE_INFO.deans;
  bot({text,list:officeRows(of,L),after:officeState(of,L).text,src:trL('t.src',L),acts:[[trL('cm.map',L),()=>openMap(of.room)]],fb:true},L)}
/* attendance card: course, absences, limit, absences left */
function attCard(list,L){
  return '<div class="tw"><table class="bt"><thead><tr><th>'+esc(trL('gr.course',L))+'</th><th>'+esc(trL('att.abs',L))+'</th><th>'+esc(trL('att.lim',L))+'</th><th>'+esc(trL('att.left',L))+'</th></tr></thead><tbody>'+
    list.map(x=>'<tr><td><b>'+esc(x.c)+'</b> '+esc(x.t)+'</td><td>'+x.abs+'</td><td>'+x.lim+'</td><td'+(x.left<=ATT_WARN?' class="no"':'')+'>'+(x.left<0?esc(trL('att.over',L)):x.left)+'</td></tr>').join('')+
    '</tbody></table></div>'}
function attWarnText(x,L){const c=x.c+' '+x.t;
  return x.left<0?trL('att.w.over',L,{c,a:x.abs,l:x.lim}):x.left===0?trL('att.w.0',L,{c,l:x.lim}):x.left<=ATT_WARN?trL('att.w',L,{c,n:x.left,l:x.lim}):''}
/* catalog search: a course code lists that course's books; otherwise books whose title words (or an author's name) appear in the question, best match first */
const libWords=t=>nluToks(t).filter(w=>w.length>=3&&!NSTOP.has(w));
function bookSearch(t){
  const code=courseCode(t);if(code){const l=CATALOG.filter(b=>b.c===code);if(l.length)return l}
  const qw=libWords(t);if(!qw.length)return[];
  const hit=w=>qw.some(x=>x===w||(w.length>=5&&x.length>=5&&lev(x,w,1)<=1));
  const sc=CATALOG.map(b=>{const tw=libWords(b.t),th=tw.filter(hit).length,ah=nluToks(b.a).some(w=>w.length>=4&&hit(w));
    return[b,th===tw.length?10+th:th?th:ah?1:0]}).filter(x=>x[1]>0);
  const max=Math.max(0,...sc.map(x=>x[1]));return sc.filter(x=>x[1]===max).map(x=>x[0])}
const bookTitleIn=t=>{const qw=libWords(t);return CATALOG.some(b=>{const tw=libWords(b.t);return tw.length>=2&&tw.every(w=>qw.includes(w))})};
/* what the user searched for, for "not found": content words that are not library words */
const libQuery=t=>nluAnalyze(t).words.filter(w=>!KK_LAT.has(w)).join(' ');
function bookRows(b,L){return[trL('lib.author',L)+': '+b.a,trL('gr.course',L)+': '+b.c,
  b.av?{t:trL('lib.av',L,{n:b.av,m:b.n}),cls:'yes'}:{t:trL('lib.nav',L,{m:b.n,d:dmy(b.next)}),cls:'no'},trL('lib.shelf',L,{s:b.sh})]}
const bookLine=(b,L)=>b.t+' — '+b.a+' ('+b.c+'): '+(b.av?trL('lib.av',L,{n:b.av,m:b.n}):trL('lib.nav',L,{m:b.n,d:dmy(b.next)}))+' · '+trL('lib.shelf',L,{s:b.sh});
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

