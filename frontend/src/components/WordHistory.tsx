import React from "react";

interface WordEntry {
  word: string;
  player: "player1" | "player2";
  damage: number;
}

interface WordHistoryProps {
  words: WordEntry[];
}

export default function WordHistory({ words }: WordHistoryProps) {
  return (
    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-48 bg-black/30 backdrop-blur-sm p-3 rounded-xl border border-white/10">
      <h2 className="text-lg font-bold mb-2 text-center tracking-wide">
        History
      </h2>

      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {words.length === 0 && (
          <div className="text-sm text-gray-300 text-center opacity-70">
            No words yet
          </div>
        )}

        {words.map((entry, index) => (
          <div
            key={index}
            className={`
              flex justify-between items-center px-2 py-1 rounded-md
              ${entry.player === "player1" ? "bg-green-600/30" : "bg-red-600/30"}
            `}
          >
            <span className="font-semibold">{entry.word}</span>
            <span className="text-sm opacity-80">-{entry.damage}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
