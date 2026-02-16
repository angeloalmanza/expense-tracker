# Spendify

Una web app fullstack per gestire entrate e uscite con dashboard interattiva, analisi avanzate e una UI moderna. Autenticazione con email/password e Google OAuth, reset password via email, dati persistenti su database e deploy su cloud.

## Demo

Live: [spendify-app.netlify.app](https://spendify-app.netlify.app/)

### Login

![Login](./docs/login.png)
Autenticazione con email e password o tramite Google OAuth. Sessione persistente tramite token.

### Dashboard — Analisi e trend

![Charts](./docs/charts.png)
Trend mensili di entrate, uscite e saldo netto con grafici interattivi.

### Dashboard — Confronto mensile

![Monthly comparison](./docs/budget.png)
Confronto con il mese precedente e analisi per categoria.

### Dashboard — Transazioni

![Transactions](./docs/transactions.png)
Ricerca, filtri avanzati, ordinamento colonne e CRUD completo delle transazioni.

## Funzionalità principali

- Autenticazione con email + password e **Google OAuth**
- **Reset password** via email (Resend)
- Dashboard completa con KPI, trend mensili e breakdown per categoria
- Grafici interattivi (andamento entrate/uscite, torta per categoria)
- **Categorie personalizzate** con colore a scelta e modifica inline (nome + colore)
- **Budget per categoria** con avvisi toast e banner dismissibile quando il budget viene superato
- **Transazioni ricorrenti** (settimanali/mensili) con generazione automatica e catch-up
- Ricerca e filtri combinabili per tipo, data e testo
- Ordinamento per qualsiasi colonna
- Aggiunta, modifica ed eliminazione transazioni
- Export CSV e JSON di tutte le transazioni
- Profilo utente con selezione avatar
- Dark / Light mode con preferenza salvata
- Dati persistenti su database PostgreSQL

## Tech Stack

### Frontend
- React 19 + Vite
- Tailwind CSS v4
- Recharts
- Lucide Icons
- Axios
- React Router

### Backend
- Laravel 11
- Laravel Sanctum (autenticazione token)
- Laravel Socialite (Google OAuth)
- Resend (email transazionali)
- PostgreSQL

### Infrastructure
- Docker + Docker Compose (sviluppo locale)
- Netlify (frontend)
- Render (backend)
- Neon (database PostgreSQL)
- cron-job.org (scheduler ricorrenze)

## Avvio locale con Docker

```bash
docker compose up --build
```

App disponibile su [http://localhost:5173](http://localhost:5173)

## Struttura del progetto

```
spendify/
├── docker-compose.yml
├── frontend/               # React + Vite
│   ├── src/
│   │   ├── api/            # Axios client
│   │   ├── context/        # AuthContext
│   │   ├── hook/           # useAuth, useTransactions, useCategories, useRecurringTransactions
│   │   ├── pages/          # LoginPage, RegisterPage, ProfilePage, ...
│   │   └── components/     # UI components
│   └── ...
└── backend/                # Laravel 11
    ├── app/
    │   ├── Console/Commands/ # recurring:process
    │   ├── Http/Controllers/
    │   └── Models/
    ├── database/migrations/
    └── routes/api.php
```
