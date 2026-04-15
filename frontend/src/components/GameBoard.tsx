import React from "react";
import HPBar from "./HPBar";
// import Timer from "./Timer";
import Username from "./Username";
import WordHistory from "./WordHistory";
import WordInput from "./WordInput";

interface Player {
  username: string;
  hp: number;
}

interface WordEntry {
  word: string;
  player: "player1" | "player2";
  damage: number;
}

interface GameBoardProps {
  player1: Player;
  player2: Player;
  // timer: number;
  turn: "player1" | "player2";
  word: string;
  setWord: (value: string) => void;
  onSubmitWord: () => void;
  history: WordEntry[];
  children?: React.ReactNode; // DamagePopups
}

export default function GameBoard({
  player1,
  player2,
  // timer,
  turn,
  word,
  setWord,
  onSubmitWord,
  history,
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

      {/* WORD HISTORY (left-center) */}
      <WordHistory words={history} />

      {/* Player 1 (top-left) */}
      <div className="absolute top-20 left-4 text-left">
        <Username name={player1.username} isActive={turn === "player1"} align="left" />
        <HPBar hp={player1.hp} color="green" width={160} />
        <div className="text-sm mt-1">{player1.hp} HP</div>
      </div>

      {/* Player 2 (bottom-right) */}
      <div className="absolute bottom-20 right-4 text-right">
        <Username name={player2.username} isActive={turn === "player2"} align="right" />
        <HPBar hp={player2.hp} color="red" width={160} />
        <div className="text-sm mt-1">{player2.hp} HP</div>
      </div>

      {/* Center VS + Timer */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <h1 className="text-7xl font-extrabold tracking-widest opacity-80">
          VS
        </h1>

        <div className="mt-4">
          {/* <Timer value={timer} /> */}
        </div>
      </div>

      {/* Word Input (center bottom) */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-md px-4">
        <WordInput
          value={word}
          onChange={setWord}
          onSubmit={onSubmitWord}
          disabled={turn !== "player1"}
          isActive={turn === "player1"}
        />
      </div>

      {/* DAMAGE POPUPS */}
      {children}
    </main>
  );
}
