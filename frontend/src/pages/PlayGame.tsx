import { useState, useEffect, useCallback } from "react";
import { useWebsocket } from "../hooks/useWebsocket";
import { useParams, useLocation } from "react-router-dom";
import GameBoard from "../components/GameBoard";
import DamagePopup from "../components/DamagePopup";

interface BackendGameSession {
  sessionId: string;
  players: { name: string; health: number; }[];
  currentTurn: string;
}

export default function PlayGame() {
  const { sessionId } = useParams<{ sessionId: string; }>();
  const myName = sessionStorage.getItem("playerName") || "Player 1";
  const isTest = useLocation().search.includes("test");

  // --- STATES ---
  const [player1, setPlayer1] = useState({ username: "Player 1", hp: 100 });
  const [player2, setPlayer2] = useState({ username: "Player 2", hp: 100 });
  const [connectedPlayers, setConnectedPlayers] = useState(0);

  const [word, setWord] = useState("");
  const [turn, setTurn] = useState<"player1" | "player2">("player1");
  const [timer, setTimer] = useState(30);
  const [timerRunning, setTimerRunning] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [popups, setPopups] = useState<
    { id: number; amount: number; position: "left" | "right"; }[]
  >([]);

  const [history, setHistory] = useState<
    { word: string; player: "player1" | "player2"; damage: number; }[]
  >([]);

  const localPlayer: "player1" | "player2" =
    myName === "Player 2" ? "player2" : "player1";

  // --- SIGNALR CALLBACKS ---
  const handleTurnChanged = useCallback(
    (nextTurn: "player1" | "player2", p1Hp: number, p2Hp: number) => {
      setTurn(nextTurn);
      setPlayer1((prev) => ({ ...prev, hp: p1Hp }));
      setPlayer2((prev) => ({ ...prev, hp: p2Hp }));
      setTimer(30);
      setTimerRunning(false);
      setError("");
    },
    []
  );

  const handlePlayerJoined = useCallback(() => {
    setConnectedPlayers((prev) => Math.min(prev + 1, 2));
  }, []);

  useWebsocket(sessionId, myName, handlePlayerJoined, handleTurnChanged);

  // --- TEST SIGNALR BACKDOOR ---
  useEffect(() => {
    if (!isTest) return;

    const handler = (e: any) => {
      const { nextTurn, p1Hp, p2Hp } = e.detail;
      handleTurnChanged(nextTurn, p1Hp, p2Hp);
    };

    window.addEventListener("signalr-turn-changed", handler);
    return () => window.removeEventListener("signalr-turn-changed", handler);
  }, [isTest, handleTurnChanged]);

  // --- INITIAL LOAD ---
  useEffect(() => {
    async function loadGame() {
      if (!sessionId) {
        setError("Ingen session hittades.");
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const res = await fetch(`/api/game/${sessionId}`);
        if (!res.ok) {
          setError("Kunde inte hämta speldata.");
          setLoading(false);
          return;
        }

        const game = (await res.json()) as BackendGameSession;
        setConnectedPlayers(game.players.length);


        if (game.players[0]) setPlayer1({
          username: game.players[0].name,
          hp: game.players[0].health,
        });

        if (game.players[1]) setPlayer2({
          username: game.players[1].name,
          hp: game.players[1].health,
        });

        if (game.currentTurn) {
          setTurn(game.currentTurn.toLowerCase() as "player1" | "player2");
        }
      } catch (err) {
        setError("Ett fel uppstod vid laddning.");
        console.error(err);
        setError("Kunde inte nå servern för att läsa spelet.");
      } finally {
        setLoading(false);
      }
    }

    loadGame();
  }, [sessionId]);
  loadInitialData();
}, [sessionId]); //

// --- LIVE TIMER ---
useEffect(() => {
  if (!timerRunning || isTest) return;

  const interval = setInterval(() => {
    setTimer((t) => {
      if (t <= 1) {
        setTurn((prev) => (prev === "player1" ? "player2" : "player1"));
        setTimerRunning(false);
        return 30;
      }
      return t - 1;
    });
  }, 1000);

  return () => clearInterval(interval);
}, [timerRunning, isTest]);

