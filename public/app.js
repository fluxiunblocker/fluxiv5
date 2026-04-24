/* ===== FLUXI V5 — APP.JS ===== */

// ─── CURSOR ─────────────────────────────────────────────
const ring = document.getElementById('cursor-ring');
const dot  = document.getElementById('cursor-dot');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + 'px';
  dot.style.top  = my + 'px';
});
(function cursorLoop() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(cursorLoop);
})();
document.querySelectorAll('button,a,input,.qs-btn,.ctrl-btn').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-active'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-active'));
});

// ─── BOOT SCREEN ────────────────────────────────────────
const bootCanvas = document.getElementById('boot-canvas');
const bCtx = bootCanvas.getContext('2d');
function resizeBoot() { bootCanvas.width = innerWidth; bootCanvas.height = innerHeight; }
resizeBoot();
window.addEventListener('resize', resizeBoot);

const bParts = Array.from({length: 120}, () => ({
  x: Math.random() * innerWidth,
  y: Math.random() * innerHeight,
  vx: (Math.random()-.5)*.4,
  vy: (Math.random()-.5)*.4,
  r: Math.random()*1.5+.5,
  a: Math.random()*.6+.1,
  c: Math.random()>.5 ? '#00f5ff' : '#ff6b1a',
}));

let bRAF;
function animateBoot() {
  bCtx.clearRect(0, 0, bootCanvas.width, bootCanvas.height);
  bCtx.fillStyle = 'rgba(0,0,0,0.94)';
  bCtx.fillRect(0, 0, bootCanvas.width, bootCanvas.height);
  bCtx.strokeStyle = 'rgba(0,245,255,0.04)';
  bCtx.lineWidth = .5;
  for (let i = 0; i < bParts.length; i++) {
    for (let j = i+1; j < bParts.length; j++) {
      const dx = bParts[i].x-bParts[j].x, dy = bParts[i].y-bParts[j].y;
      const d = Math.sqrt(dx*dx+dy*dy);
      if (d < 120) {
        bCtx.globalAlpha = (1-d/120)*.25;
        bCtx.beginPath();
        bCtx.moveTo(bParts[i].x,bParts[i].y);
        bCtx.lineTo(bParts[j].x,bParts[j].y);
        bCtx.stroke();
      }
    }
  }
  bParts.forEach(p => {
    p.x = (p.x+p.vx+innerWidth)%innerWidth;
    p.y = (p.y+p.vy+innerHeight)%innerHeight;
    bCtx.globalAlpha = p.a;
    bCtx.fillStyle = p.c;
    bCtx.shadowBlur = 8; bCtx.shadowColor = p.c;
    bCtx.beginPath(); bCtx.arc(p.x,p.y,p.r,0,Math.PI*2); bCtx.fill();
    bCtx.shadowBlur = 0;
  });
  bCtx.globalAlpha = 1;
  bRAF = requestAnimationFrame(animateBoot);
}
animateBoot();

const fill = document.getElementById('boot-fill');
const pctEl = document.getElementById('boot-percent');
const logEl = document.getElementById('boot-log');
const bootLogs = [
  '> BOOTING NEURAL GATEWAY...',
  '> LOADING UV SERVICE WORKER...',
  '> CONNECTING WISP TRANSPORT...',
  '> INITIALIZING EPOXY/TLS...',
  '> ENCRYPTING PROXY TUNNEL...',
  '> MOUNTING BARE MUX...',
  '> FLUXI V5 PROXY READY.',
];

