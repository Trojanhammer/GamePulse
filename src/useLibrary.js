import { useState, useEffect } from "react";

// Your game library lives in the browser's localStorage — no backend, no login,
// 100% private and free. (Swap this for a real DB later if you ever deploy.)
const STORAGE_KEY = "playlog.library";

export function useLibrary() {
  const [library, setLibrary] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });

  // Persist on every change.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(library));
  }, [library]);

  const add = (game, status = "backlog") =>
    setLibrary((lib) =>
      lib.some((g) => g.id === game.id)
        ? lib
        : [...lib, { ...game, status, addedAt: Date.now() }]
    );

  const setStatus = (id, status) =>
    setLibrary((lib) => lib.map((g) => (g.id === id ? { ...g, status } : g)));

  const remove = (id) => setLibrary((lib) => lib.filter((g) => g.id !== id));

  return { library, add, setStatus, remove };
}
