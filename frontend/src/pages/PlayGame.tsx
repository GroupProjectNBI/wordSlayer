import { useState, useEffect } from "react";
import GameBoard from "../components/GameBoard";
import DamagePopup from "../components/DamagePopup";

export default function PlayGame() {
  const [player1, setPlayer1] = useState({ username: "PlayerOne", hp: 100 });
  const [player2, setPlayer2] = useState({ username: "PlayerTwo", hp: 100 });

  const [word, setWord] = useState("");
  const [timer, setTimer] = useState(30);
  const [turn, setTurn] = useState<"player1" | "player2">("player1");

  const [timerRunning, setTimerRunning] = useState(false);

  const [popups, setPopups] = useState<
    { id: number; amount: number; position: "left" | "right"; }[]
  >([]);

  const [history, setHistory] = useState<
    { word: string; player: "player1" | "player2"; damage: number; }[]
  >([]);

  //
  // TIMER LOGIC
  //
  useEffect(() => {
    if (!timerRunning) return;

    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          // Timer ran out → switch turn + reset
          setTurn((prev) => (prev === "player1" ? "player2" : "player1"));
          setTimerRunning(false); // stop until next player types
          return 30;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerRunning, turn]);

  //
  // DAMAGE + TURN LOGIC
  //
  function dealDamage(amount: number, target: "left" | "right") {
    const id = Date.now();

    setPopups((prev) => [...prev, { id, amount, position: target }]);

    if (target === "left") {
      setPlayer1((p) => ({ ...p, hp: Math.max(0, p.hp - amount) }));
    } else {
      setPlayer2((p) => ({ ...p, hp: Math.max(0, p.hp - amount) }));
    }
  }

  //
  // WORD INPUT CHANGE
  //
  function handleWordChange(value: string) {
    setWord(value);

    // Start timer when player begins typing
    if (!timerRunning && value.trim().length > 0) {
      setTimerRunning(true);
    }
  }

  //
  // WORD SUBMISSION
  //
  function onSubmitWord() {
    if (!word.trim()) return;

    const damage = word.length;

    setHistory((prev) => [...prev, { word, player: turn, damage }]);

    if (turn === "player1") {
      dealDamage(damage, "right");
      setTurn("player2");
    } else {
      dealDamage(damage, "left");
      setTurn("player1");
    }

    // Reset timer and stop until next player types
    setTimer(30);
    setTimerRunning(false);

    setWord("");
  }

  return (
    <GameBoard
      player1={player1}
      player2={player2}
      timer={timer}
      turn={turn}
      word={word}
      setWord={handleWordChange}
      onSubmitWord={onSubmitWord}
      history={history}
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
