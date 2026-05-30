# Dashboard Percorso — CLAUDE.md

Guida operativa per Claude Code su questo progetto. Leggi integralmente prima di toccare qualsiasi file.

---

## Chi è questo progetto

Dashboard pubblica personale di **Mattia Patanè** (@_mattiapatane_ su Instagram).
Creator italiano, 20 anni, attualmente in viaggio in van attraverso l'Australia.
La dashboard è pubblica, visibile da chiunque, aggiornata ogni domenica manualmente.

---

## Stack tecnico

- **HTML / CSS / JS puro** — zero build tool, zero framework. Nessun Vite, nessun React.
- **data.json** — unica fonte di verità per tutti i dati dinamici (tappe, stats, PDF, subscriber count)
- **Librerie JS via CDN** (uniche dipendenze accettate):
  - `Fredoka` — Google Fonts, font body/tagline/description
  - `Boogaloo` — Google Fonts, font display H1 (approvato sessione 2026-05-28)
  - `CountUp.js` — animazione subscriber count Telegram
  - `Mapbox GL JS v3.3.0` — globo satellitare stile Polarsteps (approvato sessione 2026-05-29)
    CDN JS:  `https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.js`
    CDN CSS: `https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css`
- **Valuta ufficiale: EUR** — sostituisce AUD in tutti i dati e label
- **Deploy target:** Netlify (configurazione in sessione separata futura)
- **Nessun backend.** Tutto statico.

### Regola assoluta sullo stack
Non proporre e non aggiungere bundler, framework, o dipendenze npm senza esplicita richiesta di Mattia.
Se una funzionalità sembra richiedere un backend, trova una soluzione statica.

---

## Palette e stile

| Token | Valore | Uso |
|---|---|---|
| `--yellow` | `#FFD600` | Accenti primari, CTA, highlight |
| `--black` | `#0A0A0A` | Background principale, testo su chiaro |
| `--white` | `#FFFFFF` | Testo su scuro, card background |
| `--bg` | `#FFFDF0` | Sfondo sezioni luminose (carta fumetto) |
| `--green` | `#00C853` | Profitto / positivo |
| `--red` | `#FF3D00` | Perdita / negativo |

**Font:** Fredoka (body) + Boogaloo (H1 display) — entrambi da Google Fonts.
**Mood:** cartoon minimal con carattere. Bordi netti, nessun gradiente elaborato, ombre solide offset (stile cartoon), angoli leggermente arrotondati.
**Mobile-first.** Ogni componente si progetta prima per 375px, poi si scala.

### Regole di design
- Mai usare colori fuori dalla palette senza approvazione
- Le ombre sono solide e offset (es. `4px 4px 0 #0A0A0A`), non sfumate
- Nessuna immagine raster dove un SVG o un elemento CSS può sostituirla
- Il giallo #FFD600 non va mai su bianco (contrasto insufficiente) — solo su nero o dark bg

---

## Struttura del progetto

```
dashboard-percorso/
├── index.html              # Entry point unico
├── data.json               # Tutti i dati dinamici — non modificare a mano senza lo skill update-data
├── assets/
│   ├── css/
│   │   ├── reset.css       # Reset + variabili CSS
│   │   ├── main.css        # Layout e componenti globali
│   │   └── sections/       # Un file CSS per sezione
│   ├── js/
│   │   ├── main.js         # Entry JS, inizializza tutto
│   │   ├── globe.js        # Globo 3D Canvas API (sostituisce map.js)
│   │   ├── stats.js        # Barre XP spese + barre sistemi investimento
│   │   ├── countup.js      # Animazione subscriber Telegram
│   │   └── data.js         # Fetch e parsing data.json
│   ├── img/
│   │   └── avatar.png      # Avatar cartoon Mattia
│   └── pdf/                # PDF scaricabili (file statici)
├── .claude/
│   ├── agents/             # Agenti specializzati
│   └── skills/             # Skills operative
└── CLAUDE.md               # Questo file
```

