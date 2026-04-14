import { useState } from "react";
import GameBoard from "../components/GameBoard";
import DamagePopup from "../components/DamagePopup";

export default function PlayGame() {
  const [player1, setPlayer1] = useState({ username: "PlayerOne", hp: 100 });
  const [player2, setPlayer2] = useState({ username: "PlayerTwo", hp: 100 });

  const [word, setWord] = useState("");
  // const [timer, setTimer] = useState(30);
  // Vi låtsas att vi alltid är Player 1 just nu
  const localPlayer = "player1";
  const [turn, setTurn] = useState<"player1" | "player2">("player1");

  // NYTT: State för att låtsas om vi är 1 eller 2 spelare (Sätt till 1 för att testa vänteläget!)
  const [connectedPlayers, setConnectedPlayers] = useState(1);

  const [popups, setPopups] = useState<
    { id: number; amount: number; position: "left" | "right"; }[]
  >([]);

  const [history, setHistory] = useState<
    { word: string; player: "player1" | "player2"; damage: number; }[]
  >([]);

  function dealDamage(amount: number, target: "left" | "right") {
    const id = Date.now();

    // Skapa popup
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

    // Lägg till ord i historiken
    setHistory((prev) => [
      ...prev,
      { word, player: turn, damage }
    ]);

    // Hantera damage + turbyte
    if (turn === "player1") {
      dealDamage(damage, "right");
      setTurn("player2");
    } else {
      dealDamage(damage, "left");
      setTurn("player1");
    }

    setWord("");
  }

  // -- LOGIK FÖR OVERLAY -- 

  let overlayMessage = null;

  if (connectedPlayers < 2) {
    overlayMessage = "Väntar på att en motståndare ska ansluta... ⏳";
  }
  else if (turn != localPlayer) {
    overlayMessage = "Motståndaren tänker... 🧠";
  }

  return (

    // 1. en container som håller allt på plats 
    // (position: relative är superviktigt här!)

    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      {/* 2. Själva spelet ritas alltid ut i bakgrunden */}
      <GameBoard
        player1={player1}
        player2={player2}
        // timer={timer}
        turn={turn}
        word={word}
        setWord={setWord}
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
      {/* 3. OVERLAYEN (Ritas bara ut om overlayMessage har en text) */}
      {/* 3. OVERLAYEN (Ritas bara ut om overlayMessage har en text) */}
      {overlayMessage && (
        <div
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)", // Mörk bakgrund
            backdropFilter: "blur(4px)",           // Suddar ut spelet bakom lite grann (supersnyggt!)
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 100,                           // Lägger den längst fram
            color: "white",
            fontSize: "2rem",
            fontWeight: "bold"
          }}
        >
          {/* Ett litet fultest: Klickar man på overlayen här byter vi tur/spelare för att testa logiken */}
          <div style={{ textAlign: "center" }}>
            <p>{overlayMessage}</p>

            {/* Dessa knappar är BARA för att du ska kunna testa designen innan backend kopplas in */}
            <div style={{ marginTop: "20px", display: "flex", gap: "10px", justifyContent: "center" }}>
              {connectedPlayers < 2 && (
                <button onClick={() => setConnectedPlayers(2)}>Test: Motståndare anslöt</button>
              )}
              {turn !== localPlayer && connectedPlayers === 2 && (
                <button onClick={() => setTurn("player1")}>Test: Motståndare spelade klart</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
