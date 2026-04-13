import { useState } from "react";
import GameBoard from "../components/GameBoard";
import DamagePopup from "../components/DamagePopup";

export default function PlayGame() {
  const [player1, setPlayer1] = useState({ username: "PlayerOne", hp: 100 });
  const [player2, setPlayer2] = useState({ username: "PlayerTwo", hp: 100 });

  const [word, setWord] = useState("");
  const [timer, setTimer] = useState(30);
  const [turn, setTurn] = useState<"player1" | "player2">("player1");

  const [popups, setPopups] = useState<
    { id: number; amount: number; position: "left" | "right"; }[]
  >([]);

  function dealDamage(amount: number, target: "left" | "right") {
    const id = Date.now();
    setPopups((prev) => [...prev, { id, amount, position: target }]);

    if (target === "left") {
      setPlayer1((p) => ({ ...p, hp: Math.max(0, p.hp - amount) }));
    } else {
      setPlayer2((p) => ({ ...p, hp: Math.max(0, p.hp - amount) }));
    }
  }

  function onSubmitWord() {
    if (!word.trim()) return;

    const damage = word.length;

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
    <GameBoard
      player1={player1}
      player2={player2}
      timer={timer}
      turn={turn}
      word={word}
      setWord={setWord}
      onSubmitWord={onSubmitWord}
    >
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
    </GameBoard>
  );
}
