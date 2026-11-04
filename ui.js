/* Interface: views, home, tickets, staff board, analytics, FAQ, About, notifications, language, theme, login. */
const yearLbl=n=>tr('year',{n:ui==='en'?n+['th','st','nd','rd'][n<4?n:0]:n});
const chip=s=>'<span class="chip'+({Open:' warn','In progress':' prog',Resolved:' done'}[s]||'')+'">'+esc(tr('st.'+s))+'</span>';
const dt=ts=>new Date(ts).toLocaleString(T[ui].loc,{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'});
const noteText=n=>n.type==='reply'?tr('n.reply',{n:n.n}):n.type==='status'?tr('n.status',{n:n.n,s:tr('st.'+n.s)}):
  n.type==='appt'?tr('n.appt',{w:fmt(n.at,ui)}):tr('n.appt2',{w:fmt(n.at,ui)});

/* ---------- views ---------- */
const VIEWS=['home','chat','tickets','appts','campus','faq','staff','review','analytics','ann','about'];
const stars=n=>'★'.repeat(n)+'☆'.repeat(5-n);
/* priority and SLA: first reply is due 24 h after creation; tickets that are resolved or already answered have no SLA */
const PRIO=['high','medium','low'],SLA=24*3600e3;
const prio=t=>t.priority||'medium';
const byPrio=(a,b)=>PRIO.indexOf(prio(a))-PRIO.indexOf(prio(b))||a.at-b.at;
const slaOpen=t=>t.status!=='Resolved'&&!(t.replies&&t.replies.length);
const isOverdue=t=>slaOpen(t)&&t.at+SLA<Date.now();
function slaLabel(t){
  if(!slaOpen(t))return '';
  const left=t.at+SLA-Date.now();
  if(left<=0)return '<span class="sla over">'+tr('sla.over')+'</span>';
  return '<span class="sla'+(left<4*3600e3?' soon':'')+'">'+(left<3600e3?tr('sla.m',{n:Math.max(1,Math.floor(left/60000))}):tr('sla.h',{n:Math.floor(left/3600e3)}))+'</span>';
}
function show(v){
  VIEWS.forEach(x=>{$('v-'+x).hidden=x!==v;const b=$('nav-'+x);if(b)x===v?b.setAttribute('aria-current','page'):b.removeAttribute('aria-current')});
  document.querySelector('.bar').classList.remove('open');$('menu-btn').setAttribute('aria-expanded','false');
  if(v==='chat')$('q').focus();
}
function ask(t){show('chat');userMsg(t);answer(t)}

/* ---------- sync: re-render everything that depends on data or language ---------- */
function sync(){
  const stu=U&&U.role==='student',mine=stu?st.tickets.filter(isMine):[],ap=stu?myAppts():[];
  if(stu)ap.forEach(a=>{const d=a.at-Date.now();if(d>0&&d<864e5&&!a.rem){a.rem=1;note(U.login,'appt2',{at:a.at});save()}});
  $('c-t').textContent=mine.length;$('c-a').textContent=ap.length;
  renderHome(mine,ap);
  $('tickets').innerHTML=mine.length?'<div class="tw"><table><thead><tr><th>'+tr('th.ticket')+'</th><th>'+tr('th.office')+'</th><th>'+tr('th.problem')+'</th><th>'+tr('th.created')+'</th><th>'+tr('th.status')+'</th></tr></thead><tbody>'+
    mine.map(t=>{const r=(t.replies||[]).slice(-1)[0];
      return '<tr id="tk-'+t.n+'"><td class="mono">#'+t.n+'</td><td>'+esc(t.office)+'</td><td>'+esc(t.desc)+(r?'<div class="reply-note"><b>'+tr('tk.reply')+'</b> '+esc(r.text)+'</div>':'')+rateBlock(t)+'</td><td>'+new Date(t.at).toLocaleDateString(T[ui].loc)+'</td><td>'+chip(t.status)+'</td></tr>'}).join('')+'</tbody></table></div>'
    :'<div class="empty">'+tr('tk.none')+'</div>';
  $('appts').innerHTML=ap.length?'<div class="tw"><table><thead><tr><th>'+tr('th.when')+'</th><th>'+tr('th.with')+'</th><th>'+tr('th.rem')+'</th><th></th></tr></thead><tbody>'+
    ap.map(a=>'<tr id="ap-'+a.at+'"><td>'+fmt(a.at,ui)+'</td><td>'+esc(a.with)+'</td><td>'+tr('ap.before')+'</td><td><button class="link" data-cancel="'+st.appts.indexOf(a)+'">'+tr('ap.cancel')+'</button></td></tr>').join('')+'</tbody></table></div>'
    :'<div class="empty">'+tr('ap.none')+'</div>';
  document.querySelectorAll('[data-cancel]').forEach(b=>b.onclick=()=>{st.appts.splice(+b.dataset.cancel,1);save();sync()});
  renderStaff();renderReview();renderAnalytics();renderFaq();renderBell();renderAnn();renderBanners();renderCampus();
}

/* ---------- campus map page: schematic SVG, colours by room type, selection highlights building / barrel and floor ---------- */
let campus={b:null,room:null,f:null,nf:null};
function campusSelect(id){
  const r=CAMPUS.get(id);
  campus=r?{b:r.b,room:id,f:r.f,nf:null}:{b:null,room:null,f:null,nf:id};
}
function openMap(id){
  if(id)campusSelect(id);
  $('cm-q').value=id||'';
  renderCampus();show('campus');
}
function campusSvg(){
  const bw=150,bh=146,x0=250,y0=24,gx=170,gy=166;
  const roomsOf=(b,f)=>[...CAMPUS.values()].filter(r=>r.b===b&&r.f===f);
  let s='<svg viewBox="0 0 770 350" class="campus" role="img" aria-label="'+esc(tr('cm.title'))+'">';
  /* barrels */
  s+='<rect class="zone" x="6" y="6" width="226" height="238" rx="6"/><text class="zt" x="18" y="28">'+tr('cm.barrels')+'</text>';
  ['A1','A2','B1','B2','C1','C2'].forEach((id,i)=>{
    const x=16+(i%2)*108,y=44+Math.floor(i/2)*66;
    s+='<g class="brl'+(campus.room===id?' sel':'')+'" data-r="'+id+'" tabindex="0" role="button" aria-label="'+id+'"><rect class="seg lecture" x="'+x+'" y="'+y+'" width="96" height="54" rx="27"/><text class="bt" x="'+(x+48)+'" y="'+(y+33)+'" text-anchor="middle">'+id+'</text></g>'});
  /* buildings D–I, three floors each; a band is split into segments by room type */
  CAMPUS_BLDS.forEach((b,i)=>{
    const x=x0+(i%3)*gx,y=y0+Math.floor(i/3)*gy,sel=campus.b===b&&!campus.room;
    s+='<g class="bld'+(campus.b===b?' sel':'')+'" data-b="'+b+'" tabindex="0" role="button" aria-label="'+esc(tr('cm.building'))+' '+b+'"><rect class="frame" x="'+x+'" y="'+y+'" width="'+bw+'" height="'+bh+'" rx="6"/>'+
      '<text class="bl-t" x="'+(x+12)+'" y="'+(y+21)+'">'+b+'</text>';
    if(b==='H')s+='<rect class="seg lecture" x="'+(x+56)+'" y="'+(y+6)+'" width="86" height="18" rx="3"/><text class="tab-t" x="'+(x+99)+'" y="'+(y+19)+'" text-anchor="middle">H01–H03</text>';
    [3,2,1].forEach((f,k)=>{
      const fy=y+32+k*38,rooms=roomsOf(b,f);let cx=x+22;const inner=bw-30;
      s+='<g class="fl'+(campus.b===b&&campus.f===f?' sel':'')+'"><text class="fl-n" x="'+(x+10)+'" y="'+(fy+21)+'">'+f+'</text>';
      CAMPUS_TYPES.forEach(t=>{const n=rooms.filter(r=>r.t===t).length;if(!n)return;
        const w=inner*n/rooms.length;s+='<rect class="seg '+t+'" x="'+cx.toFixed(1)+'" y="'+fy+'" width="'+Math.max(w-2,2).toFixed(1)+'" height="30" rx="3"/>';cx+=w});
      s+='<rect class="fb" x="'+(x+4)+'" y="'+(fy-3)+'" width="'+(bw-8)+'" height="36" rx="4"/></g>'});
    s+='</g>'});
  return s+'</svg>'}
function renderCampus(){
  $('cm-svg').innerHTML=campusSvg();
  const p=$('cm-panel'),chip=r=>'<button type="button" class="rm '+r.t+'" data-r="'+r.id+'">'+esc(r.id)+'</button>';
  const typeName=r=>tr('cm.t.'+r.t)+(r.barrel?' ('+tr('cm.t.barrel')+')':'');
  if(campus.nf){p.innerHTML='<div class="cmcard nf"><p>'+esc(tr('cm.nf',{r:campus.nf}))+'</p></div>';return}
  if(campus.room){const r=CAMPUS.get(campus.room);
    const hint=r.barrel?tr('cm.hint.barrel',{id:r.id}):r.f?tr('cm.hint.floor',{b:r.b,f:r.f,r:floorSummary(r.b,r.f,ui)}):tr('cm.hint.nofloor',{id:r.id,b:r.b});
    p.innerHTML='<div class="cmcard"><h3>'+esc(r.id)+'</h3><dl>'+
      (r.b?'<dt>'+tr('cm.building')+'</dt><dd>'+r.b+'</dd>':'')+(r.f?'<dt>'+tr('cm.floor')+'</dt><dd>'+r.f+'</dd>':'')+
      '<dt>'+tr('cm.type')+'</dt><dd><i class="sw '+r.t+'"></i> '+esc(typeName(r))+'</dd></dl><p>'+esc(hint)+'</p></div>';return}
  if(campus.b){const rooms=[...CAMPUS.values()].filter(r=>r.b===campus.b);
    const nofl=rooms.filter(r=>!r.f);
    p.innerHTML='<div class="cmcard"><h3>'+tr('cm.building')+' '+campus.b+'</h3>'+
      [3,2,1].map(f=>{const rs=rooms.filter(r=>r.f===f);return rs.length?'<div class="cmfl"><b>'+tr('cm.fl',{n:f})+'</b><div class="chips">'+rs.map(chip).join('')+'</div></div>':''}).join('')+
      (nofl.length?'<div class="cmfl"><b>'+tr('cm.p.lecture').replace(/^./,c=>c.toUpperCase())+'</b><div class="chips">'+nofl.map(chip).join('')+'</div></div>':'')+'</div>';return}
  p.innerHTML='<div class="cmcard"><p>'+esc(tr('cm.pick'))+'</p></div>';
}
$('cm-svg').onclick=e=>{const g=e.target.closest('[data-r],[data-b]');if(!g)return;
  if(g.dataset.r)campusSelect(g.dataset.r);else campus={b:g.dataset.b,room:null,f:null,nf:null};
  $('cm-q').value=g.dataset.r||'';renderCampus()};
$('cm-svg').onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.target.closest&&e.target.closest('[data-r],[data-b]')&&e.target.closest('[data-r],[data-b]').dispatchEvent(new MouseEvent('click',{bubbles:true}))}};
$('cm-panel').onclick=e=>{const b=e.target.closest('[data-r]');if(b){campusSelect(b.dataset.r);$('cm-q').value=b.dataset.r;renderCampus()}};
$('cm-form').onsubmit=e=>{e.preventDefault();
  const v=$('cm-q').value.trim();
  if(!v){campus={b:null,room:null,f:null,nf:null};renderCampus();return}
  const t=roomTokens(v,true);campusSelect(t[0]||v.toUpperCase());renderCampus()};

