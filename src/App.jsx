import { useState } from "react";
import { searchGames, recommendGames, getGameDetail } from "./rawg";
import { useLibrary } from "./useLibrary";
import GameCard from "./components/GameCard";
import GameDetail from "./components/GameDetail";

const TABS = ["all", "backlog", "playing", "completed"];
const pad = (n, len) => String(n).padStart(len, "0");

function Decor() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 hidden xl:block" aria-hidden="true">
      <svg className="bob absolute left-10 top-40 w-12" viewBox="0 0 24 24">
        <path d="M2.5 12.5 a9.5 8.5 0 0 1 19 0 z" fill="#e60012" stroke="#7a0a10" strokeWidth="1.4" />
        <circle cx="8" cy="8.5" r="2" fill="#fff" />
        <circle cx="16" cy="9.2" r="1.6" fill="#fff" />
        <rect x="7" y="12.2" width="10" height="9.3" rx="2.4" fill="#ffe3c2" stroke="#7a0a10" strokeWidth="1.4" />
      </svg>
      <svg className="spin absolute right-14 top-32 w-11" viewBox="0 0 24 24">
        <polygon points="12,1.5 15,9 23,9 16.5,13.8 19,21.5 12,16.8 5,21.5 7.5,13.8 1,9 9,9" fill="#ffd23f" stroke="#b8860b" strokeWidth="1.4" />
      </svg>
      <svg className="bob absolute bottom-44 right-16 w-8" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="8" fill="#f5b800" stroke="#8a5e00" strokeWidth="2" />
        <ellipse cx="10" cy="10" rx="3.2" ry="5" fill="none" stroke="#c98700" strokeWidth="1.6" />
      </svg>
      <svg className="absolute bottom-0 right-10 w-20" viewBox="0 0 40 48">
        <rect x="2" y="2" width="36" height="12" rx="2" fill="#2faf3a" stroke="#15601c" strokeWidth="2" />
        <rect x="7" y="14" width="26" height="34" fill="#2faf3a" stroke="#15601c" strokeWidth="2" />
      </svg>
      <div className="pixel absolute left-12 bottom-40 flex flex-col gap-3 text-2xl">
        <span className="text-emerald-400">△</span>
        <span className="text-rose-400">○</span>
        <span className="text-sky-400">✕</span>
        <span className="text-fuchsia-400">□</span>
      </div>
    </div>
  );
}