let progress = 0, logIdx = 0;
function runBoot() {
  const t = setInterval(() => {
    progress = Math.min(progress + Math.random()*4+1, 100);
    fill.style.width = progress + '%';
    pctEl.textContent = Math.floor(progress) + '%';
    const nl = Math.floor((progress/100)*(bootLogs.length-1));
    if (nl !== logIdx) { logIdx = nl; logEl.innerHTML = `<span>${bootLogs[logIdx]}</span>`; }
    if (progress >= 100) { clearInterval(t); setTimeout(exitBoot, 500); }
  }, 40);
}
function exitBoot() {
  cancelAnimationFrame(bRAF);
  document.getElementById('boot-screen').classList.add('exit');
  document.getElementById('app').classList.remove('hidden');
  initApp();
  setTimeout(() => document.getElementById('boot-screen').style.display = 'none', 900);
}
setTimeout(runBoot, 1500);

// ─── MAIN APP ────────────────────────────────────────────
function initApp() {
  initBgCanvas();
  initProxy();
}

// ─── BG CANVAS ───────────────────────────────────────────
function initBgCanvas() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  function resize() { canvas.width = innerWidth; canvas.height = innerHeight; }
  resize(); window.addEventListener('resize', resize);

  const stars = Array.from({length:180}, () => ({
    x:Math.random()*innerWidth, y:Math.random()*innerHeight,
    r:Math.random()*1.5+.3, a:Math.random()*.7+.1,
    t:Math.random()*Math.PI*2, sp:Math.random()*.02+.005,
  }));
  const hexes = Array.from({length:6}, () => ({
    x:Math.random()*innerWidth, y:Math.random()*innerHeight,
    r:Math.random()*40+20, ang:Math.random()*Math.PI*2,
    rs:(Math.random()-.5)*.005,
    op:Math.random()*.05+.015,
    c:Math.random()>.5?'#00f5ff':'#8b5cf6',
  }));

  let imx = innerWidth/2, imy = innerHeight/2;
  document.addEventListener('mousemove', e => { imx = e.clientX; imy = e.clientY; });

  function drawHex(cx,cy,r,a) {
    ctx.beginPath();
    for(let i=0;i<6;i++){const A=a+(i*Math.PI*2)/6;i?ctx.lineTo(cx+r*Math.cos(A),cy+r*Math.sin(A)):ctx.moveTo(cx+r*Math.cos(A),cy+r*Math.sin(A));}
    ctx.closePath();
  }
  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const g = ctx.createRadialGradient(canvas.width/2,canvas.height*.4,0,canvas.width/2,canvas.height*.4,canvas.width*.7);
    g.addColorStop(0,'#060e1c'); g.addColorStop(.5,'#04090f'); g.addColorStop(1,'#030712');
    ctx.fillStyle = g; ctx.fillRect(0,0,canvas.width,canvas.height);
    const mg = ctx.createRadialGradient(imx,imy,0,imx,imy,280);
    mg.addColorStop(0,'rgba(0,245,255,0.02)'); mg.addColorStop(1,'transparent');
    ctx.fillStyle = mg; ctx.fillRect(0,0,canvas.width,canvas.height);
    stars.forEach(s => {
      s.t += s.sp;
      ctx.globalAlpha = s.a*(0.5+0.5*Math.sin(s.t));
      ctx.fillStyle='#c0e8ff'; ctx.shadowBlur=3; ctx.shadowColor='#00f5ff';
      ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill();
    });
    ctx.shadowBlur=0;
    hexes.forEach(h => {
      h.ang += h.rs;
      ctx.globalAlpha = h.op; ctx.strokeStyle = h.c; ctx.lineWidth = 1;
      drawHex(h.x,h.y,h.r,h.ang); ctx.stroke();
    });
    ctx.globalAlpha=1;
    requestAnimationFrame(draw);
  }
  draw();
}

// ─── PROXY ───────────────────────────────────────────────
const proxyState = {
  tabs: [],
  activeTabId: null,
  nextTabId: 1,
};

const proxyEls = {};

