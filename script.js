// Public site script: loads beats.json and renders rows (no admin logic)
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

let CATALOG = [];
const rows = {
  new: $('#row-new'),
  trap: $('#row-trap'),
  funk: $('#row-funk'),
  lofi: $('#row-lofi'),
};

async function loadCatalog() {
  try {
    const res = await fetch('beats.json', { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    CATALOG = (data.items || data).map(normalizeItem);
    renderAll();
  } catch (err) {
    console.error('Falha ao carregar beats.json:', err);
    // Render with empty state
    Object.values(rows).forEach(r => r.innerHTML = `<div class="empty">Catálogo vazio. Suba um beats.json.</div>`);
  }
}

function normalizeItem(it){
  return {
    id: it.id || uid(),
    title: it.title || 'Beat',
    genre: it.genre || 'Trap',
    bpm: Number(it.bpm) || 140,
    key: it.key || 'Am',
    price: Number(it.price) || 0,
    license: it.license || 'Basic',
    cover: it.cover || '',
    audio: it.audio || '',
    buy: it.buy || '',
    tags: Array.isArray(it.tags) ? it.tags : String(it.tags||'').split(',').map(s=>s.trim()).filter(Boolean),
    createdAt: Number(it.createdAt) || Date.now(),
  };
}

function uid(){ return Math.random().toString(36).slice(2) + Date.now().toString(36); }

function card(item){
  const el = document.createElement('article'); el.className = 'card';
  el.innerHTML = `
    <img class="cover" loading="lazy" alt="Capa do beat ${escapeHtml(item.title)}" src="${escapeAttr(item.cover)}"/>
    <button class="card__play" data-id="${item.id}" aria-label="Ouvir">▶</button>
    <a class="buybtn" href="${escapeAttr(item.buy)}" target="_blank" rel="noopener">Comprar</a>
    <div class="card__info">
      <div class="title">${escapeHtml(item.title)}</div>
      <div class="meta">${escapeHtml(item.genre)} • ${item.bpm} BPM • ${escapeHtml(item.key)}</div>
    </div>`;
  el.querySelector('.card__play').addEventListener('click', (e)=>{ e.stopPropagation(); openPlayer(item.id); });
  el.addEventListener('click', (e)=>{ if(!(e.target.closest('a')||e.target.closest('button'))) openPlayer(item.id) });
  return el;
}

function renderAll(){
  const sorted = [...CATALOG].sort((a,b)=> b.createdAt - a.createdAt);
  // clear
  rows.new.innerHTML=''; rows.trap.innerHTML=''; rows.funk.innerHTML=''; rows.lofi.innerHTML='';
  // populate
  sorted.forEach(item=>{
    rows.new.appendChild(card(item));
    if(/trap|rap/i.test(item.genre)) rows.trap.appendChild(card(item));
    if(/funk|br/i.test(item.genre)) rows.funk.appendChild(card(item));
    if(/lo-?fi|chill/i.test(item.genre)) rows.lofi.appendChild(card(item));
  });
  // Lazy auto-scroll performance: un-observe once filled
}

// Search
$('#q').addEventListener('input', (e)=>{
  const q = e.target.value.trim().toLowerCase();
  if(!q){ renderAll(); return; }
  const res = CATALOG.filter(x=>
    x.title.toLowerCase().includes(q) ||
    x.genre.toLowerCase().includes(q) ||
    String(x.bpm).includes(q) ||
    x.key.toLowerCase().includes(q) ||
    x.tags.join(' ').toLowerCase().includes(q)
  );
  rows.new.innerHTML=''; rows.trap.innerHTML=''; rows.funk.innerHTML=''; rows.lofi.innerHTML='';
  res.forEach(i=> rows.new.appendChild(card(i)));
});

// Player modal
const modal = $('#player');
$('#btn-close').addEventListener('click', ()=> modal.classList.remove('show'));
modal.addEventListener('click', (e)=>{ if(e.target === modal) modal.classList.remove('show'); });

function openPlayer(id){
  const it = CATALOG.find(x=>x.id===id); if(!it) return;
  $('#player-title').textContent = it.title;
  $('#p-genre').textContent = it.genre;
  $('#p-bpm').textContent = it.bpm;
  $('#p-key').textContent = it.key;
  $('#p-price').textContent = it.price.toFixed(2);
  $('#p-lic').textContent = it.license || '—';
  $('#p-tags').textContent = it.tags?.join(', ') || '—';
  $('#p-cover').src = it.cover;
  const audio = $('#p-audio'); audio.src = it.audio; audio.currentTime = 0; audio.play().catch(()=>{});
  $('#p-buy').href = it.buy || '#';
  $('#p-open-audio').href = it.audio || '#';
  modal.classList.add('show');
}

// utils
function escapeHtml(s=''){ return s.replace(/[&<>\"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m])); }
function escapeAttr(s=''){ return String(s||'').replace(/\"/g,'&quot;'); }

// Init
loadCatalog();
