import { useRef } from "react";

export function useSound(src: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  function play() {
    if (!audioRef.current) {
      audioRef.current = new Audio(src);
      audioRef.current.volume = 0.35; // premium volume
    }

    // Restart from beginning
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => { });
  }

  return play;
}