async function initProxy() {
  proxyEls.homeView = document.getElementById('home-view');
  proxyEls.browserView = document.getElementById('browser-view');
  proxyEls.controls = document.getElementById('browser-controls');
  proxyEls.loading = document.getElementById('iframe-loading');
  proxyEls.loadingUrl = document.getElementById('loading-url');
  proxyEls.frame = document.getElementById('proxy-frame');
  proxyEls.urlBar = document.getElementById('url-display');
  proxyEls.searchInput = document.getElementById('search-input');
  proxyEls.searchButton = document.getElementById('search-btn');
  proxyEls.tabList = document.getElementById('tab-list');
  proxyEls.tabAdd = document.getElementById('tab-add');

  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('/uv/sw.js', { scope: '/uv/service/' });
      console.log('[FLUXI] UV service worker registered');
    } catch(e) {
      console.warn('[FLUXI] SW registration failed:', e);
    }
  }

  try {
    if (typeof BareMux !== 'undefined') {
      const conn = new BareMux.BareMuxConnection('/baremux/worker.js');
      const wispUrl = (location.protocol === 'https:' ? 'wss' : 'ws') + '://' + location.host + '/wisp/';
      await conn.setTransport('/epoxy/index.mjs', [{ wisp: wispUrl }]);
      document.getElementById('st-wisp').textContent = 'CONNECTED';
      console.log('[FLUXI] Wisp/Epoxy transport active');
    }
  } catch(e) {
    console.warn('[FLUXI] Transport setup failed:', e);
    document.getElementById('st-wisp').textContent = 'FALLBACK';
  }

  proxyEls.searchButton.addEventListener('click', () => navigate(proxyEls.searchInput.value.trim()));
  proxyEls.searchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') navigate(proxyEls.searchInput.value.trim());
  });

  document.querySelectorAll('.qs-btn').forEach(button => {
    button.addEventListener('click', () => navigate(button.dataset.url));
  });

  document.getElementById('btn-back').addEventListener('click', () => {
    try { proxyEls.frame.contentWindow.history.back(); } catch(e) {}
  });
  document.getElementById('btn-forward').addEventListener('click', () => {
    try { proxyEls.frame.contentWindow.history.forward(); } catch(e) {}
  });
  document.getElementById('btn-reload').addEventListener('click', () => {
    try { proxyEls.frame.contentWindow.location.reload(); } catch(e) {
      proxyEls.frame.src = proxyEls.frame.src;
    }
  });
  document.getElementById('btn-home').addEventListener('click', () => navigate('https://www.google.com'));
  document.getElementById('btn-close').addEventListener('click', () => closeTab(proxyState.activeTabId));

  proxyEls.urlBar.addEventListener('keydown', e => {
    if (e.key === 'Enter') navigate(proxyEls.urlBar.value.trim());
  });

  proxyEls.tabList.addEventListener('click', event => {
    const closeButton = event.target.closest('.tab-close');
    if (closeButton) {
      event.stopPropagation();
      closeTab(Number(closeButton.dataset.tabId));
      return;
    }

    const tabButton = event.target.closest('.browser-tab');
    if (tabButton) activateTab(Number(tabButton.dataset.tabId));
  });
  proxyEls.tabAdd.addEventListener('click', () => openNewTab());

  proxyEls.frame.addEventListener('load', handleFrameLoad);
  window.addEventListener('message', handleProxyMessage);

  renderTabs();
}

function navigate(raw, options = {}) {
  const url = normalizeUrlInput(raw);
  if (!url) return;

  if (options.newTab || !proxyState.tabs.length) {
    openTab(url, { title: options.title });
    return;
  }

  const tab = getActiveTab();
  if (!tab) {
    openTab(url, { title: options.title });
    return;
  }

  updateTab(tab, url, options.title);
  loadActiveTab();
}

function openTab(url, options = {}) {
  const tab = {
    id: proxyState.nextTabId++,
    title: options.title || deriveTabTitle(url),
    displayUrl: url,
    proxiedUrl: buildProxiedUrl(url),
    loading: true,
  };

  proxyState.tabs.push(tab);
  proxyState.activeTabId = tab.id;
  loadActiveTab();
}

