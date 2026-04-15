import { useState } from "react";
import GameBoard from "../components/GameBoard";
import DamagePopup from "../components/DamagePopup";

export default function PlayGame() {
  // --- 1. STATE (REAKTS MINNE) ---
  const [player1, setPlayer1] = useState({ username: "PlayerOne", hp: 100 });
  const [player2, setPlayer2] = useState({ username: "PlayerTwo", hp: 100 });
  const [word, setWord] = useState("");

  // Identitets-logik från din HEAD
  const localPlayer: "player1" | "player2" = "player1";
  const [connectedPlayers, setConnectedPlayers] = useState(1);
  const [turn, setTurn] = useState<"player1" | "player2">("player1");

  // Typer från dev-branschen
  const [popups, setPopups] = useState<{ id: number; amount: number; position: "left" | "right"; }[]>([]);
  const [history, setHistory] = useState<{ word: string; player: "player1" | "player2"; damage: number; }[]>([]);

  // --- 2. HJÄLPFUNKTIONER ---
  function dealDamage(amount: number, target: "left" | "right") {
    const id = Date.now();
    setPopups((prev) => [...prev, { id, amount, position: target }]);

    if (target === "left") {
      setPlayer1((p) => ({ ...p, hp: Math.max(0, p.hp - amount) }));
    } else {
      setPlayer2((p) => ({ ...p, hp: Math.max(0, p.hp - amount) }));
    }
  }

  // --- 3. LOGIK FÖR ATT SKICKA TILL BACKEND ---
  async function onSubmitWord() {
    if (!word.trim()) return;

    const sessionId = "cd748152-6f11-40e9-8cdb-e52ec2b17f2a";

    try {
      const response = await fetch(`/api/game/${sessionId}/playword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wordGuess: word,
          playerId: localPlayer // Viktigt: Vi skickar med vem vi är!
        }),
      });

      if (response.ok) {
        const damage = word.length;
        setHistory((prev) => [...prev, { word, player: turn, damage }]);

        if (turn === "player1") {
          dealDamage(damage, "right");
          setTurn("player2");
        } else {
          dealDamage(damage, "left");
          setTurn("player1");
        }
        setWord("");
      } else {
        const errorData = await response.json();
        alert(errorData.message);
      }
    } catch (error) {
      console.error("❌ Nätverksfel:", error);
    }
  }

  // --- 4. LOGIK FÖR OVERLAY (Från din HEAD) --- 
  let overlayMessage = null;

  if (connectedPlayers < 2) {
    overlayMessage = "Väntar på att en motståndare ska ansluta... ⏳";
  } else if (turn !== localPlayer) {
    overlayMessage = "Motståndaren tänker... 🧠";
  }

  // --- 5. RENDERING ---
  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>

      <GameBoard
        player1={player1}
        player2={player2}
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
            onComplete={() => setPopups((prev) => prev.filter((x) => x.id !== p.id))}
          />
        ))}
      </GameBoard>

      {/* OVERLAYEN */}
      {overlayMessage && (
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          backdropFilter: "blur(4px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 100,
          color: "white",
          fontSize: "2rem",
          fontWeight: "bold",
          textAlign: "center"
        }}>
          <div>
            <p>{overlayMessage}</p>
            <div style={{ marginTop: "20px", display: "flex", gap: "10px", justifyContent: "center" }}>
              {connectedPlayers < 2 && (
                <button onClick={() => setConnectedPlayers(2)}>Test: Motståndare anslöt</button>
              )}
              {turn !== localPlayer && connectedPlayers === 2 && (
                <button onClick={() => setTurn(localPlayer)}>Test: Min tur nu</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}