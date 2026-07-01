import { useEffect, useState } from "react";

const STATUS = { backlog: "BACKLOG", playing: "PLAYING", completed: "CLEARED" };

// Full-screen detail overlay for one game.
export default function GameDetail({ game, loading, inLibrary, status, onAdd, onSetStatus, onRemove, onClose }) {
  const [bigShot, setBigShot] = useState(null); // enlarged screenshot

  // Close on Esc (enlarged screenshot first, else the modal).
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (bigShot) setBigShot(null);
      else onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, bigShot]);

  if (!game) return null;
  const isPs = (game.platforms || []).some((p) => /playstation/i.test(p));

  return (
    <div
      className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-black/85 p-4 sm:p-10"
      onClick={onClose}
    >
      {bigShot && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/95 p-6"
          onClick={(e) => {
            e.stopPropagation();
            setBigShot(null);
          }}
        >
          <img src={bigShot} alt="" className="max-h-full max-w-full border-2 border-white/20" />
          <span className="pixel absolute right-4 top-4 text-[10px] text-white">✕ CLOSE</span>
        </div>
      )}
      <div
        className="cart w-full max-w-3xl"
        style={{ "--accent": isPs ? "var(--blue)" : "var(--red)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cover */}
        <div className="screen">
          {game.image && <img src={game.image} alt={game.name} />}
          <div className="scan" />
          <button
            onClick={onClose}
            className="pixel absolute right-2 top-2 z-10 bg-black/70 px-2 py-1 text-[10px] text-white hover:text-rose-400"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 p-5">
          <h2 className="pixel text-[13px] leading-relaxed">{game.name}</h2>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-[var(--muted)]">
            {game.rating > 0 && <span className="text-yellow-300">★ {game.rating.toFixed(1)}</span>}
            {game.metacritic && <span className="text-green-400">MC {game.metacritic}</span>}
            {game.released && <span>{game.released}</span>}
            {game.playtime > 0 && <span>~{game.playtime}h to beat</span>}
            <span className={isPs ? "text-[var(--blue)]" : "text-[var(--red)]"}>
              {(game.platforms || []).join(" · ")}
            </span>
          </div>

          {game.genres?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {game.genres.map((g) => (
                <span key={g} className="pixel border border-white/15 px-2 py-1 text-[8px] text-[var(--cyan)]">
                  {g}
                </span>
              ))}
            </div>
          )}

          {loading ? (
            <p className="pixel text-[9px] text-[var(--muted)]">LOADING DETAILS…</p>
          ) : (
            game.description && (
              <p className="max-h-44 overflow-y-auto text-sm leading-relaxed text-zinc-300">
                {game.description}
              </p>
            )
          )}

          {game.screenshots?.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {game.screenshots.map((s) => (
                <img
                  key={s}
                  src={s}
                  alt=""
                  onClick={() => setBigShot(s)}
                  className="h-20 w-32 flex-none cursor-pointer border border-white/10 object-cover transition hover:border-[var(--cyan)]"
                />
              ))}
            </div>
          )}

          {/* Controls */}
          <div className="border-t-2 border-white/10 pt-4">
            {!inLibrary ? (
              <button
                onClick={() => onAdd(game)}
                className="pixel w-full bg-[var(--red)] py-3 text-[10px] text-white hover:brightness-125"
              >
                + INSERT INTO LIBRARY
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <select
                  value={status}
                  onChange={(e) => onSetStatus(game.id, e.target.value)}
                  className="pixel flex-1 border-2 border-white/15 bg-black px-2 py-2.5 text-[9px] text-white outline-none"
                >
                  {Object.entries(STATUS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => onRemove(game.id)}
                  className="pixel border-2 border-white/15 px-3 py-2 text-[9px] text-zinc-400 hover:border-red-500 hover:text-red-400"
                >
                  REMOVE
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
