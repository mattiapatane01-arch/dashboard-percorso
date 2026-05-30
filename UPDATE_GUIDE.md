# Guida Aggiornamento Domenicale

Questa guida spiega come aggiornare la dashboard ogni domenica in modo semplice, senza sapere programmare.

---

## Prima di iniziare

**Apri il file data.json** nella cartella del progetto.
È un file di testo: puoi aprirlo con qualsiasi editor (Blocco Note, TextEdit, VSCode).

---

## 1. Aggiornare i profitti e le perdite dei sistemi

Nel file `data.json`, cerca la sezione `"systems"`.
Troverai 4 sistemi. Per ognuno, modifica il campo `"weeklyPnL"`:

| ID sistema | Nome |
|---|---|
| `"conservativo"` | Sistema Conservativo |
| `"alto1"` | Strumento Alto Rischio 1 |
| `"alto2"` | Strumento Alto Rischio 2 |
| `"medio1"` | Strumento Medio Rischio 1 |

- Se il sistema ha **guadagnato** → numero positivo. Esempio: `"weeklyPnL": 120`
- Se il sistema ha **perso** → numero negativo. Esempio: `"weeklyPnL": -85`
- Se è stato **piatto** → zero. Esempio: `"weeklyPnL": 0`

**Non toccare mai** i campi `"id"`, `"name"`, `"capital"` o `"currency"`.

---

## 2. Aggiornare le spese settimanali

Cerca la sezione `"weeklyExpenses"` dentro `"vanStats"`.

**Passo 1 — Copia il valore attuale in "previousAmount":**
Prima di scrivere il nuovo importo, copia il vecchio `"amount"` nel campo `"previousAmount"`.

Esempio — prima:
```
{ "category": "Benzina", "amount": 80, "previousAmount": 65, ... }
```
Dopo la copia:
```
{ "category": "Benzina", "amount": 80, "previousAmount": 80, ... }
```

**Passo 2 — Scrivi il nuovo importo in "amount":**
```
{ "category": "Benzina", "amount": 95, "previousAmount": 80, ... }
```

Ripeti per tutte e 4 le categorie: Benzina ⛽, Cibo 🍜, AI Tools 🤖, Altro 📦.

---

## 3. Aggiungere una nuova tappa sulla mappa

Cerca la sezione `"waypoints"` dentro `"map"`.

Aggiungi un nuovo oggetto alla fine della lista (prima della `]` finale):

```json
{
  "id": "perth",
  "name": "Perth",
  "lat": -31.95,
  "lng": 115.86,
  "x": 0,
  "y": 0,
  "date": "2025-03-10",
  "note": "Città più isolata del mondo"
}
```

**Coordinate delle principali città australiane:**

| Città | lat | lng |
|---|---|---|
| Brisbane | -27.47 | 153.02 |
| Gold Coast | -28.00 | 153.43 |
| Byron Bay | -28.64 | 153.61 |
| Sydney | -33.87 | 151.21 |
| Melbourne | -37.81 | 144.96 |
| Adelaide | -34.93 | 138.60 |
| Perth | -31.95 | 115.86 |
| Darwin | -12.46 | 130.84 |
| Cairns | -16.92 | 145.77 |
| Alice Springs | -23.70 | 133.88 |
| Broome | -17.96 | 122.24 |

---

## 4. Aggiornare i km totali percorsi

Cerca `"totalKm"` dentro `"vanStats"`:

```json
"vanStats": {
  "totalKm": 3200,
  ...
}
```

Sostituisci il numero con i km cumulativi (non la differenza settimanale).

---

## 5. Aggiornare il numero di iscritti Telegram

Cerca `"subscribers"` dentro `"telegram"`:

```json
"telegram": {
  "subscribers": 795,
  ...
}
```

Sostituisci `795` con il numero attuale.

---

## 6. Aggiornare il progresso del sistema in costruzione

Cerca `"systemProgress"` dentro `"telegram"`:

```json
"systemProgress": 6
```

Scrivi la percentuale attuale (da 0 a 100).

---

## 7. Aggiornare la data dell'ultima modifica

Cerca all'inizio del file il campo `"lastUpdated"`:

```json
"meta": {
  "lastUpdated": "2026-05-30",
  ...
}
```

Metti la data di oggi nel formato `YYYY-MM-DD`.

---

## Come vedere le modifiche nel browser

1. Apri il Terminale nella cartella del progetto
2. Scrivi: `python3 -m http.server 8080` e premi Invio
3. Apri il browser e vai su: `http://localhost:8080`

**Importante:** non aprire `index.html` direttamente con doppio click — non funzionerà. Usa sempre il server locale.

---

## Regola importante

Non modificare mai i campi `"id"` dei sistemi (`"conservativo"`, `"alto1"`, `"alto2"`, `"medio1"`).
Puoi modificare tutto il resto senza problemi.
