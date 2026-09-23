# Fable & Fur

A full-stack pet adoption app inspired by swipe-based matchmaking platforms, powered by React on the frontend and SQL-backed data on the backend.

## Stack
- React + Vite frontend
- Express API backend
- SQLite database with schema and seed data
- Responsive UI with swipe-style adoption flow

## Run locally

```bash
cd /workspaces/Fable-Fur
npm install
npm run dev
```

Then open:

- Frontend: http://localhost:3000
- API: http://localhost:4000/api/pets

## SQL data

The SQLite structure and seed dataset live in:

- `database/schema.sql`

The backend initializes the database automatically when the server starts.
