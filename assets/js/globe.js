/**
 * globe.js — Mapbox GL JS v3.3.0
 * Satellite texture, space fog, stars, scia rossa tratteggiata, marker HTML circolari
 */

const TOKEN = 'pk.eyJ1IjoibWF0dGlhcGF0YW5lIiwiYSI6ImNtcHFrYzhqajBhY2QzeHE3M2lxODV6c2MifQ.ubuDyybPhOihPoVU4LI2rg';

let map       = null;
let appData   = null;
let tooltipEl = null;

// ── Marker HTML ───────────────────────────────────────────────────────────────

function createMarkerEl(wp, isLast) {
  const el = document.createElement('div');
  el.className = 'globe-marker ' + (isLast ? 'globe-marker--van' : 'globe-marker--person');

  const img = document.createElement('img');
  img.alt = wp.name;
  img.src = isLast ? 'assets/img/van-marker.png' : 'assets/img/avatar-marker.png';
  img.addEventListener('error', () => {
    img.style.display = 'none';
    el.classList.add('globe-marker--dot');
  });

  el.appendChild(img);
  return el;
}

// ── Tooltip ───────────────────────────────────────────────────────────────────

function showTooltip(clientX, clientY, wp, showKm = false) {
  if (!tooltipEl || !appData) return;

  document.getElementById('globe-tooltip-city').textContent = `📍 ${wp.name}`;
  const detail = document.getElementById('globe-tooltip-detail');

  if (showKm) {
    detail.textContent = `${appData.vanStats.totalKm.toLocaleString('it-IT')} km percorsi`;
  } else {
    const d = new Date(wp.date + 'T00:00:00');
    detail.textContent = d.toLocaleDateString('it-IT', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  }

  tooltipEl.removeAttribute('hidden');

  const rect = document.getElementById('globe-container').getBoundingClientRect();
  tooltipEl.style.left = `${clientX - rect.left + 14}px`;
  tooltipEl.style.top  = `${clientY - rect.top  - 8}px`;
}

function hideTooltip() { tooltipEl?.setAttribute('hidden', ''); }

// ── Export ────────────────────────────────────────────────────────────────────

export function initGlobe(data) {
  appData = data;
  const container = document.getElementById('globe-container');
  if (!container || typeof mapboxgl === 'undefined') {
    console.warn('globe: container o mapboxgl mancante');
    return;
  }

  tooltipEl       = document.getElementById('globe-tooltip');
  mapboxgl.accessToken = TOKEN;

  map = new mapboxgl.Map({
    container:         'globe-container',
    style:             'mapbox://styles/mapbox/satellite-v9',
    projection:        'globe',
    center:            [133, -25],
    zoom:              2.5,
    scrollZoom:        true,
    doubleClickZoom:   false,
    boxZoom:           false,
    keyboard:          false,
    attributionControl: false,
    pitchWithRotate:   false,
  });

  map.touchZoomRotate.enable();

  map.on('load', () => {
    // ── Fog: spazio nero + stelle + atmosfera azzurra ──
    map.setFog({
      'range':          [0.5, 10],
      'color':          '#000000', // era #08143c (blu) — ora nero puro, nessun glow
      'high-color':     '#000000',
      'horizon-blend':  0.02,
      'space-color':    '#000000',
      'star-intensity': 0.5,
    });

    const wps = data.map.waypoints;

    // ── Scia rossa tratteggiata sottile ──
    map.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: wps.map(wp => [wp.lng, wp.lat]),
        },
      },
    });

    map.addLayer({
      id:     'route-line',
      type:   'line',
      source: 'route',
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: {
        'line-color':     '#FF3D00',
        'line-width':     2,
        'line-dasharray': [2, 2],
        'line-opacity':   0.9,
      },
    });

    // ── Markers HTML ──
    wps.forEach((wp, i) => {
      const isLast = i === wps.length - 1;
      const el     = createMarkerEl(wp, isLast);

      new mapboxgl.Marker({ element: el, anchor: 'center' })
        .setLngLat([wp.lng, wp.lat])
        .addTo(map);

      el.addEventListener('click', e => {
        e.stopPropagation();
        // Van (Melbourne) mostra km; waypoint passati mostrano data
        showTooltip(e.clientX, e.clientY, wp, isLast);
      });
    });
  });

  // Click su area vuota del globo: mostra Melbourne + km
  map.on('click', () => {
    const wps  = data.map.waypoints;
    const last = wps[wps.length - 1];
    const rect = document.getElementById('globe-container').getBoundingClientRect();
    showTooltip(rect.left + rect.width / 2, rect.top + rect.height / 2, last, true);
  });

  // Click fuori dal globo: nascondi tooltip
  document.addEventListener('click', e => {
    if (!container.contains(e.target)) hideTooltip();
  });

  // Evento custom 'globe:resize' — chiamato da stats.js dopo CountUp
  document.addEventListener('globe:resize', () => {
    if (map) setTimeout(() => map.resize(), 50);
  });
}
