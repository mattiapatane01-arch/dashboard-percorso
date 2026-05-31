/**
 * stats.js — Spese settimanali XP bars + Sistemi investimento (dark theme v3)
 */

// ── Spese ────────────────────────────────────────────────────────────────────

export function renderExpenses(expenses) {
  const container = document.getElementById('stats-expenses');
  if (!container) return;

  const total = expenses.reduce((s, e) => s + (e.amount || 0), 0);

  const col = document.createElement('div');
  col.className = 'stats-col';

  const title = document.createElement('h3');
  title.className = 'stats-col__title';
  title.textContent = 'Spese settimana';
  col.appendChild(title);

  const barsWrap = document.createElement('div');
  barsWrap.className = 'xp-bars';

  for (const e of expenses) {
    barsWrap.appendChild(buildExpenseBar(e, total));
  }

  col.appendChild(barsWrap);

  // Card totale spese
  const totalCard = document.createElement('div');
  totalCard.className = 'expenses-total';
  const tLabel = document.createElement('span');
  tLabel.className = 'expenses-total__label';
  tLabel.textContent = 'Totale spese';
  const tAmount = document.createElement('span');
  tAmount.className = 'expenses-total__amount';
  tAmount.textContent = `${total} ${expenses[0]?.currency || 'EUR'}`;
  totalCard.append(tLabel, tAmount);
  col.appendChild(totalCard);

  container.appendChild(col);

  attachTooltipEvents(container, '.xp-bar', '.xp-tooltip');
}

function buildExpenseBar(e, total) {
  const pct    = total > 0 ? Math.round((e.amount || 0) / total * 100) : 0;
  const prev   = e.previousAmount || 0;
  const delta  = (e.amount || 0) - prev;
  const hasPrev = prev !== 0;

  const wrap = document.createElement('div');
  wrap.className = 'xp-bar';
  wrap.setAttribute('role', 'group');
  wrap.setAttribute('aria-label', `${e.category}: ${e.amount} ${e.currency}`);

  const header = document.createElement('div');
  header.className = 'xp-bar__header';

  const emoji = document.createElement('span');
  emoji.className = 'xp-bar__emoji';
  emoji.setAttribute('aria-hidden', 'true');
  emoji.textContent = e.emoji;

  const label = document.createElement('span');
  label.className = 'xp-bar__label';
  label.textContent = e.category;

  const amount = document.createElement('span');
  amount.className = 'xp-bar__amount';
  amount.textContent = `${e.amount || 0} ${e.currency}`;

  header.append(emoji, label, amount);

  const track = document.createElement('div');
  track.className = 'xp-bar__track';
  const fill = document.createElement('div');
  fill.className = 'xp-bar__fill';
  fill.style.width = '0%';
  fill.dataset.target = `${pct}%`;
  track.appendChild(fill);

  const tip = document.createElement('div');
  tip.className = 'xp-tooltip';
  tip.setAttribute('hidden', '');

  const tipLabel = document.createElement('span');
  tipLabel.textContent = 'vs settimana scorsa';

  const tipValue = document.createElement('strong');
  if (!hasPrev) {
    tipValue.textContent = 'N/D';
  } else {
    const sign = delta >= 0 ? '+' : '';
    tipValue.textContent = `${sign}${delta.toFixed(0)} ${e.currency}`;
    tipValue.className = delta > 0 ? 'tip--up' : delta < 0 ? 'tip--down' : '';
  }

  tip.append(tipLabel, tipValue);
  wrap.append(header, track, tip);

  // Hover desktop + touch mobile: riempie la barra (una sola volta, non torna a 0)
  const triggerFill = () => {
    if (fill.dataset.filled) return;
    fill.style.width = fill.dataset.target || '0%';
    fill.dataset.filled = 'true';
  };
  wrap.addEventListener('mouseenter', triggerFill);
  wrap.addEventListener('touchstart', triggerFill, { passive: true });

  return wrap;
}

// ── Sistemi investimento ──────────────────────────────────────────────────────

