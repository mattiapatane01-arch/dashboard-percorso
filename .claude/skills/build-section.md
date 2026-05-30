---
name: build-section
description: Costruisce una nuova sezione HTML/CSS/JS della dashboard seguendo palette, mood cartoon minimal e struttura file del progetto.
---

# Skill: build-section

## Quando usarla
Quando devi aggiungere o ricostruire una sezione della dashboard (hero, map, stats, resources, telegram).

## Come operare

### 1. Leggi prima di scrivere
- Leggi CLAUDE.md integralmente
- Leggi data.json per capire i dati disponibili per la sezione
- Leggi assets/css/reset.css per le variabili CSS disponibili
- Se esiste già CSS per la sezione in assets/css/sections/, leggilo

### 2. Struttura output per ogni sezione
Crea o aggiorna questi file:
- `assets/css/sections/<nome-sezione>.css` — stili della sezione
- Blocco HTML da inserire in `index.html` nella posizione corretta
- Aggiornamento di `assets/js/<modulo>.js` se la sezione ha logica dinamica

### 3. Regole design system (non derogabili)
- Palette: usa solo variabili CSS (--yellow, --black, --white, --green, --red)
- Mai --yellow su --white — solo su --black o sfondo scuro
- Font: Fredoka — non specificare mai altri font
- Ombre: `4px 4px 0 var(--black)` — solide, senza blur
- Border: `2px solid var(--black)` come standard
- Mobile-first: stili base a 375px, desktop con `@media (min-width: 768px)`
- Animazioni: solo `transform` e `opacity` — mai `width`, `height`, `top`, `left`

### 4. Dati dinamici
- Tutti i dati vengono da data.json via data.js
- Non hardcodare mai valori che stanno in data.json
- Usa `innerHTML` con cautela — i dati da data.json sono controllati da Mattia ma sanifica comunque i valori stringa

### 5. Sicurezza innerHTML
Per inserire testo da data.json nel DOM preferisci:
```js
element.textContent = data.field; // per testo puro
```
Usa `innerHTML` solo quando serve struttura HTML, e solo con valori che non contengono input utente esterno.

### 6. Dopo aver scritto
- Decommentare il `<link>` CSS corrispondente in index.html
- Decommentare la `<section>` corrispondente in index.html
- Aggiornare l'import in main.js se è stato aggiunto un nuovo modulo JS

## Output atteso
Mostra all'utente:
1. Il codice HTML della sezione
2. Il CSS creato
3. Il JS aggiunto (se presente)
4. Le modifiche a index.html e main.js