/* ---------- rating of resolved tickets ---------- */
function rateBlock(t){
  if(t.status!=='Resolved')return '';
  if(t.rating)return '<div class="rated"><b>'+tr('rate.yours')+'</b> <span class="stars">'+stars(t.rating.stars)+'</span>'+(t.rating.comment?'<p>'+esc(t.rating.comment)+'</p>':'')+'</div>';
  return '<form class="rate" data-n="'+t.n+'"><b>'+tr('rate.title')+'</b><div class="starpick" role="group" aria-label="'+esc(tr('rate.title'))+'">'+
    [1,2,3,4,5].map(i=>'<button type="button" class="star" data-v="'+i+'" aria-label="'+esc(tr('rate.star',{n:i}))+'" aria-pressed="false">★</button>').join('')+'</div>'+
    '<textarea rows="2" placeholder="'+esc(tr('rate.ph'))+'" aria-label="'+esc(tr('rate.ph'))+'"></textarea><div class="rerr" role="alert" hidden>'+tr('rate.pick')+'</div>'+
    '<button type="submit" class="primary sm">'+tr('rate.send')+'</button></form>';
}
$('tickets').onclick=e=>{const s=e.target.closest('.star');if(!s)return;
  const f=s.closest('form'),v=+s.dataset.v;f.dataset.v=v;
  f.querySelectorAll('.star').forEach(b=>{b.classList.toggle('on',+b.dataset.v<=v);b.setAttribute('aria-pressed',String(+b.dataset.v===v))});
  f.querySelector('.rerr').hidden=true};
