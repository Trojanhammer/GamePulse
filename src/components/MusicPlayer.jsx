import { useRef, useState } from "react";

export default function MusicPlayer() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
    setPlaying(!playing);
  };

  return (
    <div className="fixed bottom-4 right-4 z-[70]">
      <audio ref={audioRef} src="/music/wiiu-shop.mp3" loop />
      <button
        onClick={toggle}
        className={`pixel border-2 px-3 py-2 text-[9px] transition ${
          playing
            ? "border-[var(--cyan)] bg-[var(--cyan)] text-black"
            : "border-white/15 bg-[var(--panel)] text-[var(--muted)] hover:border-white/40"
        }`}
        title="Wii U eShop theme"
      >
        {playing ? "♪ PLAYING" : "♪ SHOP MUSIC"}
      </button>
    </div>
  );
}
