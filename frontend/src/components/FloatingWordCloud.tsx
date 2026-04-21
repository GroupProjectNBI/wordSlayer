import { useEffect, useMemo, useState } from "react";

interface FloatingWord {
  id: number;
  word: string;
  damage: number;
}

interface FloatingWordCloudProps {
  words: FloatingWord[];
}

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface PositionedWord {
  id: number;
  word: string;
  damage: number;
  x: number;
  y: number;
  fontSize: number;
  duration: number;
  delay: number;
  driftX: number;
  driftY: number;
  driftXAlt: number;
  driftYAlt: number;
}

function mulberry32(seed: number) {
  // Seedad slump gör att samma ord får samma rörelsemönster mellan renders,
  // vilket gör layouten mer stabil och lättare att felsöka/testa.
  return function rand() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function intersects(a: Box, b: Box) {
  return !(a.x + a.w < b.x || b.x + b.w < a.x || a.y + a.h < b.y || b.y + b.h < a.y);
}

function overlapArea(a: Box, b: Box) {
  const xOverlap = Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x));
  const yOverlap = Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));
  return xOverlap * yOverlap;
}

export default function FloatingWordCloud({ words }: FloatingWordCloudProps) {
  const [viewport, setViewport] = useState({ width: 1280, height: 720 });

  useEffect(() => {
    const updateViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  const positionedWords = useMemo<PositionedWord[]>(() => {
    const placed: Box[] = [];
    const output: PositionedWord[] = [];

    // Reserverade zoner skyddar viktiga HUD-delar så att ord inte hamnar
    // över spelarinformation, timer, titel eller inputfält.
    const reserved: Box[] = [
      { x: 0, y: 0, w: 360, h: 220 },
      { x: viewport.width - 380, y: viewport.height - 300, w: 380, h: 300 },
      { x: viewport.width * 0.32, y: viewport.height * 0.22, w: viewport.width * 0.36, h: viewport.height * 0.52 },
      { x: viewport.width * 0.22, y: viewport.height - 180, w: viewport.width * 0.56, h: 180 },
      { x: viewport.width * 0.3, y: 0, w: viewport.width * 0.4, h: 90 },
      { x: viewport.width - 240, y: 0, w: 240, h: 100 },
    ];

    const visibleWords = words.slice(-120);

    for (const item of visibleWords) {
      const rand = mulberry32(item.id);
      const baseSize = 15 + Math.min(item.word.length, 10);
      const fontSize = Math.min(30, Math.max(16, baseSize));
      const estimatedWidth = Math.max(70, item.word.length * (fontSize * 0.64)) + 22;
      const estimatedHeight = fontSize + 18;
      const margin = 8;
      const motionX = (24 + rand() * 26) * (viewport.width < 900 ? 0.7 : 1);
      const motionY = (18 + rand() * 22) * (viewport.height < 680 ? 0.7 : 1);
      const motionXAlt = (18 + rand() * 20) * (viewport.width < 900 ? 0.7 : 1);
      const motionYAlt = (14 + rand() * 18) * (viewport.height < 680 ? 0.7 : 1);
      // Envelopen är ordets "säkerhetsyta": vi reserverar plats för hela
      // rörelsebanan, inte bara startpositionen, för att minska framtida overlap.
      const envelopeX = Math.ceil(Math.max(motionX, motionXAlt) + 14);
      const envelopeY = Math.ceil(Math.max(motionY, motionYAlt) + 14);

      let chosen: Box | null = null;
      let minScore = Number.POSITIVE_INFINITY;
      let leastOverlapCandidate: Box | null = null;

      for (let i = 0; i < 140; i += 1) {
        const x = envelopeX + margin + rand() * Math.max(1, viewport.width - estimatedWidth - envelopeX * 2 - margin * 2);
        const y = envelopeY + margin + rand() * Math.max(1, viewport.height - estimatedHeight - envelopeY * 2 - margin * 2);
        const candidate = {
          x: x - envelopeX,
          y: y - envelopeY,
          w: estimatedWidth + envelopeX * 2,
          h: estimatedHeight + envelopeY * 2,
        };

        const collidesWithPlaced = placed.some((box) => intersects(candidate, box));
        const collidesWithReserved = reserved.some((box) => intersects(candidate, box));

        if (!collidesWithPlaced && !collidesWithReserved) {
          chosen = candidate;
          break;
        }

        // Om vi inte hittar perfekt plats väljer vi senare den kandidat som
        // ger minst total visuell konflikt i stället för att droppa ordet direkt.
        const overlapScore = [...placed, ...reserved].reduce(
          (sum, box) => sum + overlapArea(candidate, box),
          0
        );
        if (overlapScore < minScore) {
          minScore = overlapScore;
          leastOverlapCandidate = candidate;
        }
      }

      const finalBox = chosen ?? leastOverlapCandidate;
      if (!finalBox) {
        continue;
      }

      // Vi sparar den reserverade ytan i placeringslistan så att nästa ord
      // också tar hänsyn till den kommande animationen.
      placed.push(finalBox);

      output.push({
        id: item.id,
        word: item.word,
        damage: item.damage,
        x: finalBox.x + envelopeX,
        y: finalBox.y + envelopeY,
        fontSize,
        duration: 10 + rand() * 6,
        delay: -1 * rand() * 6,
        driftX: (rand() > 0.5 ? 1 : -1) * motionX,
        driftY: (rand() > 0.5 ? 1 : -1) * motionY,
        driftXAlt: (rand() > 0.5 ? 1 : -1) * motionXAlt,
        driftYAlt: (rand() > 0.5 ? 1 : -1) * motionYAlt,
      });
    }

    return output;
  }, [words, viewport.height, viewport.width]);

  if (positionedWords.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-20" data-testid="floating-word-cloud">
      {positionedWords.map((item) => (
        <span
          key={item.id}
          data-testid="floating-word"
          className="absolute font-black text-cyan-100 drop-shadow-[0_0_8px_rgba(45,212,191,0.6)]"
          style={{
            left: item.x,
            top: item.y,
            fontSize: item.fontSize,
            lineHeight: 1,
            whiteSpace: "nowrap",
            textShadow: "0 2px 10px rgba(0, 0, 0, 0.6)",
            transform: "translate3d(0,0,0)",
            // Rörelsen görs med transform för att vara billig att animera.
            willChange: "transform",
            animation: `word-drift ${item.duration}s linear ${item.delay}s infinite`,
            ["--drift-x" as string]: `${item.driftX}px`,
            ["--drift-y" as string]: `${item.driftY}px`,
            ["--drift-x-alt" as string]: `${item.driftXAlt}px`,
            ["--drift-y-alt" as string]: `${item.driftYAlt}px`,
          }}
          title={`-${item.damage}`}
        >
          {item.word}
        </span>
      ))}
    </div>
  );
}
