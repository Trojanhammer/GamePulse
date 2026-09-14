import { useRef, useState } from "react";

const PLAYLIST = [
  { src: "/music/mii-maker.mp3", label: "MII MAKER" },
  { src: "/music/wiiu-shop.mp3", label: "SHOP MUSIC" },
];

export default function MusicPlayer() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);

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

  const onEnded = () => {
    const next = (trackIndex + 1) % PLAYLIST.length;
    setTrackIndex(next);
    // wait for the new src to be applied, then keep playing
    requestAnimationFrame(() => {
      audioRef.current?.play().catch(() => {});
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-[70]">
      <audio ref={audioRef} src={PLAYLIST[trackIndex].src} onEnded={onEnded} />
      <button
        onClick={toggle}
        className={`pixel border-2 px-3 py-2 text-[9px] transition ${
          playing
            ? "border-[var(--cyan)] bg-[var(--cyan)] text-black"
            : "border-white/15 bg-[var(--panel)] text-[var(--muted)] hover:border-white/40"
        }`}
        title="Wii/Wii U theme playlist"
      >
        {playing ? `♪ ${PLAYLIST[trackIndex].label}` : "♪ PLAY MUSIC"}
      </button>
    </div>
  );
}