$('tickets').onsubmit=e=>{e.preventDefault();const f=e.target,v=+f.dataset.v;
  if(!v){f.querySelector('.rerr').hidden=false;return}
  const t=st.tickets.find(x=>x.n===+f.dataset.n);if(!t)return;
  t.rating={stars:v,comment:f.querySelector('textarea').value.trim(),at:Date.now()};save();sync()};

/* ---------- home dashboard, built from the logged-in student's data ---------- */
function renderHome(mine,ap){
  if(!U||U.role!=='student')return;
  const b=U.tuition-U.paid,nw=s=>'<span class="nw">'+s+'</span>',next=ap[0];
  $('hello').textContent=tr('home.hello',{n:U.first});
  $('home-sub').textContent=U.major+', '+yearLbl(U.year)+' · ID '+U.id;
  $('tile-pay-t').textContent=tr(U.grant?'t.grant':'t.pay');
  $('tile-pay-s').textContent=tr(U.grant?'t.grant.s':'t.pay.s');
  $('tile-pay').dataset.qk=U.grant?'q.grant':'q.pay';
  $('stats').innerHTML=
    (U.grant?'<div class="stat ok"><span class="k">'+tr('stat.grantk')+'</span><b class="v">'+tr('stat.grantv')+'</b><span class="s">'+tr('stat.grants')+'</span></div>'
    :'<div class="stat"><span class="k">'+tr('stat.bal')+'</span><b class="v nw">'+(b?money(b):tr('stat.paidfull'))+'</b><span class="s">'+
      (b?tr('stat.payby',{d:nw(dmy(U.due)),p:nw(money(U.paid)),t:nw(money(U.tuition))}):tr('stat.paidnote',{t:nw(money(U.tuition))}))+'</span></div>')+
    (U.hold?'<div class="stat alert"><span class="k">'+tr('stat.holdk')+'</span><b class="v">'+tr('hold.'+U.hold)+'</b><span class="s">'+tr('hold.'+U.hold+'.s')+'</span></div>'
       :'<div class="stat ok"><span class="k">'+tr('stat.holdk')+'</span><b class="v">'+tr('stat.holdnone')+'</b><span class="s">'+tr('stat.holdnones')+'</span></div>')+
    '<div class="stat"><span class="k">'+tr('stat.nextk')+'</span><b class="v small">'+(next?fmt(next.at,ui):tr('stat.none'))+'</b><span class="s">'+esc(tr('stat.adv',{a:U.advisor}))+'</span></div>'+
    '<div class="stat"><span class="k">'+tr('stat.openk')+'</span><b class="v">'+mine.filter(t=>t.status!=='Resolved').length+'</b><button type="button" class="textbtn" data-goto="tickets">'+tr('stat.viewt')+'</button></div>';
  const dl=[[new Date('2026-11-16T00:00').getTime(),tr('dl.reg'),tr('dl.win')],
            [new Date('2027-01-23T00:00').getTime(),tr('dl.add'),tr('dl.spring')]];
  if(b)dl.push([new Date(U.due+'T00:00').getTime(),tr('dl.pay'),tr('dl.due',{m:money(b)})]);
  if(next)dl.push([new Date(next.at).setHours(0,0,0,0),tr('dl.adv'),fmt(next.at,ui)+' · '+U.advisor]);
  $('deadlines').innerHTML=dl.sort((x,y)=>x[0]-y[0]).slice(0,4).map(([t,h,s])=>'<li><div class="dd"><b>'+new Date(t).getDate()+'</b><span>'+
    new Date(t).toLocaleDateString(T[ui].loc,{month:'short'})+'</span></div><div><b>'+esc(h)+'</b><span>'+esc(s)+'</span></div></li>').join('');
  const rec=mine.slice().sort((x,y)=>y.at-x.at).slice(0,2);
  $('recent').innerHTML=(rec.length?rec.map(t=>'<div class="rt"><div><span class="mono">#'+t.n+'</span> '+chip(t.status)+'<p>'+esc(t.desc)+'</p><span class="m">'+esc(t.office)+' · '+dt(t.at)+'</span></div></div>').join('')
    :'<div class="empty">'+tr('rec.none')+'</div>')+'<button type="button" class="textbtn" data-goto="tickets">'+tr('rec.all')+'</button>';
}

