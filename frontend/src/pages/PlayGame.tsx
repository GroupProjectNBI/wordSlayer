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
  const { sessionId } = useParams<{ sessionId: string }>();
  const myName = sessionStorage.getItem("playerName") || "Player 1";
  const isTest = useLocation().search.includes("test");

  const [player1, setPlayer1] = useState({ username: "PlayerOne", hp: 100 });
  const [player2, setPlayer2] = useState({ username: "PlayerTwo", hp: 100 });
  const [connectedPlayers, setConnectedPlayers] = useState(0);

  const [word, setWord] = useState("");
  const [timer, setTimer] = useState(30);
  const [turn, setTurn] = useState<"player1" | "player2">("player1");
  const [timerRunning, setTimerRunning] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [popups, setPopups] = useState<{ id: number; amount: number; position: "left" | "right" }[]>([]);
  const [history, setHistory] = useState<{ word: string; player: "player1" | "player2"; damage: number }[]>([]);

  const localPlayer: "player1" | "player2" = myName === "Player 2" ? "player2" : "player1";

  // --- 1. SIGNALR CALLBACKS ---
  const handlePlayerJoined = useCallback(() => {
    setConnectedPlayers((prev) => Math.min(prev + 1, 2));
  }, []);

  // Här tar vi emot den absoluta sanningen från servern
  const handleTurnChanged = useCallback((nextTurn: "player1" | "player2", p1Hp: number, p2Hp: number) => {
    console.log("Mottagen HP från server:", { p1Hp, p2Hp });
    setTurn(nextTurn);

    // Uppdatera båda spelarnas HP mätare
    setPlayer1(prev => ({ ...prev, hp: p1Hp }));
    setPlayer2(prev => ({ ...prev, hp: p2Hp }));

    setTimer(30);
    setTimerRunning(false);
    setError("");
  }, []);

  useWebsocket(sessionId, myName, handlePlayerJoined, handleTurnChanged);

  // --- 2. INITIAL LADDNING ---
  useEffect(() => {
    async function loadInitialData() {
      if (!sessionId) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/game/${sessionId}`);
        if (!res.ok) throw new Error("Kunde inte hämta speldata");

        const game = await res.json() as BackendGameSession;
        setConnectedPlayers(game.players.length);

        if (game.players[0]) setPlayer1({ username: game.players[0].name, hp: game.players[0].health });
        if (game.players[1]) setPlayer2({ username: game.players[1].name, hp: game.players[1].health });

        if (game.currentTurn) {
          setTurn(game.currentTurn.toLowerCase() as "player1" | "player2");
        }
      } catch (err) {
        setError("Ett fel uppstod vid laddning av spelet.");
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, [sessionId]);

  // --- 3. TIMER LOGIK ---
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
  }, [timerRunning, turn, isTest]);

  // --- 4. SPEL-LOGIK ---
  function showDamagePopup(amount: number, target: "left" | "right") {
    const id = Date.now();
    setPopups((prev) => [...prev, { id, amount, position: target }]);
  }

  function applyWordDamage(cleanWord: string) {
    const damage = cleanWord.length;
    setHistory(prev => [...prev, { word: cleanWord, player: turn, damage }]);

    // Visa popup på rätt sida
    showDamagePopup(damage, turn === "player1" ? "right" : "left");

    // Om vi är i TEST-läge måste vi simulera HP-minskning och turväxling manuellt
    if (isTest) {
      if (turn === "player1") {
        setPlayer2(p => ({ ...p, hp: Math.max(0, p.hp - damage) }));
        setTurn("player2");
      } else {
        setPlayer1(p => ({ ...p, hp: Math.max(0, p.hp - damage) }));
        setTurn("player1");
      }
    }

    setWord("");
  }

  async function onSubmitWord() {
    const cleanWord = word.trim();
    if (!cleanWord || !sessionId) return;

    if (isTest) {
      applyWordDamage(cleanWord);
      return;
    }

    setWord(""); // Rensa direkt för bättre känsla

    try {
      const res = await fetch(`/api/game/${sessionId}/playword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wordGuess: cleanWord, playerId: myName }),
      });

      if (res.ok) {
        applyWordDamage(cleanWord);
      } else {
        setWord(cleanWord); // Återställ ordet om det blev fel
        const data = await res.json();
        setError(data.message);
      }
    } catch {
      setWord(cleanWord);
      setError("Nätverksfel");
    }
  }

  // --- 5. RENDER ---
  if (loading) return <div className="h-screen flex items-center justify-center bg-black text-white">Laddar...</div>;

  let overlayMessage = null;
  if (connectedPlayers < 2) {
    overlayMessage = "Väntar på motståndare... ⏳";
  } else if (!isTest && turn !== localPlayer) {
    overlayMessage = "Motståndaren tänker... 🧠";
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-900">
      {error && connectedPlayers > 0 && (
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
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-[100] text-white text-3xl font-bold p-10 text-center">
          <p>{overlayMessage}</p>
          {isTest && (
            <div className="mt-8 flex gap-4">
              <button onClick={() => setConnectedPlayers(2)} className="text-sm bg-white/20 px-4 py-2 rounded">Test: P2 anslöt</button>
              <button onClick={() => setTurn(localPlayer)} className="text-sm bg-white/20 px-4 py-2 rounded">Test: Min tur</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}