function openNewTab() {
  openTab('https://www.google.com', { title: 'New Tab' });
}

function activateTab(tabId) {
  if (!proxyState.tabs.some(tab => tab.id === tabId)) return;
  proxyState.activeTabId = tabId;
  loadActiveTab();
}

function closeTab(tabId) {
  if (!tabId) return;
  const index = proxyState.tabs.findIndex(tab => tab.id === tabId);
  if (index === -1) return;

  const wasActive = proxyState.activeTabId === tabId;
  proxyState.tabs.splice(index, 1);

  if (!proxyState.tabs.length) {
    proxyState.activeTabId = null;
    renderTabs();
    showHome();
    return;
  }

  if (wasActive) {
    const fallback = proxyState.tabs[Math.max(0, index - 1)] || proxyState.tabs[0];
    proxyState.activeTabId = fallback.id;
    loadActiveTab();
    return;
  }

  renderTabs();
}

function loadActiveTab() {
  const tab = getActiveTab();
  if (!tab) {
    showHome();
    return;
  }

  proxyEls.homeView.style.display = 'none';
  proxyEls.browserView.classList.remove('hidden');
  proxyEls.controls.classList.remove('hidden');
  proxyEls.loading.classList.remove('hidden');
  proxyEls.loadingUrl.textContent = tab.displayUrl;
  proxyEls.urlBar.value = tab.displayUrl;
  tab.loading = true;
  renderTabs();
  proxyEls.frame.src = tab.proxiedUrl;
}

function showHome() {
  proxyEls.homeView.style.display = '';
  proxyEls.browserView.classList.add('hidden');
  proxyEls.controls.classList.add('hidden');
  proxyEls.loading.classList.add('hidden');
  proxyEls.frame.src = 'about:blank';
}

function handleFrameLoad() {
  const tab = getActiveTab();
  if (!tab) return;

  proxyEls.loading.classList.add('hidden');
  attachTabBridge();

  try {
    const loc = proxyEls.frame.contentWindow.location.href;
    if (loc && loc !== 'about:blank') {
      tab.displayUrl = decodeProxiedUrl(loc) || loc;
      tab.proxiedUrl = loc;
      proxyEls.urlBar.value = tab.displayUrl;
      proxyEls.loadingUrl.textContent = tab.displayUrl;
    }
  } catch(e) {}

  try {
    const title = proxyEls.frame.contentDocument.title.trim();
    if (title) tab.title = title;
    else tab.title = deriveTabTitle(tab.displayUrl);
  } catch(e) {
    tab.title = deriveTabTitle(tab.displayUrl);
  }

  tab.loading = false;
  renderTabs();
}

function attachTabBridge() {
  try {
    const frameWindow = proxyEls.frame.contentWindow;
    const frameDocument = proxyEls.frame.contentDocument;
    if (!frameWindow || !frameDocument || frameWindow.__fluxiTabBridgeInstalled) return;

    frameWindow.__fluxiTabBridgeInstalled = true;

    const resolveFrameUrl = raw => {
      if (!raw) return '';
      const base = frameWindow.__uv && frameWindow.__uv.location
        ? frameWindow.__uv.location.href
        : frameWindow.location.href;
      return new URL(String(raw), base).href;
    };

    const openFrameTab = raw => {
      const url = normalizeUrlInput(resolveFrameUrl(raw), true);
      if (!url) return;
      openTab(url, { title: frameDocument.title || deriveTabTitle(url) });
    };

    frameWindow.open = function(url) {
      openFrameTab(url);
      return null;
    };

    frameDocument.addEventListener('click', event => {
      const anchor = event.target && event.target.closest ? event.target.closest('a[href]') : null;
      if (!anchor) return;
      const wantsTab = anchor.target === '_blank' || event.ctrlKey || event.metaKey || event.shiftKey || event.button === 1;
      if (!wantsTab) return;
      event.preventDefault();
      event.stopPropagation();
      openFrameTab(anchor.getAttribute('href'));
    }, true);

    frameDocument.addEventListener('auxclick', event => {
      if (event.button !== 1) return;
      const anchor = event.target && event.target.closest ? event.target.closest('a[href]') : null;
      if (!anchor) return;
      event.preventDefault();
      event.stopPropagation();
      openFrameTab(anchor.getAttribute('href'));
    }, true);

    frameDocument.addEventListener('submit', event => {
      const form = event.target;
      if (!form || form.target !== '_blank' || !form.action) return;
      event.preventDefault();
      event.stopPropagation();
      openFrameTab(form.action);
    }, true);
  } catch(e) {}
}