// --- TEST TIMER ---
useEffect(() => {
  if (!isTest) return;

  const manualTick = () => {
    setTimer((t) => {
      if (t <= 1) {
        setTurn((prev) => (prev === "player1" ? "player2" : "player1"));
        setTimerRunning(false);
        return 30;
      }
      return t - 1;
    });
  };

  window.addEventListener("manual-timer-tick", manualTick);
  return () => window.removeEventListener("manual-timer-tick", manualTick);
}, [isTest]);

// --- DAMAGE ---
function dealDamage(amount: number, target: "left" | "right") {
  const id = Date.now();
  setPopups((prev) => [...prev, { id, amount, position: target }]);

  if (target === "left") {
    setPlayer1((p) => ({ ...p, hp: Math.max(0, p.hp - amount) }));
  } else {
    setPlayer2((p) => ({ ...p, hp: Math.max(0, p.hp - amount) }));
  }
}

// --- WORD INPUT ---
function handleWordChange(value: string) {
  setWord(value);

  if (isTest) return;

  if (!timerRunning && value.trim().length > 0) {
    setTimerRunning(true);
  }
}

// --- APPLY DAMAGE ---
function applyWordDamage(cleanWord: string) {
  const damage = cleanWord.length;

  setHistory((prev) => [...prev, { word: cleanWord, player: turn, damage }]);

  // Visa popup på motståndarens sida
  const target = turn === "player1" ? "right" : "left";
  setPopups((prev) => [...prev, { id: Date.now(), amount: damage, position: target }]);

  if (isTest) {
    // Manuell simulering för testläge utan backend-signal
    setTurn(prev => prev === "player1" ? "player2" : "player1");
  }
  if (turn === "player1") {
    dealDamage(damage, "right");
    setTurn("player2");
  } else {
    dealDamage(damage, "left");
    setTurn("player1");
  }

  dispatch({ type: "RESET" });
  startCooldown();
  setWord("");
}

// --- SUBMIT WORD ---
async function onSubmitWord() {
  const cleanWord = word.trim();
  if (!cleanWord) return;

  if (isTest) {
    applyWordDamage(cleanWord);
    return;
  }

  //
  // 🌐 LIVE MODE — backend submission från HEAD, men med sessionId från params
  //
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

    if (res.ok) {
      applyWordDamage(cleanWord);
    } else {
      setError("Ogiltigt ord.");
    }
  } catch {
    setError("Serverfel.");
  }
}

// --- OVERLAY ---
let overlayMessage: string | null = null;

if (connectedPlayers < 2) {
  overlayMessage = "Väntar på motståndare... ⏳";
} else if (turn !== localPlayer) {
  overlayMessage = "Motståndaren tänker... 🧠";
}

//
// RENDER från dev
//
return (
  <div className="relative w-full h-screen overflow-hidden bg-slate-900">
    {error && (
      <div className="absolute top-10 left-1/2 -translate-x-1/2 z-[110] bg-red-600 text-white px-6 py-2 rounded-full font-bold shadow-2xl">
        {error}
      </div>
    )}


    {/* MUTE BUTTON */}
    <button
      onClick={() => setMusicMuted((m) => !m)}
      style={{
        position: "absolute",
        top: 20,
        right: 20,
        zIndex: 200,
        padding: "10px 16px",
        background: "rgba(0,0,0,0.6)",
        color: "white",
        borderRadius: 8,
        border: "1px solid white",
        cursor: "pointer",
        fontSize: "1rem",
      }}
    >
      {musicMuted ? "Unmute Music" : "Mute Music"}
    </button>

    <GameBoard
      player1={player1}
      // Only pass player2 if there are at least 2 players
      {...(connectedPlayers > 1 ? { player2 } : {})}
      timer={timer}
      turn={turn}
      word={word}
      setWord={handleWordChange}
      onSubmitWord={onSubmitWord}
      history={history}
      timerRunning={timerRunning}
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
        data-testid="overlay"
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
        data-testid="overlay" // För common.steps.js
        className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-[100] text-white text-3xl font-bold p-10 text-center"
        >
        <p>{overlayMessage}</p>
      </div>
    )}
  </div>
);
}