export default function App() {
  const { library, add, setStatus, remove } = useLibrary();
  const [view, setView] = useState("library"); // "library" | "search"

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [tab, setTab] = useState("all");
  const [recs, setRecs] = useState([]);
  const [recLoading, setRecLoading] = useState(false);
  const [recError, setRecError] = useState("");

  const [detail, setDetail] = useState(null); // full/basic game object being viewed
  const [detailLoading, setDetailLoading] = useState(false);

  const onSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    try {
      setResults(await searchGames(query.trim()));
    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const collectGenres = (games) => {
    const freq = {};
    games.forEach((g) => (g.genreSlugs || []).forEach((s) => (freq[s] = (freq[s] || 0) + 1)));
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .map(([s]) => s);
  };

  const onRecommend = async () => {
    const completed = library.filter((g) => g.status === "completed");
    const base = completed.length ? completed : library;
    const genres = collectGenres(base);
    if (!genres.length) {
      setRecError("ADD A FEW GAMES FIRST SO I KNOW YOUR TASTE");
      setRecs([]);
      return;
    }
    setRecLoading(true);
    setRecError("");
    try {
      setRecs(await recommendGames(genres, library.map((g) => g.id)));
    } catch (err) {
      setRecError(err.message);
      setRecs([]);
    } finally {
      setRecLoading(false);
    }
  };

  const openDetail = async (game) => {
    setDetail(game); // show the basics (cover/name) instantly
    setDetailLoading(true);
    try {
      setDetail(await getGameDetail(game.id));
    } catch {
      /* keep the basic info we already have */
    } finally {
      setDetailLoading(false);
    }
  };
  const closeDetail = () => {
    setDetail(null);
    setDetailLoading(false);
  };

  // Pick a random game you haven't finished (else anything) and open it.
  const onSurprise = () => {
    const pool = library.filter((g) => g.status !== "completed");
    const src = pool.length ? pool : library;
    if (!src.length) return;
    openDetail(src[Math.floor(Math.random() * src.length)]);
  };

  const libIds = new Set(library.map((g) => g.id));
  const shown = tab === "all" ? library : library.filter((g) => g.status === tab);
  const count = (s) => library.filter((g) => g.status === s).length;
  const hours = library.reduce((sum, g) => sum + (g.playtime || 0), 0);
  const detailInLib = detail ? library.find((g) => g.id === detail.id) : null;

  const cardProps = { onAdd: add, onSetStatus: setStatus, onRemove: remove, onOpen: openDetail };

  return (
    <div className="relative min-h-screen">
      <Decor />
      <div className="vig" />
      <div className="crt" />

      {/* HUD */}
      <div className="pixel relative z-10 mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 pt-5 text-[9px] text-[var(--muted)]">
        <span>1UP&nbsp;&nbsp;<b className="text-white">{pad(library.length, 6)}</b></span>
        <span>HI-SCORE&nbsp;&nbsp;<b className="text-white">{pad(hours, 6)}</b></span>
        <span className="inline-flex items-center gap-2 text-[var(--yellow)]">
          <i className="bob inline-block h-3 w-3 rounded-full border-2 border-[#8a5e00] bg-[radial-gradient(circle_at_35%_30%,#ffe98a,#f5b800_60%,#c98700)]" />
          × {pad(count("completed"), 2)}
        </span>
      </div>

      {/* Header */}
      <header className="relative z-10 mx-auto max-w-6xl px-6 pb-6 pt-12 text-center">
        <div className="pixel mb-6 text-[10px] tracking-widest text-[var(--cyan)]">
          YOUR GAMES — SELECT A STAGE
        </div>
        <h1
          className="pixel text-4xl leading-tight sm:text-5xl"
          style={{ textShadow: "3px 3px 0 var(--red), 6px 6px 0 rgba(30,155,255,0.75)" }}
        >
          PLAYLOG
        </h1>
      </header>

      {/* View toggle — your library is always one click away */}
      <div className="relative z-10 mx-auto mb-8 flex max-w-6xl justify-center gap-3 px-6">
        <button
          onClick={() => setView("library")}
          className={`pixel border-2 px-5 py-3 text-[10px] transition ${
            view === "library"
              ? "border-[var(--red)] bg-[var(--red)] text-white"
              : "border-white/15 text-[var(--muted)] hover:border-white/40"
          }`}
        >
          ▸ MY GAMES {library.length > 0 ? library.length : ""}
        </button>
        <button
          onClick={() => setView("search")}
          className={`pixel border-2 px-5 py-3 text-[10px] transition ${
            view === "search"
              ? "border-[var(--blue)] bg-[var(--blue)] text-white"
              : "border-white/15 text-[var(--muted)] hover:border-white/40"
          }`}
        >
          + FIND GAMES
        </button>
      </div>

      <main className="relative z-10 mx-auto max-w-6xl space-y-8 px-6 pb-16">
        {view === "search" ? (
          <>
            <form onSubmit={onSearch} className="mx-auto flex max-w-3xl gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search a game — Zelda, God of War, Mario…"
                className="flex-1 border-[3px] border-white/15 bg-[var(--panel)] px-4 py-3 text-sm outline-none placeholder:text-zinc-600 focus:border-[var(--cyan)]"
                autoFocus
              />
              <button className="pixel bg-[var(--red)] px-5 text-[10px] text-white transition hover:brightness-125">
                GO
              </button>
            </form>

            {error && <p className="pixel text-center text-[9px] leading-relaxed text-rose-400">{error}</p>}

            {loading ? (
              <p className="pixel text-center text-[9px] text-[var(--muted)]">SEARCHING…</p>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((g) => (
                  <GameCard key={g.id} game={g} inLibrary={libIds.has(g.id)} status={library.find((x) => x.id === g.id)?.status} {...cardProps} />
                ))}
              </div>
            ) : (
              <p className="pixel text-center text-[9px] leading-relaxed text-[var(--muted)]">
                SEARCH FOR A GAME TO ADD IT
              </p>
            )}
          </>
        ) : (
          <>
            {/* Recommend + Surprise */}
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={onRecommend}
                className="pixel bg-[var(--yellow)] px-5 py-3 text-[10px] text-black transition hover:brightness-110"
              >
                ★ RECOMMEND WHAT TO PLAY
              </button>
              <button
                onClick={onSurprise}
                className="pixel border-2 border-[var(--cyan)] px-5 py-3 text-[10px] text-[var(--cyan)] transition hover:bg-[var(--cyan)] hover:text-black"
              >
                🎲 SURPRISE ME
              </button>
            </div>

            {(recLoading || recError || recs.length > 0) && (
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="pixel text-[9px] tracking-widest text-[var(--yellow)]">★ PLAYER'S PICKS</h2>
                  {!recLoading && recs.length > 0 && (
                    <button onClick={onRecommend} className="pixel text-[8px] text-[var(--cyan)] transition hover:underline">
                      ↻ REROLL
                    </button>
                  )}
                </div>
                {recLoading ? (
                  <p className="pixel text-[9px] text-[var(--muted)]">THINKING…</p>
                ) : recError ? (
                  <p className="pixel text-[9px] leading-relaxed text-rose-400">{recError}</p>
                ) : (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {recs.map((g) => (
                      <GameCard key={g.id} game={g} inLibrary={false} {...cardProps} />
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Library */}
            <section className="space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                {TABS.map((t) => {
                  const n = t === "all" ? library.length : count(t);
                  return (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className={`pixel border-2 px-3 py-2 text-[8px] uppercase transition ${
                        tab === t
                          ? "border-[var(--red)] bg-[var(--red)] text-white"
                          : "border-white/15 text-[var(--muted)] hover:border-white/40"
                      }`}
                    >
                      {t}
                      {n > 0 ? ` ${n}` : ""}
                    </button>
                  );
                })}
              </div>

              {shown.length === 0 ? (
                <div className="flex flex-col items-center gap-5 py-14 text-center">
                  <div className="pixel flex gap-3 text-2xl">
                    <span className="text-emerald-400">△</span>
                    <span className="text-rose-400">○</span>
                    <span className="text-sky-400">✕</span>
                    <span className="text-fuchsia-400">□</span>
                  </div>
                  <p className="pixel text-[9px] leading-relaxed text-[var(--muted)]">
                    NO GAMES YET — HIT “FIND GAMES” TO ADD SOME
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {shown.map((g) => (
                    <GameCard key={g.id} game={g} inLibrary status={g.status} {...cardProps} />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 border-t-[3px] border-white/15 px-6 py-8 text-[13px] text-[var(--muted)]">
        <span className="blink pixel text-[9px] text-[var(--yellow)]">INSERT COIN</span>
        <span>PlayLog — your PlayStation &amp; Nintendo backlog</span>
      </footer>

      {/* Detail modal */}
      {detail && (
        <GameDetail
          game={detail}
          loading={detailLoading}
          inLibrary={!!detailInLib}
          status={detailInLib?.status}
          onAdd={(g) => add(g)}
          onSetStatus={setStatus}
          onRemove={(id) => {
            remove(id);
            closeDetail();
          }}
          onClose={closeDetail}
        />
      )}
    </div>
  );
}
