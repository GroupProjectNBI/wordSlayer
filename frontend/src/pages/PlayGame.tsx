import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GameBoard from "../components/GameBoard";
import DamagePopup from "../components/DamagePopup";

interface BackendGameSession {
  sessionId: string;
  players: { name: string; health: number }[];
}

export default function PlayGame() {
  const { sessionId } = useParams<{ sessionId: string }>();

  // --- 1. STATE (REAKTS MINNE) ---
  const [player1, setPlayer1] = useState({ username: "PlayerOne", hp: 100 });
  const [player2, setPlayer2] = useState({ username: "PlayerTwo", hp: 100 });
  const [word, setWord] = useState("");
  const [, setLoading] = useState(true);
  const [, setError] = useState("");

  // Identitets-logik från din HEAD
  const localPlayer: "player1" | "player2" = "player1";
  const [connectedPlayers, setConnectedPlayers] = useState(1);
  const [turn, setTurn] = useState<"player1" | "player2">("player1");
  const [timer] = useState(30);
  const [timerRunning] = useState(true);

  // Typer från dev-branschen
  const [popups, setPopups] = useState<{ id: number; amount: number; position: "left" | "right"; }[]>([]);
  const [history, setHistory] = useState<{ word: string; player: "player1" | "player2"; damage: number; }[]>([]);

  useEffect(() => {
    async function loadGame() {
      // If the URL does not include a session ID, we cannot load the game.
      if (!sessionId) {
        setError("Ingen session hittades i URL:en.");
        setLoading(false);
        return;
      }

      // Load the current game state from the backend for this session.
      setLoading(true);
      try {
        const response = await fetch(`/api/game/${sessionId}`, {
          method: 'GET',
          credentials: 'same-origin',
          cache: 'no-store'
        });

        if (!response.ok) {
          const body = await response.json().catch(() => null);
          setError(body?.message ?? 'Kunde inte hämta speldata.');
          return;
        }

        // Build the local player state from the backend response.
        const game = (await response.json()) as BackendGameSession;
        setConnectedPlayers(game.players.length);

        if (game.players.length > 0) {
          setPlayer1({ username: game.players[0].name, hp: game.players[0].health });
        }

        if (game.players.length > 1) {
          setPlayer2({ username: game.players[1].name, hp: game.players[1].health });
        }
      } catch (err) {
        console.error(err);
        setError('Kunde inte nå servern för att läsa spelet.');
      } finally {
        setLoading(false);
      }
    }

    loadGame();
  }, [sessionId]);

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
    if (!sessionId) {
      console.error("No session ID found");
      return;
    }

    // Send the played word to the backend for validation and damage calculation.
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
        timer={timer}
        turn={turn}
        word={word}
        setWord={setWord}
        onSubmitWord={onSubmitWord}
        history={history}
        timerRunning={timerRunning}
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