# 🍄 WarpZone

> 🎵 **Fun fact:** the background music toggle plays the Wii Shop Channel theme. I've always been genuinely impressed by the Wii/Wii U's clean white UI and its music — this is a small tribute to that.

A retro-arcade **game backlog tracker** for PlayStation & Nintendo. Search games,
build your library, track what's *Backlog / Playing / Cleared*, get recommendations,
and browse rich detail pages — all in a pixel-art, "SELECT A STAGE" arcade UI.

**▶ Live demo:** https://game-pulse-rosy.vercel.app  <!-- update after renaming the Vercel project -->

Built with **React + Vite + Tailwind**. No backend — your library lives privately in
your browser (localStorage), so it's free forever and needs no login.

<!-- Add a screenshot or GIF here — recruiters look at this first:
![WarpZone screenshot](docs/screenshot.png)
-->

## ✨ Features
- 🔎 **Search** the RAWG game database, filtered to **PlayStation + Nintendo** only.
- 🗂️ **Library** with three statuses — Backlog / Playing / Cleared — that persists locally.
- ★ **Recommendations** — "what to play next," generated from the genres of games you've cleared (content-based filtering).
- 📄 **Detail pages** — cover art, description, Metacritic, genres, and **click-to-enlarge screenshots**.
- 🎲 **Surprise Me** — picks a random unfinished game to play.
- 🕹️ **Retro-arcade UI** — pixel font, CRT scanlines, HUD (`1UP` / `HI-SCORE` / coins), and cards colour-coded by console (🔴 Nintendo / 🔵 PlayStation).

## 🧠 How it works
- **Data:** the [RAWG API](https://rawg.io/apidocs) (free) provides all game info; `parent_platforms=2,7` restricts results to PlayStation & Nintendo.
- **Storage:** your library is saved in the browser's `localStorage` — private to each device, no accounts, no server.
- **Recommendations:** the paid "similar games" endpoint isn't available on the free tier, so WarpZone ranks your cleared games' **genres** and asks RAWG for the most popular titles in those genres — genuine content-based filtering.

## 🚀 Run it locally
```bash
git clone <your-repo-url>
cd warpzone
npm install
cp .env.example .env        # add your free RAWG key: VITE_RAWG_KEY=...
npm run dev                 # → http://localhost:5173
```
Get a free RAWG key at https://rawg.io/apidocs.

## 🗺️ Project structure
| File | Role |
|---|---|
| `src/App.jsx` | main UI — views, search, library, recommendations |
| `src/components/GameCard.jsx` | one arcade "cartridge" card |
| `src/components/GameDetail.jsx` | detail modal + screenshot lightbox |
| `src/rawg.js` | RAWG API client (search / recommend / detail) |
| `src/useLibrary.js` | localStorage-backed library state |

## 🛠️ What I learned
React (hooks, component state, a custom `useLibrary` hook), consuming a REST API,
content-based recommendations, `localStorage` persistence, responsive Tailwind design,
and shipping to production on Vercel.

## 🔭 Possible next steps
- Accounts + cloud sync (Supabase) for cross-device libraries.
- More platforms, sorting, and playtime charts.