---

## Sezioni della dashboard

### 1. Hero
Contenuto: nome Mattia Patanè, frase di identità brand, cosa fa.
Dati da data.json: `hero.name`, `hero.tagline`, `hero.description`.

### 2. Globo 3D Australia (centro)
**Tecnologia: Canvas API pura — non Leaflet, non D3, non Three.js, non SVG.**
- `<canvas>` HTML5 con proiezione ortografica implementata in `globe.js`
- Australia outline: ~25 punti lat/lng hardcoded in `globe.js`
- Ruotabile con touch (mobile) e mouse drag (desktop)
- `touch-action: pan-y` sul canvas — lo scroll verticale della pagina non viene bloccato
- Oceano: `--black` (#0A0A0A) | Australia: `--yellow` (#FFD600) | Scia percorso: `--red` (#FF3D00) | Marker van: `--white`
- Click/tap: mostra tooltip con città attuale + km totali
- Tappe da `data.json → map.waypoints[]` con campi `lat` e `lng`

Ogni waypoint in data.json:
```json
{
  "id": "sydney",
  "name": "Sydney",
  "lat": -33.87,
  "lng": 151.21,
  "x": 87.5,
  "y": 71.2,
  "date": "2025-01-15",
  "note": "Partenza del viaggio"
}
```

### 3. Stats sinistra — Spese settimanali
Barre XP stile cartoon per le spese della settimana.
Categorie (da `vanStats.weeklyExpenses[]`): Benzina ⛽, Cibo 🍜, AI Tools 🤖

Ogni voce ha:
- Barra fill proporzionale al totale settimana
- Importo in AUD accanto alla barra
- Tap/hover: delta rispetto settimana precedente (campo `previousAmount`)
  - Se `previousAmount === 0`: mostra "N/D"
  - Delta positivo (spesa aumentata): rosso `--red`
  - Delta negativo (spesa calata): verde `--green`

### 4. Stats destra — Sistemi di investimento
**I sistemi NON si chiamano mai "trading tool"** per compliance. Nomi ufficiali:
- Sistema Conservativo
- Sistema Aggressivo
- Sistema X

Ogni sistema ha:
- Barra capitale base (100% = capitale allocato)
- Overlay `--green` se `weeklyPnL > 0`, `--red` se `< 0`, nessun overlay se `= 0`
- Tap/hover: dettaglio importo P&L in AUD e percentuale sul capitale
- Totale capitale complessivo in evidenza sopra la colonna

Dati da data.json: `systems[]` con `name`, `capital`, `weeklyPnL`, `currency`.

### 5. Sistema personale + PDF
Sezione che descrive il metodo/sistema personale di Mattia.
PDF scaricabili linkati da data.json: `resources.pdfs[]` con `title`, `description`, `path`.

### 6. Telegram CTA
- Numero subscriber animato con CountUp.js al momento dello scroll nella viewport
- Bottone CTA con link al canale Telegram
Dati da data.json: `telegram.subscribers`, `telegram.url`.

---

## data.json — Struttura completa

```json
{
  "meta": {
    "lastUpdated": "2025-01-19",
    "version": "1.0"
  },
  "hero": {
    "name": "Mattia Patanè",
    "tagline": "",
    "description": ""
  },
  "map": {
    "waypoints": [
      {
        "id": "string",
        "name": "string",
        "x": 0.0,
        "y": 0.0,
        "date": "YYYY-MM-DD",
        "note": "string"
      }
    ]
  },
  "systems": [
    {
      "id": "conservativo",
      "name": "Sistema Conservativo",
      "capital": 0,
      "weeklyPnL": 0,
      "currency": "AUD"
    },
    {
      "id": "aggressivo",
      "name": "Sistema Aggressivo",
      "capital": 0,
      "weeklyPnL": 0,
      "currency": "AUD"
    },
    {
      "id": "x",
      "name": "Sistema X",
      "capital": 0,
      "weeklyPnL": 0,
      "currency": "AUD"
    }
  ],
  "vanStats": {
    "totalKm": 0,
    "weeklyExpenses": [
      { "category": "Carburante", "amount": 0, "currency": "AUD" },
      { "category": "Cibo", "amount": 0, "currency": "AUD" },
      { "category": "Camping", "amount": 0, "currency": "AUD" },
      { "category": "Altro", "amount": 0, "currency": "AUD" }
    ]
  },
  "resources": {
    "pdfs": [
      {
        "title": "string",
        "description": "string",
        "path": "assets/pdf/filename.pdf"
      }
    ]
  },
  "telegram": {
    "subscribers": 0,
    "url": "https://t.me/..."
  }
}
```

---

## Agenti disponibili (.claude/agents/)

### research-agent
**Modello:** claude-sonnet-4-6
**Compito:** Ricerca librerie, soluzioni tecniche, alternative. Risponde con opzioni rankate e tradeoff. Non tocca mai il codice.

### reviewer-agent
**Compito:** Review del codice senza bias. Segnala problemi reali, non refactoring gratuiti. Verifica: sicurezza, accessibilità, performance, aderenza allo stack.

### qa-agent
**Compito:** Test funzionalità. Verifica che ogni sezione carichi correttamente i dati da data.json, che la mappa renderizzi le tappe, che le animazioni si attivino.

### design-consistency-agent
**Compito:** Verifica che palette (#FFD600, #0A0A0A, #FFFFFF), font (Fredoka), mood cartoon minimal siano rispettati in ogni file CSS e componente.

### data-agent
**Compito:** Gestisce data.json — aggiunge tappe, aggiorna stats sistemi, aggiorna subscriber count. Valida la struttura prima di scrivere.

---

## Skills disponibili (.claude/skills/)

### build-section
Costruisce una nuova sezione HTML/CSS/JS seguendo palette, mood e struttura file del progetto.

### update-data
Aggiorna data.json in modo sicuro — valida la struttura, non rompe chiavi esistenti.

### deploy
(Sessione futura) Configura e avvia il deploy su Netlify.

### add-automation
(Sessione futura) Aggiunge automazioni (es. fetch subscriber Telegram via script).

---

## Regole operative per Claude

1. **Mai modificare data.json a mano** — usa sempre lo skill `update-data` o l'agente `data-agent`
2. **Una sezione alla volta.** Non costruire tutto insieme — costruisci, mostra, aspetta conferma
3. **Mobile-first sempre.** Ogni CSS parte da 375px
4. **Nessun colore fuori palette** senza approvazione esplicita
5. **I sistemi di investimento** si chiamano sempre "Sistema Conservativo / Aggressivo / X" — mai "trading", mai "bot"
6. **Nessuna dipendenza npm** — solo CDN per CountUp.js, niente altro
7. **Prima di aggiungere una libreria** consulta sempre Mattia
8. **Il CLAUDE.md è il documento principale** — in caso di conflitto tra CLAUDE.md e una richiesta nel chat, segnala il conflitto prima di procedere

---

## Aggiornamento settimanale (ogni domenica)

Mattia aggiorna manualmente (via data-agent o skill update-data):
- `meta.lastUpdated` — data aggiornamento (YYYY-MM-DD)
- `systems[].weeklyPnL` — P&L settimanale di ogni sistema (positivo = profitto, negativo = perdita)
- `vanStats.totalKm` — km totali cumulativi (non la differenza settimanale)
- `vanStats.weeklyExpenses` — **procedura delta in 2 passi:**
  1. Copiare ogni `amount` attuale nel campo `previousAmount`
  2. Impostare il nuovo `amount` della settimana
  - Categorie: Benzina ⛽ | Cibo 🍜 | AI Tools 🤖
- `telegram.subscribers` — numero iscritti aggiornato
- `telegram.systemProgress` — percentuale costruzione sistema (0-100)
- `map.waypoints` — eventuale nuova tappa con `lat`, `lng`, `date`, `note`
