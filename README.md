# 🎮 PlayLog

A modern **PlayStation & Nintendo** game tracker — search games, build a library,
and track what's *Backlog / Playing / Completed*. Built with **Vite + React + Tailwind**.
Your library is stored privately in your browser (localStorage) — no backend, no login, free.

## Setup

```bash
# 1. Get a FREE RAWG API key (game data): https://rawg.io/apidocs
#    Sign up → your key is on your account page.

# 2. Add it
cp .env.example .env          # then paste your key into .env

# 3. Install + run
npm install
npm run dev                   # → http://localhost:5173
```

## What it does
- 🔎 **Search** games (filtered to PlayStation + Nintendo only — no PC/Xbox).
- ➕ **Add to library** with a status: Backlog / Playing / Completed.
- 📊 **Stats** — how many in each status.
- 🎴 **Cards** show cover art, rating, average hours to beat ("what to expect"), platforms.
- 💾 Everything persists in your browser.

## Project map
| File | Role |
|---|---|
| `src/App.jsx` | the whole UI (search, library, tabs, stats) |
| `src/components/GameCard.jsx` | one game tile |
| `src/rawg.js` | RAWG API client (platform filter lives here) |
| `src/useLibrary.js` | localStorage-backed library state |

## Next ideas
- **Recommendations**: RAWG has a free `/games/{id}/suggested` endpoint (similar games) — no AI needed.
- **AI recommendations**: later, add a "recommend from my completed list + explain why" using a free Gemini tier.
- **Deploy free**: `npm run build` → drop on Vercel/Netlify.
