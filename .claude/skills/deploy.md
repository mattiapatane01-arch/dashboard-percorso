---
name: deploy
description: (Sessione futura) Configura e avvia il deploy della dashboard su Netlify.
---

# Skill: deploy

> **Questa skill è pianificata per una sessione futura dedicata.**
> Non usarla ancora — non è configurata.

## Cosa farà quando implementata

### Target
Deploy statico su **Netlify** — nessun build step, deploy diretto della cartella root.

### Checklist pre-deploy (da completare durante la sessione)
- [ ] Creare account Netlify (se non esiste)
- [ ] Installare Netlify CLI: `npm install -g netlify-cli` (unica eccezione npm consentita — tool locale, non dipendenza del progetto)
- [ ] Login: `netlify login`
- [ ] Configurare `netlify.toml` nella root del progetto
- [ ] Deploy: `netlify deploy --dir=. --prod`

### netlify.toml previsto
```toml
[build]
  publish = "."

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Note
- data.json è servito come file statico — nessuna API necessaria
- Il dominio custom (se presente) va configurato nel dashboard Netlify
- Ogni domenica dopo l'aggiornamento di data.json: re-deploy con `netlify deploy --prod`