/* ---------- staff: kanban board with a ticket drawer ---------- */
let sel=null, shown=null;
function renderStaff(){
  const keep=shown===sel&&$('reply')?$('reply').value:'';
  const all=st.tickets.slice().sort((a,b)=>b.at-a.at);
  $('c-s').textContent=all.filter(t=>t.status!=='Resolved').length;
  $('s-board').innerHTML=STATUS.map(s=>{const col=all.filter(t=>t.status===s).sort(byPrio);
    return '<section class="col" data-s="'+s.replace(' ','-')+'"><h3>'+tr('st.'+s)+' <span class="count">'+col.length+'</span></h3>'+
      (col.length?col.map(t=>'<button type="button" class="tk'+(t.n===sel?' sel':'')+'" data-p="'+prio(t)+'" data-n="'+t.n+'"><span class="tkh"><span class="mono">#'+t.n+'</span><span class="prio '+prio(t)+'">'+tr('prio.'+prio(t))+'</span>'+slaLabel(t)+'</span><b class="nm">'+avatar(t.who)+esc(t.who)+'</b>'+
        '<span class="d">'+esc(t.desc)+'</span><span class="m">ID '+esc(t.uid||'')+' · '+esc(t.office)+' · '+dt(t.at)+((t.replies||[]).length?' · '+tr('d.repl',{n:t.replies.length}):'')+'</span></button>').join(''):'<div class="none">'+tr('bd.none')+'</div>')+'</section>'}).join('');
  const t=st.tickets.find(x=>x.n===sel);
  $('s-detail').hidden=$('s-scrim').hidden=!t;
  $('s-detail').innerHTML=t?detail(t):'';
  if(t&&shown!==sel)$('s-detail').scrollTop=0;
  shown=t?sel:null;
  if(t&&keep)$('reply').value=keep;
}
function detail(t){
  return '<div class="panel"><div class="ph"><h3>'+tr('d.ticket',{n:t.n})+'</h3><button type="button" class="ghost x" data-close aria-label="'+tr('d.close')+'">×</button></div>'+
    '<div class="meta"><span>'+tr('d.student')+': <b>'+esc(t.who)+'</b> · ID '+esc(t.uid||'')+'</span><span>'+tr('th.office')+': <b>'+esc(t.office)+'</b></span><span>'+tr('th.created')+': <b>'+dt(t.at)+'</b></span>'+(slaOpen(t)?'<span>'+tr('sla.due')+': '+slaLabel(t)+'</span>':'')+'</div>'+
    '<div class="selrow"><label class="fld inline" for="s-prio">'+tr('prio.label')+'<select id="s-prio">'+PRIO.map(p=>'<option value="'+p+'"'+(p===prio(t)?' selected':'')+'>'+tr('prio.'+p)+'</option>').join('')+'</select></label>'+
    '<label class="fld inline" for="s-status">'+tr('th.status')+'<select id="s-status">'+STATUS.map(s=>'<option value="'+s+'"'+(s===t.status?' selected':'')+'>'+tr('st.'+s)+'</option>').join('')+'</select></label></div>'+
    '<div class="thread"><div class="msg"><b>'+esc(t.who)+'</b><span>'+dt(t.at)+'</span><p>'+esc(t.desc)+'</p></div>'+
    (t.replies||[]).map(r=>'<div class="msg staff"><b>'+tr('d.staff')+'</b><span>'+dt(r.at)+'</span><p>'+esc(r.text)+'</p></div>').join('')+'</div>'+
    (t.rating?'<div class="rated"><b>'+tr('rate.theirs')+'</b> <span class="stars">'+stars(t.rating.stars)+'</span>'+(t.rating.comment?'<p>'+esc(t.rating.comment)+'</p>':'')+'</div>':'')+
    '<form id="s-form"><label class="fld" for="reply">'+tr('d.reply')+'<textarea id="reply" required placeholder="'+esc(tr('d.ph'))+'"></textarea></label>'+
    '<div class="btns"><button type="submit" class="primary">'+tr('d.send')+'</button></div></form></div>';
}
$('s-board').onclick=e=>{const r=e.target.closest('[data-n]');if(r){sel=+r.dataset.n;renderStaff();$('s-detail').querySelector('textarea').focus()}};
const closeTicket=()=>{sel=null;renderStaff()};
$('s-scrim').onclick=closeTicket;
$('s-detail').onclick=e=>{if(e.target.closest('[data-close]'))closeTicket()};
$('s-detail').onchange=e=>{
  const t=st.tickets.find(x=>x.n===sel);if(!t)return;
  if(e.target.id==='s-prio'){t.priority=e.target.value;save();sync()}
  else if(e.target.id==='s-status'&&t.status!==e.target.value){t.status=e.target.value;note(t.uid,'status',{n:t.n,s:t.status});save();sync()}};
$('s-detail').onsubmit=e=>{e.preventDefault();
  const t=st.tickets.find(x=>x.n===sel),text=$('reply').value.trim();if(!t||!text)return;
  (t.replies=t.replies||[]).push({text,at:Date.now()});
  if(t.status==='Open')t.status='In progress';
  note(t.uid,'reply',{n:t.n});
  $('reply').value='';save();sync()};

/* ---------- staff: review queue of answers rated "Not helpful" (US14) ---------- */
function renderReview(){
  const ev=st.events||[],list=ev.filter(e=>e.k==='fb'&&!e.v&&e.q).sort((a,b)=>!!a.rev-!!b.rev||b.at-a.at);
  $('c-r').textContent=list.filter(e=>!e.rev).length;
  const who=e=>e.role==='guest'?tr('rv.guest'):e.role==='staff'?tr('rv.staff'):tr('rv.student')+(e.uid?' · ID '+esc(e.uid):'');
  $('rv-list').innerHTML=list.length?list.map(e=>'<article class="rvi'+(e.rev?' done':'')+'"><div class="rvh"><span class="chip'+(e.rev?' done':' warn')+'">'+tr(e.rev?'rv.done':'rv.todo')+'</span>'+
    '<span class="who">'+who(e)+'</span><small>'+dt(e.at)+'</small></div>'+
    '<dl><dt>'+tr('rv.q')+'</dt><dd>'+esc(e.q)+'</dd><dt>'+tr('rv.a')+'</dt><dd>'+esc(e.a||'—')+'</dd><dt>'+tr('rv.c')+'</dt><dd>'+(e.c?esc(e.c):'<em>'+tr('rv.nocom')+'</em>')+'</dd></dl>'+
    (e.rev?'':'<button type="button" class="ghost2" data-rv="'+ev.indexOf(e)+'">'+tr('rv.mark')+'</button>')+'</article>').join('')
    :'<div class="empty">'+tr('rv.none')+'</div>';
}
$('rv-list').onclick=e=>{const b=e.target.closest('[data-rv]');if(!b)return;
  const x=st.events[+b.dataset.rv];if(x){x.rev=Date.now();save();sync()}};

