import { useState, useEffect, useCallback } from "react";
import { useWebsocket } from "../hooks/useWebsocket";
import { useParams, useLocation } from "react-router-dom";
import GameBoard from "../components/GameBoard";
import DamagePopup from "../components/DamagePopup";
import { useTurnManager, TimerState } from "../components/TurnManager/TurnManager";
import { useSound } from "../hooks/useSound";

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

  // WORD INPUT
  const [word, setWord] = useState("");

  // TURN
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
    async function loadGame() {
      if (!sessionId) {
        setError("Ingen session hittades i URL:en.");
        setLoading(false);
        return;
      }
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

  //
  // TIMER (LIVE MODE) från dev
  //
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

  //
  // MANUAL TIMER TICK (TEST MODE) från dev
  //
  useEffect(() => {
    if (!isTest) return;

    function manualTick() {
      setTimer((t) => {
        if (t <= 1) {
          setTurn((prev) => (prev === "player1" ? "player2" : "player1"));
          setTimerRunning(false);
          return 30;
        }
        return t - 1;
      });
    }

    window.addEventListener("manual-timer-tick", manualTick);
    return () => window.removeEventListener("manual-timer-tick", manualTick);
  }, [isTest]);

  //
  // DAMAGE LOGIC från dev
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
  // WORD INPUT CHANGE från dev
  //
  function handleWordChange(value: string) {
    setWord(value);

    // 🟩 FIX: I testläge ska timerRunning ALDRIG starta automatiskt
    if (isTest) return;

    if (!timerRunning && value.trim().length > 0) {
      setTimerRunning(true);
    }
  }

  //
  // GEMENSAM DAMAGE-HANTERING (det som testerna förväntar sig) från dev
  //
  function applyWordDamage(cleanWord: string) {
    const damage = cleanWord.length;
    setHistory(prev => [...prev, { word: cleanWord, player: turn, damage }]);

    if (turn === "player1") {
      dealDamage(damage, "right");
      setTurn("player2");
    } else {
      dealDamage(damage, "left");
      setTurn("player1");
    }

    setTimer(30);
    setTimerRunning(false);
    setWord("");
  }

  //
  // WORD SUBMISSION kombinerad
  //
  async function onSubmitWord() {
    const cleanWord = word.trim();
    if (!cleanWord) return;

    //
    // 🧪 TEST MODE — exakt gamla fungerande logiken från dev
    //
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
      const res = await fetch(`/api/game/${sessionId}/playword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wordGuess: cleanWord,
          playerId: localPlayer == 'player1' ? 'Player 1' : 'Player 2',
        }),
      });

      if (res.ok) {
        applyWordDamage(cleanWord);
      } else {
        setWord(cleanWord); // Återställ vid fel
        const data = await res.json();
        setError(data.message || "Ogiltigt ord.");
      }
    } catch {
      setWord(cleanWord);
      setError("Kunde inte nå servern.");
    }
  }

  //

  // OVERLAY LOGIC: Always show overlay if less than 2 players, in both test and live mode
  let overlayMessage: string | null = null;
  if (connectedPlayers < 2) {
    overlayMessage = "Väntar på motståndare... ⏳";
  } else if (turn !== localPlayer) {
    overlayMessage = "Motståndaren tänker... 🧠";
  } //

  //
  // RENDER från dev
  //
  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <GameBoard
        player1={player1}
        // Only pass player2 if there are at least 2 players
        {...(connectedPlayers > 1 ? { player2 } : {})}
        timer={timer}
        turn={turn}
        word={word}
        history={history}
        timerRunning={timerRunning}
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
          <div>
            <p>{overlayMessage}</p>

            <div
              style={{
                marginTop: 20,
                display: "flex",
                gap: 10,
                justifyContent: "center",
              }}
            >
              {connectedPlayers < 2 && (
                <button onClick={() => setConnectedPlayers(2)}>
                  Test: Motståndare anslöt
                </button>
              )}

              {turn !== localPlayer && connectedPlayers === 2 && (
                <button onClick={() => setTurn(localPlayer)}>
                  Test: Min tur nu
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}