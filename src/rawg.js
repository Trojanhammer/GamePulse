// RAWG API client — free game database (https://rawg.io/apidocs)
// Put your key in a .env file:  VITE_RAWG_KEY=xxxxx

const KEY = import.meta.env.VITE_RAWG_KEY;
const BASE = "https://api.rawg.io/api";

// RAWG "parent platform" ids:  2 = PlayStation, 7 = Nintendo.
const PLATFORMS = "2,7";

export async function searchGames(query) {
  if (!KEY) {
    throw new Error("Missing VITE_RAWG_KEY — create a .env file with your RAWG key.");
  }
  const url =
    `${BASE}/games?key=${KEY}` +
    `&search=${encodeURIComponent(query)}` +
    `&parent_platforms=${PLATFORMS}` +
    `&page_size=18`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`RAWG request failed (${res.status})`);
  const data = await res.json();
  return (data.results || []).map(normalize);
}

// Recommend games in the given genres (by slug), on PS/Nintendo, most-popular first,
// excluding anything already in the library. This is content-based filtering — the
// "similar games" endpoint is paid-only, so we match on the genres you actually play.
export async function recommendGames(genreSlugs, excludeIds = []) {
  if (!KEY) {
    throw new Error("Missing VITE_RAWG_KEY — create a .env file with your RAWG key.");
  }
  const genres = genreSlugs.slice(0, 4).join(",");
  const url =
    `${BASE}/games?key=${KEY}` +
    `&genres=${genres}` +
    `&parent_platforms=${PLATFORMS}` +
    `&ordering=-added` + // by popularity → recognisable picks
    `&page_size=40`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`RAWG request failed (${res.status})`);
  const data = await res.json();
  const exclude = new Set(excludeIds);
  return (data.results || [])
    .map(normalize)
    .filter((g) => !exclude.has(g.id))
    .slice(0, 6);
}

// Full detail for one game: description + screenshots (for the detail view).
export async function getGameDetail(id) {
  if (!KEY) throw new Error("Missing VITE_RAWG_KEY.");
  const d = await fetch(`${BASE}/games/${id}?key=${KEY}`).then((r) => r.json());
  const shots = await fetch(`${BASE}/games/${id}/screenshots?key=${KEY}`)
    .then((r) => r.json())
    .catch(() => ({ results: [] }));
  return {
    ...normalize(d),
    description: d.description_raw || "",
    website: d.website || "",
    metacritic: d.metacritic,
    developers: (d.developers || []).map((x) => x.name),
    screenshots: (shots.results || []).map((s) => s.image).slice(0, 6),
  };
}

// Shrink RAWG's huge response down to just what we use.
function normalize(g) {
  return {
    id: g.id,
    name: g.name,
    image: g.background_image,
    rating: g.rating, // 0–5
    released: g.released,
    playtime: g.playtime, // average hours to beat
    genres: (g.genres || []).map((x) => x.name), // display
    genreSlugs: (g.genres || []).map((x) => x.slug), // for recommendations
    platforms: (g.parent_platforms || []).map((p) => p.platform.name),
  };
}
