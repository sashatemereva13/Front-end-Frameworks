# Movie App

Movie discovery SPA built with React, TypeScript, Vite, and the TMDB API.

## Run locally

```bash
npm install
npm run dev
```

Open the URL printed by Vite (usually http://localhost:5173). Without a TMDB key, the app uses bundled sample movies. To use live TMDB data, open **API Key** in the app and enter your TMDB API key; it is stored in this browser's local storage.

`VITE_TMDB_API_KEY` is Vite's conventional environment variable for exposing a client-side API key to app code. This version reads the key from the in-app API Key setting instead, so setting that variable alone does not configure live requests.

## Checks

```bash
npm run type-check
npm run test:run
npm run build
npm run preview
```