export function renderSystems(systems) {
  const container = document.getElementById('stats-systems');
  if (!container) return;

  const totalCapital = systems.reduce((s, sys) => s + (sys.capital || 0), 0);
  const totalPnL     = systems.reduce((s, sys) => s + (sys.weeklyPnL || 0), 0);
  const currency     = systems[0]?.currency || 'EUR';

  const col = document.createElement('div');
  col.className = 'stats-col';

  // ── Card totale capitale + avatar (riga flex) ──
  const totalWrap = document.createElement('div');
  totalWrap.className = 'systems-total';

  const totalLabel = document.createElement('span');
  totalLabel.className = 'systems-total__label';
  totalLabel.textContent = 'Capitale totale';

  const totalValue = document.createElement('strong');
  totalValue.className = 'systems-total__value';
  totalValue.id = 'systems-total-value';
  totalValue.textContent = `0 ${currency}`;

  totalWrap.append(totalLabel, totalValue);

  // Badge P&L totale
  const pnlBadgeEl = totalPnL !== 0 ? (() => {
    const b = document.createElement('span');
    b.className = `systems-total__pnl systems-total__pnl--${totalPnL > 0 ? 'green' : 'red'}`;
    b.id = 'systems-total-pnl';
    b.textContent = `${totalPnL > 0 ? '+' : ''}0 ${currency}`;
    totalWrap.appendChild(b);
    return b;
  })() : null;

  // Riga wrapper: card totale + avatar a destra
  const totalRow = document.createElement('div');
  totalRow.className = 'systems-total-wrap';
  totalRow.appendChild(totalWrap);

  if (totalPnL !== 0) {
    const avatarImg = document.createElement('img');
    avatarImg.className = 'systems-avatar';
    avatarImg.src = totalPnL > 0 ? 'assets/img/avatar-phone.png' : 'assets/img/avatar-phone-loss.png';
    avatarImg.alt = '';
    avatarImg.addEventListener('error', () => avatarImg.remove());
    totalRow.appendChild(avatarImg);
  }

  col.appendChild(totalRow);

  // ── Card sistemi ──
  for (const sys of systems) {
    col.appendChild(buildSystemCard(sys));
  }

  // ── Disclaimer sotto i sistemi ──
  const disclaimer = document.createElement('p');
  disclaimer.className = 'systems-disclaimer';
  disclaimer.innerHTML = '↑ Profitti dell\'ultima settimana &nbsp;·&nbsp; I risultati passati non garantiscono rendimenti futuri. Dati reali, aggiornati ogni domenica.';
  col.appendChild(disclaimer);

  container.appendChild(col);

  // PnL badge — statico (CountUp sul PnL causa bug mappa)
  if (pnlBadgeEl) {
    pnlBadgeEl.textContent = `${totalPnL > 0 ? '+' : ''}${totalPnL} ${currency}`;
  }

  // Capitale totale — fallback statico immediato
  totalValue.textContent = `${totalCapital.toLocaleString('it-IT')} ${currency}`;

  // CountUp con IntersectionObserver — parte quando la card entra nel viewport
  const totalEl = document.getElementById('systems-total-value');
  if (totalEl && typeof countUp !== 'undefined') {
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        const cu = new countUp.CountUp(
          'systems-total-value',
          10330,
          {
            duration: 2.5,
            separator: '.',
            suffix: ' EUR',
            startVal: 0,
          }
        );
        if (!cu.error) cu.start();
        observer.disconnect();
      },
      { threshold: 0.3 }
    );
    observer.observe(totalEl);
  }
}

function buildSystemCard(sys) {
  const pnl    = sys.weeklyPnL || 0;
  const cap    = sys.capital   || 0;
  const pnlAbs = Math.abs(pnl);
  const pnlPct = cap > 0 ? (pnlAbs / cap * 100).toFixed(1) : '0.0';
  const ovlW   = cap > 0 ? Math.min(pnlAbs / cap * 100, 40) : 0;
  const sign   = pnl > 0 ? '+' : '';

  const card = document.createElement('div');
  card.className = 'system-card';
  card.setAttribute('role', 'group');
  card.setAttribute('aria-label', `${sys.name}: ${cap} ${sys.currency}`);

  const header = document.createElement('div');
  header.className = 'system-card__header';
  const name = document.createElement('span');
  name.className = 'system-card__name';
  name.textContent = sys.name;
  header.appendChild(name);

  const track = document.createElement('div');
  track.className = 'system-card__track';
  const base = document.createElement('div');
  base.className = 'system-card__base';
  track.appendChild(base);

  // overlay dichiarato fuori dall'if per essere accessibile nel click handler
  let overlayEl = null;
  if (pnl !== 0) {
    overlayEl = document.createElement('div');
    overlayEl.className = `system-card__overlay system-card__overlay--${pnl > 0 ? 'green' : 'red'}`;
    overlayEl.style.width = '0%';
    overlayEl.dataset.target = `${ovlW}%`;
    track.appendChild(overlayEl);
  }

  // Riga capitale + badge PnL inline sulla stessa riga
  const amountRow = document.createElement('div');
  amountRow.className = 'system-card__amount-row';

  const amount = document.createElement('span');
  amount.className = 'system-card__amount';
  amount.textContent = `${cap.toLocaleString('it-IT')} ${sys.currency}`;
  amountRow.appendChild(amount);

  if (pnl !== 0) {
    const pnlBadge = document.createElement('span');
    pnlBadge.className = `system-card__pnl system-card__pnl--${pnl > 0 ? 'green' : 'red'}`;
    if (pnl > 0) pnlBadge.style.color = '#00C853';
    if (pnl < 0) pnlBadge.style.color = '#FF3D00';
    pnlBadge.textContent = `${sign}${pnl} ${sys.currency}`;
    amountRow.appendChild(pnlBadge);
  }

  card.append(header, track, amountRow);

  // Hover desktop + touch mobile: riempie l'overlay PnL (una sola volta, non torna a 0)
  if (overlayEl) {
    const triggerFill = () => {
      if (overlayEl.dataset.filled) return;
      overlayEl.style.width = overlayEl.dataset.target || '0%';
      overlayEl.dataset.filled = 'true';
    };
    card.addEventListener('mouseenter', triggerFill);
    card.addEventListener('touchstart', triggerFill, { passive: true });
  }

  return card;
}

// ── Utility tooltip shared ────────────────────────────────────────────────────

function attachTooltipEvents(container, itemSel, tipSel) {
  const items = container.querySelectorAll(itemSel);

  items.forEach(item => {
    const tip = item.querySelector(tipSel);
    if (!tip) return;

    item.addEventListener('mouseenter', () => tip.removeAttribute('hidden'));
    item.addEventListener('mouseleave', () => tip.setAttribute('hidden', ''));

    item.addEventListener('click', e => {
      e.stopPropagation();
      const hidden = tip.hasAttribute('hidden');
      container.querySelectorAll(tipSel).forEach(t => t.setAttribute('hidden', ''));
      if (hidden) tip.removeAttribute('hidden');
    });
  });

  document.addEventListener('click', () => {
    container.querySelectorAll(tipSel).forEach(t => t.setAttribute('hidden', ''));
  });
}
