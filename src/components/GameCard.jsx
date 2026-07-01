// Arcade "cartridge" tile. Border colour = console (red Nintendo / blue Sony).
// Statuses use arcade language: BACKLOG / PLAYING / CLEARED.
const STATUS = {
  backlog: { label: "BACKLOG", cls: "bg-slate-300 text-slate-900" },
  playing: { label: "PLAYING", cls: "bg-cyan-300 text-cyan-950" },
  completed: { label: "CLEARED", cls: "bg-yellow-300 text-yellow-950" },
};

export default function GameCard({ game, inLibrary, status, onAdd, onSetStatus, onRemove, onOpen }) {
  const isPs = (game.platforms || []).some((p) => /playstation/i.test(p));
  const accent = isPs ? "var(--blue)" : "var(--red)";

  return (
    <div className="cart flex flex-col" style={{ "--accent": accent }}>
      {/* Screen (click for details) */}
      <div
        className="screen group/screen cursor-pointer"
        onClick={() => onOpen && onOpen(game)}
        title="View details"
      >
        {game.image ? (
          <img src={game.image} alt={game.name} loading="lazy" />
        ) : (
          <div className="pixel grid h-full w-full place-items-center text-[8px] text-zinc-600">
            NO IMAGE
          </div>
        )}
        <div className="scan" />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover/screen:opacity-100">
          <span className="pixel text-[9px] text-[var(--cyan)]">▶ DETAILS</span>
        </div>

        {inLibrary && status && (
          <span className={`pixel absolute left-2 top-2 px-2 py-1 text-[8px] ${STATUS[status].cls}`}>
            {STATUS[status].label}
          </span>
        )}
        {game.rating > 0 && (
          <span className="pixel absolute right-2 top-2 bg-black/70 px-1.5 py-1 text-[8px] text-yellow-300">
            {game.rating.toFixed(1)}
          </span>
        )}
      </div>

      {/* Label */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="pixel mb-2 line-clamp-2 text-[11px] leading-relaxed">{game.name}</h3>
        <div className="mb-3 flex flex-wrap gap-x-3 gap-y-0.5 text-[12px] text-[var(--muted)]">
          {game.playtime > 0 && <span>~{game.playtime}h</span>}
          {game.released && <span>{game.released.slice(0, 4)}</span>}
          <span className={isPs ? "text-[var(--blue)]" : "text-[var(--red)]"}>
            {isPs ? "PlayStation" : "Nintendo"}
          </span>
        </div>

        <div className="mt-auto">
          {!inLibrary ? (
            <button
              onClick={() => onAdd(game)}
              className="pixel w-full bg-[var(--red)] py-2.5 text-[9px] text-white transition hover:brightness-125"
            >
              + INSERT
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <select
                value={status}
                onChange={(e) => onSetStatus(game.id, e.target.value)}
                className="pixel flex-1 border-2 border-white/15 bg-black px-2 py-2 text-[8px] text-white outline-none"
              >
                {Object.entries(STATUS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => onRemove(game.id)}
                title="Remove"
                className="border-2 border-white/15 px-2.5 py-1.5 text-zinc-400 transition hover:border-red-500 hover:text-red-400"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
