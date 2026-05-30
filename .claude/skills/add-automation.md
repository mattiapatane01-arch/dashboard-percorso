---
name: add-automation
description: (Sessione futura) Aggiunge automazioni alla dashboard, come il fetch automatico dei subscriber Telegram o aggiornamento dati via script.
---

# Skill: add-automation

> **Questa skill è pianificata per sessioni future dedicate.**
> Non usarla ancora — ogni automazione va discussa e approvata prima dell'implementazione.

## Automazioni pianificate

### 1. Subscriber Telegram (priorità alta)
**Problema:** il numero di subscriber è aggiornato manualmente ogni domenica in data.json.
**Soluzione:** script che chiama l'API pubblica di Telegram e aggiorna data.json automaticamente.

Approcci possibili (da valutare nella sessione):
- **Netlify Function** (serverless) — chiamata all'API Telegram Bot, aggiorna data.json e fa redeploy. Richiede Telegram Bot Token.
- **GitHub Action** — cron job settimanale che fa fetch e apre PR con data.json aggiornato.
- **Script locale** — script Node.js da eseguire manualmente prima del deploy domenicale. Zero infrastruttura.

### 2. Aggiornamento dati sistemi
**Problema:** P&L settimanale aggiornato manualmente.
**Possibile soluzione futura:** se i sistemi espongono un'API o un export CSV, script di parsing automatico.
> Valutare caso per caso — dipende da cosa espone ogni sistema.

### 3. Riepilogo domenicale
**Idea:** script CLI interattivo che guida Mattia nell'aggiornamento domenicale di data.json con prompt e validazione, invece di modificare il JSON a mano.

## Come procedere
Quando vuoi implementare un'automazione:
1. Descrivi qual è l'automazione che vuoi
2. Questa skill valuterà l'approccio meno invasivo compatibile con lo stack
3. Propone implementazione minimale
4. Non aggiunge dipendenze npm al progetto principale
