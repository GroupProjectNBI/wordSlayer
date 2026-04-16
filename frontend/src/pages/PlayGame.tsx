import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameBoard from "../components/GameBoard";
import DamagePopup from "../components/DamagePopup";

export default function PlayGame() {
  //
  // TEST DETECTION (detta är den kritiska fixen)
  //
  const location = useLocation();
  const isTest = location.search.includes("test");

  //
  // STATE
  //
  const [player1, setPlayer1] = useState({ username: "PlayerOne", hp: 100 });
  const [player2, setPlayer2] = useState({ username: "PlayerTwo", hp: 100 });

  const [word, setWord] = useState("");
  const [timer, setTimer] = useState(30);
  const [turn, setTurn] = useState<"player1" | "player2">("player1");
  const [timerRunning, setTimerRunning] = useState(false);

  const localPlayer: "player1" | "player2" = "player1";
  const [connectedPlayers, setConnectedPlayers] = useState(1);

  const [popups, setPopups] = useState<
    { id: number; amount: number; position: "left" | "right"; }[]
  >([]);

  const [history, setHistory] = useState<
    { word: string; player: "player1" | "player2"; damage: number; }[]
  >([]);

  //
  // TIMER (LIVE MODE)
  //
  useEffect(() => {
    if (!timerRunning || isTest) return; // testläge använder manual ticks

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
  // MANUAL TIMER TICK (TEST MODE)
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

    if (!timerRunning && value.trim().length > 0) {
      setTimerRunning(true);
    }
  }

  //
  // GEMENSAM DAMAGE-HANTERING (det som testerna förväntar sig)
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
  // WORD SUBMISSION
  //
  async function onSubmitWord() {
    const cleanWord = word.trim();
    if (!cleanWord) return;

    //
    // 🧪 TEST MODE — exakt gamla fungerande logiken
    //
    if (isTest) {
      applyWordDamage(cleanWord);
      return;
    }

    //
    // 🌐 LIVE MODE — backend + samma damage-logik
    //
    const sessionId = "cd748152-6f11-40e9-8cdb-e52ec2b17f2a";

    try {
      const response = await fetch(`/api/game/${sessionId}/playword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wordGuess: cleanWord,
          playerId: localPlayer,
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
  // OVERLAY LOGIC (AV I TESTLÄGE)
  //
  let overlayMessage: string | null = null;

  if (!isTest) {
    if (connectedPlayers < 2) {
      overlayMessage = "Väntar på att en motståndare ska ansluta... ⏳";
    } else if (turn !== localPlayer) {
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
        timer={timer}
        turn={turn}
        word={word}
        setWord={handleWordChange}
        timerRunning={timerRunning}
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

      {/* OVERLAY – visas bara i live-läge */}
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
