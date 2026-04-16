import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import GameBoard from "../components/GameBoard";
import DamagePopup from "../components/DamagePopup";
import { useTurnManager, TimerState } from "../components/TurnManager/TurnManager";

interface BackendGameSession {
  sessionId: string;
  players: { name: string; health: number; }[];
}

export default function PlayGame() {
  const { sessionId } = useParams<{ sessionId: string; }>();

  // TEST MODE
  const location = useLocation();
  const isTest = location.search.includes("test");

  // PLAYER STATE
  const [player1, setPlayer1] = useState({ username: "PlayerOne", hp: 100 });
  const [player2, setPlayer2] = useState({ username: "PlayerTwo", hp: 100 });

  // WORD INPUT
  const [word, setWord] = useState("");

  // TURN
  const [turn, setTurn] = useState<"player1" | "player2">("player1");
  const localPlayer: "player1" | "player2" = "player1";

  // POPUPS + HISTORY
  const [popups, setPopups] = useState<
    { id: number; amount: number; position: "left" | "right"; }[]
  >([]);

  const [history, setHistory] = useState<
    { word: string; player: "player1" | "player2"; damage: number; }[]
  >([]);

  // BACKEND LOADING
  const [, setLoading] = useState(true);
  const [, setError] = useState("");

  // TURN MANAGER (premium timer state machine)
  const { timer, dispatch } = useTurnManager(isTest, () => {
    // TIMEOUT → switch turn
    setTurn((prev) => (prev === "player1" ? "player2" : "player1"));
  });

  //
  // LOAD GAME FROM BACKEND (live mode)
  //
  useEffect(() => {
    if (isTest) return;

    async function loadGame() {
      if (!sessionId) {
        setError("Ingen session hittades i URL:en.");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`/api/game/${sessionId}`, {
          method: "GET",
          credentials: "same-origin",
          cache: "no-store",
        });

        if (!response.ok) {
          const body = await response.json().catch(() => null);
          setError(body?.message ?? "Kunde inte hämta speldata.");
          return;
        }

        const game = (await response.json()) as BackendGameSession;

        if (game.players.length > 0) {
          setPlayer1({
            username: game.players[0].name,
            hp: game.players[0].health,
          });
        }

        if (game.players.length > 1) {
          setPlayer2({
            username: game.players[1].name,
            hp: game.players[1].health,
          });
        }
      } catch (err) {
        console.error(err);
        setError("Kunde inte nå servern för att läsa spelet.");
      } finally {
        setLoading(false);
      }
    }

    loadGame();
  }, [sessionId, isTest]);

  //
  // TEST MODE: manual timer tick
  //
  useEffect(() => {
    if (!isTest) return;

    function manualTick() {
      dispatch({ type: "TICK" });
    }

    window.addEventListener("manual-timer-tick", manualTick);
    return () => window.removeEventListener("manual-timer-tick", manualTick);
  }, [isTest, dispatch]);

  //
  // DAMAGE LOGIC
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

    if (isTest) return;

    // Start timer when player begins typing
    if (timer.state === TimerState.Idle && value.trim().length > 0) {
      dispatch({ type: "TURN_START" });
    }
  }

  //
  // APPLY DAMAGE + TURN SWITCH
  //
  function applyWordDamage(cleanWord: string) {
    const damage = cleanWord.length;

    setHistory((prev) => [
      ...prev,
      { word: cleanWord, player: turn, damage },
    ]);

    if (turn === "player1") {
      dealDamage(damage, "right");
      setTurn("player2");
    } else {
      dealDamage(damage, "left");
      setTurn("player1");
    }

    // Reset timer
    dispatch({ type: "RESET" });
    setWord("");
  }

  //
  // WORD SUBMISSION
  //
  async function onSubmitWord() {
    const cleanWord = word.trim();
    if (!cleanWord) return;

    if (isTest) {
      applyWordDamage(cleanWord);
      return;
    }

    if (!sessionId) {
      console.error("No session ID found");
      return;
    }

    try {
      const response = await fetch(`/api/game/${sessionId}/playword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wordGuess: cleanWord,
          playerId: localPlayer === "player1" ? "Player 1" : "Player 2",
        }),
      });

      if (response.ok) {
        applyWordDamage(cleanWord);
      } else {
        const errorData = await response.json().catch(() => null);
        alert(errorData?.message ?? "Något gick fel.");
      }
    } catch (err) {
      console.error("Network error:", err);
    }
  }

  //
  // OVERLAY (disabled in test mode)
  //
  let overlayMessage: string | null = null;

  if (!isTest) {
    if (turn !== localPlayer) {
      overlayMessage = "Motståndaren tänker... 🧠";
    }
  }

  //
  // RENDER
  //
  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <GameBoard
        player1={player1}
        player2={player2}
        timer={timer.value}
        turn={turn}
        word={word}
        setWord={handleWordChange}
        onSubmitWord={onSubmitWord}
        history={history}
        timerRunning={timer.state === TimerState.Running}
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

      {overlayMessage && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(4px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 100,
            color: "white",
            fontSize: "2rem",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          <p>{overlayMessage}</p>
        </div>
      )}
    </div>
  );
}
