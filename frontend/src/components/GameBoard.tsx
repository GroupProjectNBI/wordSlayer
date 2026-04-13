import React from "react";

interface Player {
  username: string;
  hp: number;
}

interface GameBoardProps {
  player1: Player;
  player2: Player;
  timer: number;
  turn: "player1" | "player2";
  word: string;
  setWord: (value: string) => void;
  onSubmitWord: () => void;
  children?: React.ReactNode; // DamagePopups
}

export default function GameBoard({
  player1,
  player2,
  timer,
  turn,
  word,
  setWord,
  onSubmitWord,
  children
}: GameBoardProps) {
  return (
    <main className="min-h-screen bg-[#1a1a2e] text-white relative overflow-hidden">

      {/* TOP-CENTER TITLE */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center">
        <h1 className="text-4xl font-extrabold tracking-widest uppercase">
          Word Slayer
        </h1>
      </div>

      {/* Player 1 (top-left) */}
      <div className="absolute top-20 left-4 text-left">
        <div className="text-lg font-bold">{player1.username}</div>
        <div className="w-40 h-4 bg-gray-700 rounded-full mt-1">
          <div
            className="h-full bg-green-500 rounded-full transition-all"
            style={{ width: `${player1.hp}%` }}
          />
        </div>
        <div className="text-sm mt-1">{player1.hp} HP</div>
      </div>

      {/* Player 2 (bottom-right) */}
      <div className="absolute bottom-20 right-4 text-right">
        <div className="text-lg font-bold">{player2.username}</div>
        <div className="w-40 h-4 bg-gray-700 rounded-full mt-1">
          <div
            className="h-full bg-red-500 rounded-full transition-all"
            style={{ width: `${player2.hp}%` }}
          />
        </div>
        <div className="text-sm mt-1">{player2.hp} HP</div>
      </div>

      {/* Center VS */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <h1 className="text-7xl font-extrabold tracking-widest opacity-80">
          VS
        </h1>

        {/* Timer */}
        <div className="mt-4 text-3xl font-bold text-yellow-400">
          {timer}s
        </div>
      </div>

      {/* Input field (center bottom) */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-md px-4">
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder="Type your word..."
          className="w-full px-4 py-3 rounded-xl text-black text-lg"
          disabled={turn !== "player1"} // exempel: bara player1 kan skriva
          onKeyDown={(e) => e.key === "Enter" && onSubmitWord()}
        />
      </div>

      {/* DAMAGE POPUPS */}
      {children}
    </main>
  );
}