function handleProxyMessage(event) {
  const data = event.data;
  if (!data || data.type !== 'fluxi-open-tab') return;

  const url = normalizeUrlInput(data.url, true);
  if (!url) return;

  openTab(url, { title: data.title || deriveTabTitle(url) });
}

function getActiveTab() {
  return proxyState.tabs.find(tab => tab.id === proxyState.activeTabId) || null;
}

function updateTab(tab, url, title) {
  tab.displayUrl = url;
  tab.proxiedUrl = buildProxiedUrl(url);
  tab.title = title || deriveTabTitle(url);
  tab.loading = true;
}

function renderTabs() {
  proxyEls.tabList.innerHTML = proxyState.tabs.map(tab => {
    const activeClass = tab.id === proxyState.activeTabId ? ' active' : '';
    const title = escapeHtml(trimTabTitle(tab.title || deriveTabTitle(tab.displayUrl)));
    return `
      <button class="browser-tab${activeClass}" data-tab-id="${tab.id}" title="${title}">
        <span class="tab-accent"></span>
        <span class="tab-title">${title}</span>
        <span class="tab-close" data-tab-id="${tab.id}" aria-label="Close tab">x</span>
      </button>
    `;
  }).join('');
}

function normalizeUrlInput(raw, strictUrl = false) {
  if (!raw) return '';
  let url = String(raw).trim();
  if (!url || url === 'about:blank' || url.startsWith('javascript:')) return '';

  if (url.startsWith('/uv/service/')) {
    url = decodeProxiedUrl(location.origin + url) || url;
  } else if (url.includes('/uv/service/')) {
    url = decodeProxiedUrl(url) || url;
  }

  if (/^[a-zA-Z][a-zA-Z\d+.-]*:/.test(url)) return url;
  if (!strictUrl && (!url.includes('.') || url.includes(' '))) {
    return 'https://www.google.com/search?q=' + encodeURIComponent(url);
  }

  return 'https://' + url.replace(/^\/+/, '');
}

function deriveTabTitle(url) {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, '') || 'New Tab';
  } catch(e) {
    return 'New Tab';
  }
}

function trimTabTitle(title) {
  if (!title) return 'New Tab';
  return title.length > 26 ? title.slice(0, 23) + '...' : title;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildProxiedUrl(url) {
  // Use UV's XOR encoder if available
  if (window.__uv$config && typeof Ultraviolet !== 'undefined') {
    try {
      return __uv$config.prefix + Ultraviolet.codec.xor.encode(url);
    } catch(e) {}
  }
  // Fallback: basic encode
  return '/uv/service/' + btoa(url).replace(/=/g,'');
}

function decodeProxiedUrl(href) {
  try {
    const prefix = '/uv/service/';
    if (href.includes(prefix)) {
      const encoded = href.split(prefix)[1];
      if (window.__uv$config && typeof Ultraviolet !== 'undefined') {
        return Ultraviolet.codec.xor.decode(encoded.split('?')[0].split('#')[0]);
      }
      return atob(encoded.split('?')[0].split('#')[0]);
    }
  } catch(e) {}
  return null;
}