/* ---------- staff: analytics, computed from tickets and recorded chat events ---------- */
function renderAnalytics(){
  const tk=st.tickets,ev=st.events||[];
  const up=ev.filter(e=>e.k==='fb'&&e.v).length,dn=ev.filter(e=>e.k==='fb'&&!e.v).length;
  const rated=tk.filter(t=>t.rating),avg=rated.length?(rated.reduce((a,t)=>a+t.rating.stars,0)/rated.length).toFixed(1):'—';
  const qs=ev.filter(e=>e.k==='q'),cnt={};
  qs.forEach(e=>{if(e.i!=='greet')cnt[e.i]=(cnt[e.i]||0)+1});
  const top=Object.entries(cnt).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const bars=(rows,cls)=>{const max=Math.max(1,...rows.map(r=>r[1]));
    return rows.map(([l,n,c])=>'<div class="brow"><span>'+esc(l)+'</span><div class="track"><i class="'+(c||cls||'')+'" style="width:'+Math.round(100*n/max)+'%"></i></div><b>'+n+'</b></div>').join('')};
  const over=tk.filter(isOverdue).length;
  const kpi=(k,v,s,c)=>'<div class="stat'+(c?' '+c:'')+'"><span class="k">'+k+'</span><b class="v">'+v+'</b><span class="s">'+(s||'&nbsp;')+'</span></div>';
  $('an').innerHTML=
    '<div class="stats">'+kpi(tr('an.total'),tk.length)+kpi(tr('an.open'),tk.filter(t=>t.status!=='Resolved').length)+
      kpi(tr('an.overdue'),over,tr('an.overdue.s'),over?'alert':'ok')+
      kpi(tr('an.helpful'),up+dn?Math.round(100*up/(up+dn))+'%':'—',up+dn?tr('an.helpful.s',{u:up,n:up+dn}):tr('an.nodata'))+kpi(tr('an.questions'),qs.length)+
      kpi(tr('an.rating'),rated.length?avg+' ★':'—',rated.length?tr('an.rating.s',{n:rated.length}):tr('an.nodata'))+'</div>'+
    '<div class="duo">'+
      '<section class="blk"><h3 class="sect">'+tr('an.bystatus')+'</h3>'+bars(STATUS.map((s,i)=>[tr('st.'+s),tk.filter(t=>t.status===s).length,['o','p','g'][i]]))+'</section>'+
      '<section class="blk"><h3 class="sect">'+tr('an.byoffice')+'</h3>'+bars(OFFICES.map(o=>[o,tk.filter(t=>t.office===o).length]),'p')+'</section>'+
    '</div>'+
    '<section class="blk"><h3 class="sect">'+tr('an.top')+'</h3>'+(top.length?bars(top.map(([i,n])=>[tr('i.'+i),n]),'o'):'<div class="empty">'+tr('an.nodata')+'</div>')+'</section>'+
    '<section class="blk"><h3 class="sect">'+tr('an.reviews')+'</h3>'+(rated.length?rated.slice().sort((a,b)=>b.rating.at-a.rating.at).slice(0,5).map(t=>
      '<div class="rev"><span class="stars">'+stars(t.rating.stars)+'</span> <b>'+esc(t.who)+'</b> <span class="mono">#'+t.n+'</span> <small>'+dt(t.rating.at)+'</small>'+
      (t.rating.comment?'<p>'+esc(t.rating.comment)+'</p>':'')+'</div>').join(''):'<div class="empty">'+tr('an.nodata')+'</div>')+'</section>';
}

/* ---------- staff: announcements; students see active ones as a banner above Home and Chat ---------- */
function renderAnn(){
  const list=st.ann.slice().sort((a,b)=>b.at-a.at);
  $('ann-list').innerHTML=list.length?list.map(a=>'<div class="annrow '+a.level+'"><div><span class="chip'+(a.level==='warning'?' warn':'')+'">'+tr('ann.'+a.level)+'</span> '+
    '<span class="chip'+(a.active?' done':'')+'">'+tr(a.active?'ann.active':'ann.off')+'</span><p>'+esc(a.text)+'</p><small>'+dt(a.at)+'</small></div>'+
    '<button type="button" class="ghost2" data-ann="'+a.id+'">'+tr(a.active?'ann.unpublish':'ann.republish')+'</button></div>').join('')
    :'<div class="empty">'+tr('ann.none')+'</div>';
}
$('ann-form').onsubmit=e=>{e.preventDefault();const t=$('ann-text').value.trim();if(!t)return;
  st.ann.push({id:Date.now(),text:t,level:$('ann-level').value,active:true,at:Date.now()});$('ann-text').value='';save();sync()};
$('ann-list').onclick=e=>{const b=e.target.closest('[data-ann]');if(!b)return;
  const a=st.ann.find(x=>x.id===+b.dataset.ann);if(a){a.active=!a.active;a.at=Date.now();save();sync()}};
