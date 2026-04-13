import { useState } from "react";
import DamagePopup from "../components/DamagePopup";

export default function PlayGame() {
  // Dessa kommer senare från backend
  const [player1, setPlayer1] = useState({ username: "PlayerOne", hp: 100 });
  const [player2, setPlayer2] = useState({ username: "PlayerTwo", hp: 100 });

  const [word, setWord] = useState("");
  const [timer, setTimer] = useState(30); // förberett för backend
  const [turn, setTurn] = useState<"player1" | "player2">("player1");

  // Damage popups
  const [popups, setPopups] = useState<
    { id: number; amount: number; position: "left" | "right"; }[]
  >([]);

  function dealDamage(amount: number, target: "left" | "right") {
    const id = Date.now();

    // Visa popup
    setPopups((prev) => [...prev, { id, amount, position: target }]);

    // Uppdatera HP
    if (target === "left") {
      setPlayer1((p) => ({ ...p, hp: Math.max(0, p.hp - amount) }));
    } else {
      setPlayer2((p) => ({ ...p, hp: Math.max(0, p.hp - amount) }));
    }
  }

  function onSubmitWord() {
    if (!word.trim()) return;

    const damage = word.length;

    // Exempel: player1 attackerar player2
    if (turn === "player1") {
      dealDamage(damage, "right");
      setTurn("player2");
    } else {
      dealDamage(damage, "left");
      setTurn("player1");
    }

    setWord("");
  }

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
          className="w-full px-4 py-3 rounded-xl text-white text-lg"
          disabled={turn !== "player1"} // exempel: bara player1 kan skriva
          onKeyDown={(e) => e.key === "Enter" && onSubmitWord()}
        />
      </div>

      {/* DAMAGE POPUPS */}
      {popups.map((p) => (
        <DamagePopup
          key={p.id}
          amount={p.amount}
          position={p.position}
          onComplete={() =>
            setPopups((prev) => prev.filter((x) => x.id !== p.id))
          }
        />
      ))}
    </main>
  );
}
