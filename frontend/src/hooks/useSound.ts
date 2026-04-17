import { useRef } from "react";

export function useSound(src: string, options?: { loop?: boolean; }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  function play() {
    if (!audioRef.current) {
      audioRef.current = new Audio(src);
      audioRef.current.volume = 0.35;
      audioRef.current.loop = options?.loop ?? false;
    }

    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => { });
  }

  function stop() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }

  return { play, stop };
}
