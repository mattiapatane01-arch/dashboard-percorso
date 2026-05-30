---
name: update-data
description: Aggiorna data.json in modo sicuro, validando la struttura e mostrando le modifiche prima di scrivere.
---

# Skill: update-data

## Quando usarla
Ogni volta che devi modificare data.json — aggiornamento settimanale, nuova tappa, nuovo PDF, modifica subscriber count.

## Procedura obbligatoria

### Step 1 — Leggi e valida
```
Leggi data.json
Verifica che sia JSON valido
Verifica che tutte le chiavi di primo livello esistano:
meta, hero, map, systems, vanStats, resources, telegram
```

### Step 2 — Mostra le modifiche prima di applicarle
Prima di toccare il file, mostra sempre:
```
Sto per aggiornare data.json:
• meta.lastUpdated: "2026-05-01" → "2026-05-26"
• systems[0].weeklyPnL: 0 → 42.50
• vanStats.totalKm: 1200 → 1247
```

### Step 3 — Applica con Edit (mai riscrivere tutto il file)
Usa il tool Edit per modifiche puntuali. Riscrivi il file intero solo se la struttura è rotta.

### Step 4 — Conferma
Dopo la modifica: "data.json aggiornato. Ultima modifica: [data]."

## Regole per tipo di aggiornamento

### Aggiornamento settimanale domenicale
Campi da toccare:
- `meta.lastUpdated` → data odierna YYYY-MM-DD
- `systems[].weeklyPnL` → numero (positivo = profitto, negativo = perdita)
- `vanStats.totalKm` → totale cumulativo (non la differenza)
- `vanStats.weeklyExpenses[].amount` → importi settimana appena conclusa
- `telegram.subscribers` → numero aggiornato

### Nuova tappa mappa
- `id`: slug minuscolo senza spazi (es. "alice-springs")
- `x`, `y`: coordinate 0-100 nel viewBox SVG Australia
- `date`: YYYY-MM-DD
- Sempre in APPEND — non riordinare le tappe esistenti

### Nuovo PDF
- Verifica che il file PDF esista in assets/pdf/ prima di aggiungere
- `path`: formato `assets/pdf/nomefile.pdf`

## Vincoli assoluti
- Non rimuovere chiavi senza conferma esplicita
- Non modificare `systems[].id` — rompe il JS
- Non modificare `systems[].name` — è il nome pubblico
- weeklyPnL è sempre nel currency del sistema (AUD di default)