const ANN_ICON={info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',warning:'<path d="M12 4 21 19H3z"/><path d="M12 10v4M12 17h.01"/>'};
function renderBanners(){
  const ds=(U&&st.dismiss[U.login])||[];
  const h=(U&&U.role!=='staff'?st.ann.filter(a=>a.active&&!ds.includes(a.id)).sort((a,b)=>b.at-a.at):[]).map(a=>
    '<div class="banner '+a.level+'" role="status"><svg class="i" viewBox="0 0 24 24">'+ANN_ICON[a.level]+'</svg><span><b>'+tr('ann.'+a.level)+':</b> '+esc(a.text)+'</span>'+
    '<button type="button" class="bx" data-dis="'+a.id+'" aria-label="'+esc(tr('ann.close'))+'">×</button></div>').join('');
  $('ban-home').innerHTML=h;$('ban-chat').innerHTML=h;
}

/* ---------- first-login tour (once per account; "Show tour again" in the user menu) ---------- */
const TOUR=[['#tabs','tour.nav'],['#nav-chat','tour.chat'],['#nav-tickets','tour.tickets'],['.tools .theme-btn','tour.theme'],['#user-btn','tour.lang']];
let tourI=-1;
const tourDone=()=>{try{return JSON.parse(localStorage.getItem('hd-tour')||'[]')}catch(_){return[]}};
function tourStart(){closeUserMenu();closeBell();tourI=0;$('tour').hidden=false;tourShow()}
function tourEnd(){
  $('tour').hidden=true;tourI=-1;document.querySelector('.bar').classList.remove('open');
  if(U){const d=tourDone();if(!d.includes(U.login)){d.push(U.login);try{localStorage.setItem('hd-tour',JSON.stringify(d))}catch(_){}}}
}
function tourShow(){
  if(tourI<0)return;
  const [sel,key]=TOUR[tourI],bar=document.querySelector('.bar');
  const narrow=window.innerWidth<=900;
  bar.classList.toggle('open',narrow&&tourI<3);
  $('tour-n').textContent=tr('tour.step',{i:tourI+1,n:TOUR.length});
  $('tour-t').textContent=tr(key+'.t');$('tour-p').textContent=tr(key+'.p');
  $('tour-next').textContent=tr(tourI===TOUR.length-1?'tour.done':'tour.next');
  requestAnimationFrame(()=>{
    const el=document.querySelector(sel),r=el.getBoundingClientRect(),hl=$('tour-hl'),c=$('tour-card');
    hl.style.cssText='top:'+(r.top-6)+'px;left:'+(r.left-6)+'px;width:'+(r.width+12)+'px;height:'+(r.height+12)+'px';
    const cw=Math.min(340,window.innerWidth-24);c.style.width=cw+'px';
    c.style.left=Math.max(12,Math.min(r.left,window.innerWidth-cw-12))+'px';
    c.style.top=(r.bottom+16)+'px';
    $('tour-next').focus();
  });
}
$('tour-next').onclick=()=>{if(tourI>=TOUR.length-1)tourEnd();else{tourI++;tourShow()}};
$('tour-skip').onclick=tourEnd;
$('tour-again').onclick=tourStart;
window.addEventListener('resize',tourShow);

/* ---------- FAQ page ---------- */
function renderFaq(){
  const q=($('faq-q').value||'').trim().toLowerCase();
  const txt=a=>Array.isArray(a)?a.join(' '):a;
  const list=FAQ.filter(f=>!q||(f.q(ui)+' '+txt(f.a(ui))).toLowerCase().includes(q));
  $('faq-list').innerHTML=list.length?list.map(f=>{const a=f.a(ui);
    return '<article class="faq"><span class="tag">'+tr('cat.'+f.cat)+'</span><h3>'+esc(f.q(ui))+'</h3>'+
      (Array.isArray(a)?'<ol>'+a.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ol>':'<p>'+esc(a)+'</p>')+
      '<span class="src" data-l="'+tr('faq.src')+'">'+esc(T[ui].S[f.src])+'</span></article>'}).join('')
    :'<div class="empty">'+tr('faq.none')+'</div>';
}
$('faq-q').oninput=renderFaq;

/* ---------- notifications ---------- */
function renderBell(){
  const mine=U&&U.role==='student'?st.notes.filter(n=>n.uid===U.login).sort((a,b)=>b.at-a.at):[];
  const un=mine.filter(n=>!n.read).length;
  $('bell-n').textContent=un;$('bell-n').hidden=!un;
  $('bell-list').innerHTML=mine.length?mine.slice(0,12).map(n=>'<button type="button" class="note'+(n.read?'':' unread')+'" data-nt="'+n.type+'" data-ref="'+(n.n||n.at)+'"><span>'+esc(noteText(n))+'</span><small>'+dt(n.at)+'</small></button>').join('')
    :'<div class="none">'+tr('bell.none')+'</div>';
}
function closeBell(){
  if($('bell-pop').hidden)return;
  $('bell-pop').hidden=true;$('bell').setAttribute('aria-expanded','false');
  let ch=false;st.notes.forEach(n=>{if(U&&n.uid===U.login&&!n.read){n.read=true;ch=true}});
  if(ch){save();renderBell()}
}
function closeUserMenu(){$('user-menu').hidden=true;$('user-btn').setAttribute('aria-expanded','false')}
$('bell').onclick=()=>{if($('bell-pop').hidden){closeUserMenu();$('bell-pop').hidden=false;$('bell').setAttribute('aria-expanded','true')}else closeBell()};
$('bell-list').onclick=e=>{const b=e.target.closest('.note');if(!b)return;
  const type=b.dataset.nt,ref=b.dataset.ref;closeBell();
  const target=type==='reply'||type==='status'?(show('tickets'),$('tk-'+ref)):(show('appts'),$('ap-'+ref));
  if(target){target.scrollIntoView({block:'center'});target.classList.remove('flash');void target.offsetWidth;target.classList.add('flash')}};
$('user-btn').onclick=()=>{closeBell();const o=$('user-menu').hidden;$('user-menu').hidden=!o;$('user-btn').setAttribute('aria-expanded',String(o))};
document.addEventListener('click',e=>{
  const g=e.target.closest('[data-goto]');if(g)show(g.dataset.goto);
  const l=e.target.closest('[data-lang]');if(l)setUI(l.dataset.lang);
  const d=e.target.closest('[data-dis]');if(d&&U){(st.dismiss[U.login]=st.dismiss[U.login]||[]).push(+d.dataset.dis);save();renderBanners()}
  if(!e.target.closest('.usermenu'))closeUserMenu();
  if(!e.target.closest('.bellwrap'))closeBell()});
document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;if(tourI>=0)return tourEnd();closeUserMenu();closeBell();if(sel!==null)closeTicket()});

/* ---------- About: overview + sprint board ---------- */
/* Edit these arrays to match the real backlog. day = working day of Sprint 2 when the story was finished (for the burndown). */
const SPRINT1=[['US1','FAQ Instant Answers'],['US2','IT Issue Self-Help'],['US3','Help Ticket Creation'],['US4','Escalation to Human Staff']];
const SPRINT2={deadline:'09.10.2026',days:10,stories:[
  {id:'US5',t:'Course Registration Guidance',o:'Kamshat',p:7,st:'Done',day:7},
  {id:'US6',t:'Financial Aid & Billing Q&A',o:'Imangali',p:6,st:'Done',day:5},
  {id:'US7',t:'Advisor Appointment Scheduling',o:'Kenan',p:5,st:'Done',day:3},
  {id:'US8',t:'Multi-Language Support',o:'Zhanibek',p:5,st:'Done',day:10}]};
const TEAM=[['249900004','role.po'],['249900001','role.sm'],['249900002','role.dev'],['249900003','role.dev']];
let aboutTab='overview';
const pts=()=>SPRINT2.stories.reduce((a,s)=>a+s.p,0);

function overview(){
  return '<p class="lead">'+tr('ab.lead')+'</p><p>'+tr('ab.p2')+'</p>'+
    '<h3>'+tr('ab.team')+'</h3><div class="tw"><table><tbody>'+TEAM.map(([id,r])=>{const a=ACCOUNTS[id];
      return '<tr><td>'+avatar(a.name)+' <b>'+esc(a.name)+'</b></td><td>'+tr(r)+'</td></tr>'}).join('')+'</tbody></table></div>'+
    '<h3>'+tr('ab.stories')+'</h3><div class="tw"><table><thead><tr><th>ID</th><th>'+tr('th.story')+'</th><th>'+tr('th.sprint')+'</th><th>'+tr('th.owner')+'</th><th>'+tr('th.pts')+'</th></tr></thead><tbody>'+
    SPRINT1.map(([id,t])=>'<tr><td class="mono">'+id+'</td><td>'+esc(t)+'</td><td>1</td><td>—</td><td>—</td></tr>').join('')+
    SPRINT2.stories.map(s=>'<tr><td class="mono">'+s.id+'</td><td>'+esc(s.t)+'</td><td>2</td><td>'+avatar(s.o)+' '+esc(s.o)+'</td><td>'+s.p+'</td></tr>').join('')+'</tbody></table></div>';
}
function bdLabel(i){const d=new Date(2026,8,28);let k=i-1;while(k>0){d.setDate(d.getDate()+1);if(d.getDay()%6)k--}
  return String(d.getDate()).padStart(2,'0')+'.'+String(d.getMonth()+1).padStart(2,'0')}
