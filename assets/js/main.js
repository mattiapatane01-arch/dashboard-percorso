/* Entry point — inizializza tutti i moduli */
import { loadData }                    from './data.js';
import { initGlobe }                   from './globe.js';
import { renderExpenses, renderSystems } from './stats.js';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const data = await loadData();

    renderHero(data.hero);
    initGlobe(data);
    renderExpenses(data.vanStats.weeklyExpenses);
    renderSystems(data.systems);
    initTelegram(data.telegram);
    initBuild(data.telegram);
    renderMaterials(data.resources.pdfs);
    renderSocial(data.social);

    // Stelle JS su tutte le sezioni dark + hero
    document.querySelectorAll('#hero, .stars-bg').forEach(el => createStars(el, 150));

  } catch (err) {
    console.error('Errore caricamento data.json:', err);
  }
});

// ── Hero ─────────────────────────────────────────────────────────────────────

function renderHero(hero) {
  document.getElementById('hero-name').textContent        = hero.name;
  document.getElementById('hero-tagline').textContent     = hero.tagline;
  document.getElementById('hero-description').textContent = hero.description;
}

// ── Telegram ──────────────────────────────────────────────────────────────────

function initTelegram(telegram) {
  const btn = document.getElementById('telegram-btn');
  if (btn) btn.href = telegram.url;

  const countEl = document.getElementById('telegram-count');
  if (!countEl) return;

  const CountUpCtor = typeof CountUp === 'function' ? CountUp
                    : (typeof countUp !== 'undefined' ? countUp.CountUp : null);

  if (!CountUpCtor) {
    countEl.textContent = (telegram.subscribers ?? 0).toLocaleString('it-IT');
    return;
  }

  const observer = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    const cu = new CountUpCtor(countEl, telegram.subscribers ?? 0, {
      duration: 2.2,
      separator: '.',
      decimal: ',',
    });
    cu.start();
    observer.disconnect();
  }, { threshold: 0.5 });

  observer.observe(document.getElementById('telegram'));
}

// ── Costruzione sistema — hover/touch-to-fill ─────────────────────────────────

function initBuild(telegram) {
  const pct   = telegram.systemProgress ?? 0;
  const fill  = document.getElementById('build-fill');
  const pctEl = document.getElementById('build-pct');

  if (pctEl) pctEl.textContent = `${pct}%`;
  if (!fill) return;

  fill.style.width = '0%';
  fill.style.transition = 'width 2s ease-out';

  const section = document.getElementById('build-and-materials');
  if (!section) { fill.style.width = `${pct}%`; return; }

  // Hover desktop + touch mobile: riempie la barra (una sola volta, non torna a 0)
  const triggerFill = () => {
    if (fill.dataset.filled) return;
    fill.style.width = `${pct}%`;
    fill.dataset.filled = 'true';
  };
  section.addEventListener('mouseenter', triggerFill);
  section.addEventListener('touchstart', triggerFill, { passive: true });
}

// ── Stelle JS random ──────────────────────────────────────────────────────────

function createStars(container, count = 150) {
  if (getComputedStyle(container).position === 'static') {
    container.style.position = 'relative';
  }

  const layer = document.createElement('div');
  layer.className = 'stars-layer';
  layer.setAttribute('aria-hidden', 'true');
  layer.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:hidden;';

  for (let i = 0; i < count; i++) {
    const star = document.createElement('span');
    const opacity = (Math.random() * 0.5 + 0.3).toFixed(2);
    star.style.cssText = [
      'position:absolute',
      'width:2px',
      'height:2px',
      `background:rgba(255,255,255,${opacity})`,
      'border-radius:50%',
      `top:${(Math.random() * 100).toFixed(2)}%`,
      `left:${(Math.random() * 100).toFixed(2)}%`,
      'pointer-events:none',
    ].join(';');

    // 30% delle stelle tremolano
    if (Math.random() < 0.3) {
      const dur   = (Math.random() * 3 + 2).toFixed(1);
      const delay = (Math.random() * 5).toFixed(1);
      star.style.animation = `twinkle ${dur}s ease-in-out ${delay}s infinite`;
    }

    layer.appendChild(star);
  }

  // Prepend: stelle prima del contenuto (contenuto con z-index:1 resta sopra)
  container.insertBefore(layer, container.firstChild);
}

// ── Materiali PDF ─────────────────────────────────────────────────────────────

function renderMaterials(pdfs) {
  const grid = document.getElementById('materials-grid');
  if (!grid) return;

  if (!pdfs || pdfs.length === 0) {
    const card = document.createElement('div');
    card.className = 'material-card material-card--empty';
    const title = document.createElement('p');
    title.className = 'material-card__title';
    title.textContent = 'In arrivo…';
    const desc = document.createElement('p');
    desc.className = 'material-card__desc';
    desc.textContent = 'I materiali verranno aggiunti a breve.';
    card.append(title, desc);
    grid.appendChild(card);
    return;
  }

  for (const pdf of pdfs) {
    const card = document.createElement('div');
    card.className = 'material-card';

    const title = document.createElement('p');
    title.className = 'material-card__title';
    title.textContent = pdf.title;

    const desc = document.createElement('p');
    desc.className = 'material-card__desc';
    desc.textContent = pdf.description;

    const link = document.createElement('a');
    link.className = 'material-card__link';
    link.href = pdf.path;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = '↓ Scarica PDF';

    card.append(title, desc, link);
    grid.appendChild(card);
  }
}

// ── Social links ───────────────────────────────────────────────────────────────

function renderSocial(social) {
  const list = document.getElementById('social-list');
  if (!list || !social?.length) return;

  for (const s of social) {
    if (!s.url?.trim()) continue;

    const a = document.createElement('a');
    a.className = 'social-link';
    a.href      = s.url;
    a.target    = '_blank';
    a.rel       = 'noopener noreferrer';

    const iconWrap = document.createElement('div');
    iconWrap.className = 'social-link__icon';

    const img = document.createElement('img');
    img.src    = `assets/img/icon-${s.platform.toLowerCase()}.png`;
    img.alt    = '';
    img.width  = 48;
    img.height = 48;

    const emoji = document.createElement('span');
    emoji.className = 'social-link__emoji';
    emoji.setAttribute('aria-hidden', 'true');
    emoji.textContent  = s.emoji;
    emoji.style.display = 'none';

    img.addEventListener('error', () => {
      img.style.display   = 'none';
      emoji.style.display = 'block';
    });

    iconWrap.append(img, emoji);

    const handle = document.createElement('span');
    handle.className  = 'social-link__handle';
    handle.textContent = s.handle;

    a.append(iconWrap, handle);
    list.appendChild(a);
  }
}
