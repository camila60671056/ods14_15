(function(){
'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const root=document.documentElement, store={
 get(k,d){try{return localStorage.getItem(k)??d}catch(e){return d}},
 set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
root.classList.add('js-ready');

/* ---------- Dados ---------- */
const SPECIES=[
 {id:'baleia-azul',nome:'Baleia-azul',emoji:'🐋',ods:14,status:'ameacada',lat:-30,lon:-45,regiao:'Oceano Atlântico Sul',habitat:'Oceanos abertos, de águas polares a tropicais.',ameacas:'Colisões com navios, ruído submarino e mudanças climáticas.',ajuda:'Reduza plástico e apoie áreas marinhas protegidas.'},
 {id:'tartaruga-verde',nome:'Tartaruga-verde',emoji:'🐢',ods:14,status:'ameacada',lat:-20,lon:-38,regiao:'Costa brasileira',habitat:'Águas costeiras rasas e praias de desova.',ameacas:'Captura acidental, poluição e perda de praias.',ajuda:'Não deixe lixo na praia e respeite áreas de desova.'},
 {id:'tubarao-martelo',nome:'Tubarão-martelo',emoji:'🦈',ods:14,status:'critica',lat:25,lon:-80,regiao:'Atlântico Oeste e Caribe',habitat:'Águas costeiras e plataformas continentais.',ameacas:'Pesca predatória e comércio de nadadeiras.',ajuda:'Evite consumir produtos de pesca predatória.'},
 {id:'onca-pintada',nome:'Onça-pintada',emoji:'🐆',ods:15,status:'ameacada',lat:-15,lon:-56,regiao:'Pantanal e Amazônia',habitat:'Florestas, savanas e áreas alagadas.',ameacas:'Desmatamento, caça e conflito com pecuaristas.',ajuda:'Apoie projetos de conservação e consumo responsável.'},
 {id:'mico-leao',nome:'Mico-leão-dourado',emoji:'🐒',ods:15,status:'ameacada',lat:-22.5,lon:-42,regiao:'Mata Atlântica (RJ)',habitat:'Florestas de baixada da Mata Atlântica.',ameacas:'Fragmentação da mata e tráfico.',ajuda:'Apoie corredores ecológicos e plantio de árvores nativas.'},
 {id:'orangotango',nome:'Orangotango-de-Bornéu',emoji:'🦧',ods:15,status:'critica',lat:1,lon:114,regiao:'Ilha de Bornéu',habitat:'Florestas tropicais úmidas.',ameacas:'Desmatamento para plantações de óleo de palma.',ajuda:'Prefira produtos com óleo de palma certificado.'},
 {id:'rinoceronte-javanes',nome:'Rinoceronte-de-Java',emoji:'🦏',ods:15,status:'critica',lat:-6.7,lon:105.3,regiao:'Java, Indonésia',habitat:'Florestas tropicais de baixada.',ameacas:'Caça por chifres e perda de habitat.',ajuda:'Não compre produtos de origem animal ilegal.'},
 {id:'tigre-de-tasmania',nome:'Tilacino (tigre-da-tasmânia)',emoji:'🐺',ods:15,status:'extinto',lat:-42,lon:147,regiao:'Tasmânia, Austrália',habitat:'Florestas e campos abertos.',ameacas:'Caça intensiva e perda de habitat levaram à extinção no séc. XX.',ajuda:'Lembre-se: a extinção é irreversível. Proteja quem ainda existe.'}
];
const ST={ameacada:'Ameaçada',critica:'Criticamente ameaçada',extinto:'Extinta'};
const MK={ameacada:'threatened',critica:'critical',extinto:'extinct'};
const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ---------- Detalhe (modal) ---------- */
function openModal(s){
 const m=$('#animalModal'); if(!m) return;
 $('#modalContent').innerHTML=`<div style="font-size:3rem">${s.emoji}</div><p class="eyebrow">ODS ${s.ods} · ${ST[s.status]}</p><h2>${esc(s.nome)}</h2><p><b>Região:</b> ${esc(s.regiao)}</p><h4>Habitat</h4><p>${esc(s.habitat)}</p><h4>Ameaças</h4><p>${esc(s.ameacas)}</p><h4>Como ajudar</h4><p>${esc(s.ajuda)}</p>`;
 m.showModal?m.showModal():m.setAttribute('open','');
}
const mc=$('#modalClose'),md=$('#animalModal');
if(mc&&md){mc.onclick=()=>md.close();md.addEventListener('click',e=>{if(e.target===md)md.close()})}

/* ---------- Tema, menu, acessibilidade ---------- */
const tt=$('#themeToggle');
function setTheme(t){root.setAttribute('data-theme',t);if(tt)tt.textContent=t==='dark'?'☀':'☾';store.set('eg-theme',t)}
setTheme(store.get('eg-theme',matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'));
if(tt)tt.onclick=()=>setTheme(root.getAttribute('data-theme')==='dark'?'light':'dark');
const mb=$('#menuBtn'),nav=$('.nav');
if(mb&&nav)mb.onclick=()=>nav.classList.toggle('open');
$$('.nav a').forEach(a=>{if(a.getAttribute('href')===location.pathname.split('/').pop()||(!location.pathname.split('/').pop()&&a.getAttribute('href')==='index.html'))a.classList.add('active')});
const ap=$('#accessPanel');
if($('#accessibilityToggle'))$('#accessibilityToggle').onclick=()=>ap.classList.toggle('open');
let fs=+store.get('eg-fs',16);
function applyFs(){fs=Math.min(24,Math.max(12,fs));root.style.setProperty('--fs',fs+'px');store.set('eg-fs',fs)}
applyFs();
const on=(id,f)=>{const e=$(id);if(e)e.onclick=f};
on('#fontPlus',()=>{fs+=2;applyFs()});on('#fontMinus',()=>{fs-=2;applyFs()});
if(store.get('eg-hc','0')==='1')root.classList.add('hc');
on('#contrastToggle',()=>{store.set('eg-hc',root.classList.toggle('hc')?'1':'0')});
on('#readToggle',()=>{
 if(!('speechSynthesis' in window))return alert('Seu navegador não suporta leitura em voz alta.');
 if(speechSynthesis.speaking){speechSynthesis.cancel();return}
 const u=new SpeechSynthesisUtterance($('main').innerText);u.lang='pt-BR';speechSynthesis.speak(u)});
on('#resetAccess',()=>{fs=16;applyFs();root.classList.remove('hc');store.set('eg-hc','0');if('speechSynthesis' in window)speechSynthesis.cancel()});

/* ---------- Progresso e reveal ---------- */
const pr=$('#progress');
addEventListener('scroll',()=>{if(pr){const h=root.scrollHeight-innerHeight;pr.style.width=(h>0?scrollY/h*100:0)+'%'}},{passive:true});
if('IntersectionObserver' in window){
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.1});
 $$('.reveal').forEach(el=>io.observe(el));
}else $$('.reveal').forEach(el=>el.classList.add('in'));

/* ---------- Espécies ---------- */
const grid=$('#speciesGrid');
if(grid){
 let filtro='todos',busca='';
 const render=()=>{
  const l=SPECIES.filter(s=>(filtro==='todos'||(filtro==='extinto'?s.status==='extinto':String(s.ods)===filtro))&&s.nome.toLowerCase().includes(busca));
  grid.innerHTML='';
  l.forEach(s=>{const b=document.createElement('button');b.className='species-card';
   b.innerHTML=`<div class="emoji">${s.emoji}</div><h3>${esc(s.nome)}</h3><small>${esc(s.regiao)}</small><div><span class="tag">ODS ${s.ods}</span><span class="tag">${ST[s.status]}</span></div>`;
   b.onclick=()=>openModal(s);grid.appendChild(b)});
  $('#emptyState').hidden=l.length>0;
 };
 $('#searchInput').addEventListener('input',e=>{busca=e.target.value.trim().toLowerCase();render()});
 $$('.filter').forEach(b=>b.onclick=()=>{$$('.filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');filtro=b.dataset.filter;render()});
 render();
}

/* ---------- Globo ---------- */
const globe=$('#globe');
if(globe){
 const box=$('#markers');let rotLon=-40,rotLat=0,zoom=1;
 const rad=Math.PI/180;
 const els=SPECIES.map(s=>{const b=document.createElement('button');b.className='marker '+MK[s.status];b.setAttribute('aria-label',s.nome);
  b.onclick=()=>{showInfo(s);openModal(s)};box.appendChild(b);return b});
 function draw(){
  SPECIES.forEach((s,i)=>{
   const la=s.lat*rad,lo=(s.lon-rotLon)*rad,p=rotLat*rad;
   const x=Math.cos(la)*Math.sin(lo),y=Math.sin(la)*Math.cos(p)-Math.cos(la)*Math.cos(lo)*Math.sin(p),z=Math.sin(la)*Math.sin(p)+Math.cos(la)*Math.cos(lo)*Math.cos(p);
   const b=els[i];b.style.display=z>0?'block':'none';
   b.style.left=(50+x*45*zoom)+'%';b.style.top=(50-y*45*zoom)+'%';
  });
 }
 function showInfo(s){$('#mapInfo').innerHTML=`<div class="map-info-icon">${s.emoji}</div><p class="eyebrow">ODS ${s.ods} · ${ST[s.status]}</p><h3>${esc(s.nome)}</h3><p>${esc(s.regiao)}</p><p style="margin-top:.6rem">${esc(s.habitat)}</p>`}
 let drag=null;
 globe.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY}});
 addEventListener('pointerup',()=>drag=null);
 addEventListener('pointermove',e=>{if(!drag)return;rotLon-=(e.clientX-drag.x)*.4;rotLat=Math.max(-60,Math.min(60,rotLat+(e.clientY-drag.y)*.3));drag={x:e.clientX,y:e.clientY};draw()});
 const z=d=>{zoom=Math.max(.7,Math.min(1.6,zoom+d));draw()};
 globe.addEventListener('wheel',e=>{e.preventDefault();z(e.deltaY<0?.1:-.1)},{passive:false});
 on('#zoomIn',()=>z(.15));on('#zoomOut',()=>z(-.15));on('#resetGlobe',()=>{rotLon=-40;rotLat=0;zoom=1;draw()});
 globe.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')rotLon-=10;if(e.key==='ArrowRight')rotLon+=10;draw()});
 draw();
}

