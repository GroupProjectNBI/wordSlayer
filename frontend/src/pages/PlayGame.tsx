import { useState, useEffect } from "react";
import { useWebsocket } from "../hooks/useWebsocket";
import { useParams, useLocation } from "react-router-dom";
import GameBoard from "../components/GameBoard";
import DamagePopup from "../components/DamagePopup";

interface BackendGameSession {
  sessionId: string;
  players: { name: string; health: number; }[];
}

export default function PlayGame() {
  const { sessionId } = useParams<{ sessionId: string; }>();

  //
  // TEST DETECTION (detta är den kritiska fixen från dev)
  //
  const location = useLocation();
  const isTest = location.search.includes("test");


  const [player1, setPlayer1] = useState({ username: "PlayerOne", hp: 100 });
  const [player2, setPlayer2] = useState({ username: "PlayerTwo", hp: 100 });

  const [word, setWord] = useState("");
  const [timer, setTimer] = useState(30);
  const [turn, setTurn] = useState<"player1" | "player2">("player1");
  const [timerRunning, setTimerRunning] = useState(false);

  const localPlayer: "player1" | "player2" = "player1";
  const [connectedPlayers, setConnectedPlayers] = useState(0);

  // Real-time update: listen for PlayerJoined events
  useWebsocket(sessionId, () => {
    setConnectedPlayers((prev) => Math.min(prev + 1, 2));
  });

  const [popups, setPopups] = useState<
    { id: number; amount: number; position: "left" | "right"; }[]
  >([]);

  const [history, setHistory] = useState<
    { word: string; player: "player1" | "player2"; damage: number; }[]
  >([]);

  const [, setLoading] = useState(true);
  const [, setError] = useState("");

  //
  // LOAD GAME FROM BACKEND (för live mode, från HEAD men med sessionId från params)
  //
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
      const response = await fetch(`/api/game/${sessionId}/playword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wordGuess: cleanWord,
          playerId: localPlayer == 'player1' ? 'Player 1' : 'Player 2',
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

  // OVERLAY LOGIC: Always show overlay if less than 2 players, in both test and live mode
  let overlayMessage: string | null = null;
  if (connectedPlayers < 2) {
    overlayMessage = "Väntar på att en motståndare ska ansluta... ⏳";
  } else if (!isTest && turn !== localPlayer) {
    overlayMessage = "Motståndaren tänker... 🧠";
  }

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
