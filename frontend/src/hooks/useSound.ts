import { useRef, useEffect, useCallback } from "react";

interface SoundOptions {
  loop?: boolean;
  volume?: number;
}

export function useSound(src: string, options: SoundOptions = {}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Intiera ljudet
  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = options.loop ?? false;
    audio.volume = options.volume ?? 1.0;

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [src, options.loop, options.volume]);

  // Spela upp ljud
  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Test-mode: spela aldrig ljud
    if (typeof window !== "undefined" && window.location.search.includes("test")) {
      return;
    }

    audio.currentTime = 0;
    audio.play().catch(() => {
      // Browser kan blockera autoplay - ignoreras
    });
  }, []);

  // Stoppa ljud
  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
  }, []);

  return { play, stop };
}