function burndown(){
  const W=640,H=300,l=46,r=16,t=16,b=46,n=SPRINT2.days,tot=pts();
  const X=i=>l+(W-l-r)*i/n,Y=v=>t+(H-t-b)*(1-v/tot);
  const idx=[...Array(n+1).keys()];
  const act=idx.map(i=>tot-SPRINT2.stories.filter(s=>s.st==='Done'&&s.day<=i).reduce((a,s)=>a+s.p,0));
  const line=f=>idx.map(i=>(i?'L':'M')+X(i).toFixed(1)+' '+Y(f(i)).toFixed(1)).join('');
  return '<svg class="burn" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(tr('burn.title'))+'">'+
    [0,5,10,15,20].map(v=>'<line class="grid" x1="'+l+'" x2="'+(W-r)+'" y1="'+Y(v)+'" y2="'+Y(v)+'"/><text class="ax" x="'+(l-8)+'" y="'+(Y(v)+4)+'" text-anchor="end">'+v+'</text>').join('')+
    idx.filter(i=>i%2===0||i===n).map(i=>'<text class="ax" x="'+X(i)+'" y="'+(H-b+18)+'" text-anchor="middle">'+(i?bdLabel(i):tr('burn.start'))+'</text>').join('')+
    '<text class="ax" x="12" y="'+(t+(H-t-b)/2)+'" transform="rotate(-90 12 '+(t+(H-t-b)/2)+')" text-anchor="middle">'+tr('burn.y')+'</text>'+
    '<path class="ideal" d="'+line(i=>tot*(1-i/n))+'"/><path class="act" d="'+line(i=>act[i])+'"/>'+
    idx.map(i=>'<circle class="dot" cx="'+X(i).toFixed(1)+'" cy="'+Y(act[i]).toFixed(1)+'" r="3.5"/>').join('')+'</svg>';
}
function sprintBoard(){
  const cols=[['To do','col.todo'],['In progress','col.prog'],['Done','col.done']];
  return '<section class="blk"><h3>'+tr('sb.s1')+' <span class="chip done">'+tr('col.done')+'</span></h3><ul class="s1">'+
      SPRINT1.map(([id,t])=>'<li><span class="mono">'+id+'</span> '+esc(t)+'</li>').join('')+'</ul></section>'+
    '<section class="blk"><h3>'+tr('sb.s2')+'</h3><p class="meta2">'+tr('sb.meta2',{p:pts(),d:SPRINT2.deadline})+'</p>'+
      '<div class="board sboard">'+cols.map(([k,lab])=>{const list=SPRINT2.stories.filter(s=>s.st===k);
        return '<section class="col" data-s="'+k.replace(' ','-')+'"><h3>'+tr(lab)+' <span class="count">'+list.length+'</span></h3>'+
          (list.length?list.map(s=>'<div class="sc"><span class="mono">'+s.id+'</span><b>'+esc(s.t)+'</b><span class="sm">'+avatar(s.o)+' '+esc(s.o)+' · '+s.p+' '+tr('th.pts').toLowerCase()+'</span></div>').join(''):'<div class="none">'+tr('sb.empty')+'</div>')+'</section>'}).join('')+'</div></section>'+
    '<section class="blk"><h3>'+tr('burn.title')+' <span class="chip">'+tr('burn.note')+'</span></h3>'+burndown()+
      '<p class="legend"><i class="l-ideal"></i> '+tr('burn.ideal')+' <i class="l-act"></i> '+tr('burn.actual')+'</p></section>';
}
function renderAbout(){
  $('about').innerHTML='<div><h2>'+tr('ab.title')+'</h2><div class="tabs2" role="tablist">'+
    [['overview','ab.tab1'],['sprint','ab.tab2']].map(([k,l])=>'<button type="button" role="tab" aria-selected="'+(aboutTab===k)+'" data-tab="'+k+'">'+tr(l)+'</button>').join('')+'</div>'+
    (aboutTab==='overview'?overview():sprintBoard())+'</div>';
}
$('about').onclick=e=>{const b=e.target.closest('[data-tab]');if(b){aboutTab=b.dataset.tab;renderAbout()}};

/* ---------- interface language ---------- */
function buildQuick(){$('quick').innerHTML='';
  tr('quick').forEach(q=>{const b=document.createElement('button');b.type='button';b.textContent=q;b.onclick=()=>ask(q);$('quick').appendChild(b)})}
function fillMenu(){if(!U)return;
  if(U.role==='guest'){$('who-name').textContent=$('mn-name').textContent=tr('guest.name');$('mn-sub').textContent=tr('guest.sub');$('logout').textContent=tr('guest.exit');return}
  $('mn-sub').textContent=U.role==='staff'?tr('menu.staff'):U.major+', '+yearLbl(U.year)+' · ID '+U.id}
