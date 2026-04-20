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

  // --- 1. STATES ---
  const [player1, setPlayer1] = useState({ username: "PlayerOne", hp: 100 });
  const [player2, setPlayer2] = useState({ username: "PlayerTwo", hp: 100 });
  const [connectedPlayers, setConnectedPlayers] = useState(0);

  const [word, setWord] = useState("");
  const [timer, setTimer] = useState(30);
  const [turn, setTurn] = useState<"player1" | "player2">("player1");
  const [timerRunning, setTimerRunning] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [popups, setPopups] = useState<{ id: number; amount: number; position: "left" | "right"; }[]>([]);
  const [history, setHistory] = useState<{ word: string; player: "player1" | "player2"; damage: number; }[]>([]);

  // Identifiera om användaren är vänster (p1) eller höger (p2)
  const localPlayer: "player1" | "player2" = myName === "Player 2" ? "player2" : "player1";

  // --- 2. SIGNALR CALLBACKS ---
  const handleTurnChanged = useCallback((nextTurn: "player1" | "player2", p1Hp: number, p2Hp: number) => {
    setTurn(nextTurn);
    setPlayer1(prev => ({ ...prev, hp: p1Hp })); // Synka HP från servern
    setPlayer2(prev => ({ ...prev, hp: p2Hp }));
    setTimer(30);
    setTimerRunning(false);
    setError("");
  }, []);

  const handlePlayerJoined = useCallback((_playerName: string) => {
    setConnectedPlayers((prev) => Math.min(prev + 1, 2));
  }, []);

  useWebsocket(sessionId, myName, handlePlayerJoined, handleTurnChanged);

  // --- 3. TEST-BAKDÖRR (För Playwright) ---
  useEffect(() => {
    if (!isTest) return; // Bara aktivt i Playwright-test
    const handleTestSignal = (e: any) => {
      const { nextTurn, p1Hp, p2Hp } = e.detail;
      handleTurnChanged(nextTurn, p1Hp, p2Hp); // Tvinga staten att uppdateras
    };
    window.addEventListener("signalr-turn-changed", handleTestSignal);
    return () => window.removeEventListener("signalr-turn-changed", handleTestSignal);
  }, [isTest, handleTurnChanged]);

  // --- 4. INITIAL LADDNING ---
  useEffect(() => {
    async function loadInitialData() {
      if (!sessionId) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/game/${sessionId}`);
        if (!res.ok) throw new Error("Could not fetch game data");

        const game = await res.json() as BackendGameSession;
        setConnectedPlayers(game.players.length);

        if (game.players[0]) setPlayer1({ username: game.players[0].name, hp: game.players[0].health });
        if (game.players[1]) setPlayer2({ username: game.players[1].name, hp: game.players[1].health });

        if (game.currentTurn) {
          setTurn(game.currentTurn.toLowerCase() as "player1" | "player2");
        }
      } catch (err) {
        setError("An error occured while loading.");
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, [sessionId]); //

  // --- 5. TIMER LOGIK (Timeout till Backend) ---
  useEffect(() => {
    if (!timerRunning || isTest || turn !== localPlayer) return;

    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          fetch(`/api/game/${sessionId}/timeout?playerId=${myName}`, { method: "POST" }).catch(console.error);
          setTimerRunning(false);
          return 30;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning, turn, localPlayer, sessionId, myName, isTest]); //

  // --- 6. SPEL-LOGIK ---
  function applyWordDamage(cleanWord: string) {
    const damage = cleanWord.length;
    setHistory(prev => [...prev, { word: cleanWord, player: turn, damage }]);

    // Visa popup på motståndarens sida
    const target = turn === "player1" ? "right" : "left";
    setPopups((prev) => [...prev, { id: Date.now(), amount: damage, position: target }]);

    if (isTest) {
      // Manuell simulering för testläge utan backend-signal
      setTurn(prev => prev === "player1" ? "player2" : "player1");
    }
    setWord("");
  }

  async function onSubmitWord() {
    const cleanWord = word.trim();
    if (!cleanWord || !sessionId) return;

    setWord(""); // Rensa fältet direkt för responsivitet

    try {
      const res = await fetch(`/api/game/${sessionId}/playword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wordGuess: cleanWord, playerId: myName }),
      });

      if (res.ok) {
        applyWordDamage(cleanWord);
      } else {
        setWord(cleanWord); // Återställ vid fel
        setError ("Invalid word.");
      }
    } catch {
      setWord(cleanWord);
      setError("Could not reach the server.");
    }
  }

  // --- 7. RENDER ---
  if (loading) return <div className="h-screen flex items-center justify-center bg-black text-white uppercase">Loading game...</div>;

  let overlayMessage = null;
  if (connectedPlayers < 2) {
    overlayMessage = "Waiting for opponent... ⏳";
  } else if (turn !== localPlayer) {
    overlayMessage = "Opponent is thinking... 🧠";
  } //

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-900">
      {error && (
        <div className="absolute top-10 left-1/2 -translate-x-1/2 z-[110] bg-red-600 text-white px-6 py-2 rounded-full font-bold shadow-2xl">
          {error}
        </div>
      )}

      <GameBoard
        player1={player1}
        player2={connectedPlayers > 1 ? player2 : undefined}
        timer={timer}
        turn={turn}
        localPlayer={localPlayer}
        word={word}
        history={history}
        timerRunning={timerRunning}
        setWord={(v) => {
          setWord(v);
          if (!isTest && v.trim()) setTimerRunning(true);
        }}
        onSubmitWord={onSubmitWord}
      >
        {popups.map(p => (
          <DamagePopup
            key={p.id}
            amount={p.amount}
            position={p.position}
            onComplete={() => setPopups(prev => prev.filter(x => x.id !== p.id))}
          />
        ))}
      </GameBoard>

      {overlayMessage && (
        <div
          data-testid="overlay" // För common.steps.js
          className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-[100] text-white text-3xl font-bold p-10 text-center"
        >
          <p>{overlayMessage}</p>
        </div>
      )}
    </div>
  );
}