/* ---------- Quiz ---------- */
const qa=$('#question');
if(qa){
 const Q=[
  {q:'Qual ODS trata da Vida na Água?',o:['ODS 13','ODS 14','ODS 15','ODS 16'],c:1},
  {q:'Qual ODS trata da Vida Terrestre?',o:['ODS 15','ODS 6','ODS 14','ODS 12'],c:0},
  {q:'Qual é uma das principais ameaças ao mico-leão-dourado?',o:['Excesso de chuva','Fragmentação da Mata Atlântica','Falta de sol','Frio extremo'],c:1},
  {q:'O que o tráfico de animais silvestres causa?',o:['Aumenta as populações','Ameaça espécies e causa sofrimento','Protege os habitats','Nada relevante'],c:1},
  {q:'Qual ação ajuda a proteger a vida marinha?',o:['Usar mais descartáveis','Jogar lixo na praia','Reduzir o uso de plástico','Pescar em excesso'],c:2},
  {q:'O tilacino (tigre-da-tasmânia) está em qual situação?',o:['Extinto','Estável','Em recuperação','Abundante'],c:0}
 ];
 let i=0,pts=0,locked=false;
 const nxt=$('#nextQuestion');
 const show=()=>{locked=false;$('#questionCount').textContent=`Pergunta ${i+1} de ${Q.length}`;qa.textContent=Q[i].q;
  $('#quizFeedback').textContent='';nxt.hidden=true;const a=$('#answers');a.innerHTML='';
  Q[i].o.forEach((t,k)=>{const b=document.createElement('button');b.className='answer';b.textContent=t;b.onclick=()=>pick(k,b);a.appendChild(b)})};
 function pick(k,b){
  if(locked)return;locked=true;const ok=k===Q[i].c;
  $$('.answer').forEach((x,j)=>{x.disabled=true;if(j===Q[i].c)x.classList.add('right')});
  if(ok)pts+=10;else b.classList.add('wrong');
  $('#score').textContent=pts;$('#quizFeedback').textContent=ok?'Correto! +10 pontos':'Não foi dessa vez. A resposta certa está em verde.';
  nxt.textContent=i===Q.length-1?'Ver resultado →':'Próxima pergunta →';nxt.hidden=false}
 nxt.onclick=()=>{i++;if(i<Q.length)return show();
  $('#quizArea').hidden=true;$('#gameResult').hidden=false;$('#finalScore').textContent=pts+' / '+Q.length*10;
  const r=pts>=50?['Guardião da Vida','Excelente! Você conhece bem a conservação.']:pts>=30?['Protetor em formação','Bom resultado! Explore as espécies para aprender mais.']:['Explorador iniciante','Visite o catálogo de espécies e tente de novo.'];
  $('#resultTitle').textContent=r[0];$('#resultText').textContent=r[1]};
 $('#restartQuiz').onclick=()=>{i=0;pts=0;$('#score').textContent=0;$('#gameResult').hidden=true;$('#quizArea').hidden=false;show()};
 show();
}
})();