const homeView=()=>U.role==='staff'?'staff':U.role==='guest'?'chat':'home';
function applyUI(){
  document.documentElement.lang=ui;
  document.querySelectorAll('[data-i18n]').forEach(e=>e.textContent=tr(e.dataset.i18n));
  document.querySelectorAll('[data-i18n-ph]').forEach(e=>e.placeholder=tr(e.dataset.i18nPh));
  document.querySelectorAll('[data-i18n-aria]').forEach(e=>{const s=tr(e.dataset.i18nAria);e.setAttribute('aria-label',s);e.title=s});
  document.querySelectorAll('[data-lang]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.lang===ui)));
  buildQuick();renderAbout();fillMenu();sync();
}
function setUI(l){ui=l;try{localStorage.setItem('hd-ui',l)}catch(_){}applyUI()}

/* ---------- login ---------- */
let sess=null;
try{sess=JSON.parse(sessionStorage.getItem('hd-session')||'null')}catch(e){}
function applyAuth(){
  U=sess&&(sess.login==='guest'?GUEST:ACCOUNTS[sess.login])||null;
  if(!U){sess=null;document.body.className='auth-out';sync();return}
  document.body.className='auth-in role-'+U.role;
  $('who-av').textContent=U.ini;$('who-av').style.background=U.color;$('who-name').textContent=U.name;
  $('mn-name').textContent=U.full;$('logout').textContent=tr('menu.logout');fillMenu();
  chatEpoch++;mode=null;loadChat();
  sync();show(homeView());
  if(U.role==='student'&&!tourDone().includes(U.login))setTimeout(()=>{if(U&&$('tour').hidden)tourStart()},500);
}
const loginErr=m=>{$('login-err').textContent=m;$('login-err').hidden=!m};
$('login-form').onsubmit=e=>{e.preventDefault();
  const f=e.target,k=f.login.value.trim().toLowerCase();
  if(!ACCOUNTS[k]||f.password.value!==PASS)return loginErr(tr('login.err'));
  loginErr('');sess={login:k};
  try{sessionStorage.setItem('hd-session',JSON.stringify(sess))}catch(_){}
  f.password.value='';applyAuth()};
$('login-form').oninput=()=>loginErr('');
$('accounts').innerHTML=Object.values(ACCOUNTS).map(a=>'<button type="button" class="acc" data-login="'+a.login+'"><span class="av sm" style="background:'+a.color+';color:#fff">'+a.ini+'</span>'+a.login+'<em>'+esc(a.name)+'</em></button>').join('');
$('accounts').onclick=e=>{const b=e.target.closest('[data-login]');if(!b)return;
  $('l-name').value=b.dataset.login;loginErr('');$('l-pass').focus()};
/* log out; for a visitor this is "Sign in" and returns to the login screen */
function toLogin(){closeUserMenu();closeBell();if(tourI>=0)tourEnd();chatEpoch++;sess=null;try{sessionStorage.removeItem('hd-session')}catch(_){}applyAuth()}
$('logout').onclick=toLogin;
$('guest-btn').onclick=()=>{loginErr('');sess={login:'guest'};try{sessionStorage.setItem('hd-session',JSON.stringify(sess))}catch(_){}applyAuth()};

/* ---------- wiring ---------- */
$('form').onsubmit=e=>{e.preventDefault();const t=$('q').value.trim();if(!t)return;$('q').value='';renderSugg();userMsg(t);answer(t)};

/* ---------- chat: up to 3 similar FAQ questions while typing (3+ letters) ---------- */
function renderSugg(){
  const v=$('q').value.trim(),box=$('sugg');
  if(v.length<3){box.innerHTML='';box.hidden=true;return}
  const L=detect(v),low=v.toLowerCase();
  const toks=(low.match(/\p{L}+/gu)||[]).filter(w=>w.length>=3&&!STOP.includes(w));
  const txt=a=>(Array.isArray(a)?a.join(' '):a).toLowerCase();
  const hit=FAQ.map(f=>{const corp=LANGS.map(l=>f.q(l)).join(' ').toLowerCase(),ans=txt(f.a(L));let s=0;
    (toks.length?toks:[low]).forEach(w=>{const stem=w.length>=6?w.slice(0,5):w;if(corp.includes(w)||corp.includes(stem))s+=1;else if(ans.includes(w))s+=.3});
    return [f,s]}).filter(x=>x[1]>0).sort((a,b)=>b[1]-a[1]).slice(0,3);
  box.hidden=!hit.length;
  box.innerHTML=hit.length?'<span class="sl">'+tr('sugg.title')+'</span>'+hit.map(([f])=>'<button type="button" data-sq="'+f.id+'" data-l="'+L+'">'+esc(f.q(L))+'</button>').join(''):'';
}
$('q').oninput=renderSugg;
$('sugg').onclick=e=>{const b=e.target.closest('[data-sq]');if(!b)return;
  const q=FAQ.find(x=>x.id===b.dataset.sq).q(b.dataset.l);$('q').value='';renderSugg();userMsg(q);answer(q);$('q').focus()};
setInterval(()=>{if(U&&U.role==='staff')sync()},60000);   /* keeps SLA countdowns fresh */
document.querySelectorAll('nav.tabs [data-view]').forEach(b=>b.onclick=()=>show(b.dataset.view));
document.querySelectorAll('[data-qk]').forEach(b=>b.onclick=()=>ask(tr(b.dataset.qk)));
$('brand').onclick=()=>{if(U)show(homeView())};
$('ask-form').onsubmit=e=>{e.preventDefault();const t=$('ask-q').value.trim();if(!t)return;$('ask-q').value='';ask(t)};
$('menu-btn').onclick=()=>{const o=document.querySelector('.bar').classList.toggle('open');$('menu-btn').setAttribute('aria-expanded',String(o))};
$('nav-reset').onclick=()=>{closeUserMenu();st=fresh();sel=null;save();chatEpoch++;mode=null;$('log').innerHTML='';boot();sync()};
function boot(){botNow({text:U&&U.role==='guest'?tr('g.greet'):T[ui].greet},ui)}
/* another browser tab changed the data */
window.addEventListener('storage',e=>{if(e.key!=='hd-state')return;
  try{const s=JSON.parse(e.newValue);if(s&&s.tickets){st=loadSt(s);sync()}}catch(_){}});
document.querySelectorAll('.page').forEach(p=>{const f=document.createElement('footer');f.className='foot';f.dataset.i18n='foot';p.appendChild(f)});

/* ---------- theme ---------- */
const mq=window.matchMedia('(prefers-color-scheme: dark)');
const setTheme=(t,keep)=>{document.documentElement.dataset.theme=t;if(keep){try{localStorage.setItem('hd-theme',t)}catch(_){}}};
let savedTheme=null;try{savedTheme=localStorage.getItem('hd-theme')}catch(_){}
setTheme(savedTheme||(mq.matches?'dark':'light'));
mq.addEventListener&&mq.addEventListener('change',e=>{let s=null;try{s=localStorage.getItem('hd-theme')}catch(_){}if(!s)setTheme(e.matches?'dark':'light')});
document.querySelectorAll('.theme-btn').forEach(b=>b.onclick=()=>setTheme(document.documentElement.dataset.theme==='dark'?'light':'dark',true));

applyUI();applyAuth();
