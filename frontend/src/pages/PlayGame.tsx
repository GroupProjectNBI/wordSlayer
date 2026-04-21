import { useState, useEffect, useCallback } from "react";
import { useWebsocket } from "../hooks/useWebsocket";
import { useParams, useLocation } from "react-router-dom";
import GameBoard from "../components/GameBoard";
import DamagePopup from "../components/DamagePopup";
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

  const [player1, setPlayer1] = useState({ username: "Player 1", hp: 100 });
  const [player2, setPlayer2] = useState({ username: "Player 2", hp: 100 });
  const [connectedPlayers, setConnectedPlayers] = useState(0);

  const [word, setWord] = useState("");
  const [timer, setTimer] = useState(30);
  const [turn, setTurn] = useState<"player1" | "player2">("player1");
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

  // GAME MUSIC
  const gameMusic = useSound("/sounds/game-music.mp3", { loop: true });

  // Auto-play when both players are connected
  useEffect(() => {
    if (isTest) return; //no music in test mode
    if (connectedPlayers === 2 && !musicMuted) {
      gameMusic.play();
    } else {
      gameMusic.stop();
    }
  }, [connectedPlayers, musicMuted, isTest]);

  // Stop music on unmount
  useEffect(() => {
    return () => {
      gameMusic.stop();
    };
  }, []);

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

  const handlePlayerJoined = useCallback((_playerName: string) => {
    setConnectedPlayers((prev) => Math.min(prev + 1, 2));
  }, []);

  useWebsocket(sessionId, myName, handlePlayerJoined, handleTurnChanged);

  useEffect(() => {
    if (!isTest) return;

    const handleTestSignal = (e: any) => {
      const { nextTurn, p1Hp, p2Hp } = e.detail;
      handleTurnChanged(nextTurn, p1Hp, p2Hp);
    };

    window.addEventListener("signalr-turn-changed", handleTestSignal);
    return () =>
      window.removeEventListener("signalr-turn-changed", handleTestSignal);
  }, [isTest, handleTurnChanged]);

  useEffect(() => {
    async function loadInitialData() {
      if (!sessionId) return;

      setLoading(true);
      try {
        const res = await fetch(`/api/game/${sessionId}`);
        if (!res.ok) throw new Error("Could not fetch game data");

        const game = (await res.json()) as BackendGameSession;

        setConnectedPlayers(game.players.length);

        if (game.players[0]) {
          setPlayer1({
            username: game.players[0].name,
            hp: game.players[0].health,
          });
        }

        if (game.players[1]) {
          setPlayer2({
            username: game.players[1].name,
            hp: game.players[1].health,
          });
        }

        if (game.currentTurn) {
          setTurn(game.currentTurn.toLowerCase() as "player1" | "player2");
        }
      } catch {
        setError("An error occured while loading.");
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, [sessionId]);

  useEffect(() => {
    if (!timerRunning || isTest || turn !== localPlayer) return;

    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          fetch(`/api/game/${sessionId}/timeout?playerId=${myName}`, {
            method: "POST",
          }).catch(console.error);
          setTimerRunning(false);
          return 30;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerRunning, turn, localPlayer, sessionId, myName, isTest]);

  function applyWordDamage(cleanWord: string) {
    const damage = cleanWord.length;

    setHistory((prev) => [...prev, { word: cleanWord, player: turn, damage }]);

    const target = turn === "player1" ? "right" : "left";
    setPopups((prev) => [
      ...prev,
      { id: Date.now(), amount: damage, position: target },
    ]);

    if (isTest) {
      setTurn((prev) => (prev === "player1" ? "player2" : "player1"));
    }

    setWord("");
  }

  async function onSubmitWord() {
    const cleanWord = word.trim();
    if (!cleanWord || !sessionId) return;

    setWord("");

    try {
      const res = await fetch(`/api/game/${sessionId}/playword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wordGuess: cleanWord, playerId: myName }),
      });

      if (res.ok) {
        applyWordDamage(cleanWord);
      } else {
        setWord(cleanWord);
        setError("Invalid word.");
      }
    } catch {
      setWord(cleanWord);
      setError("Could not reach the server.");
    }
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white uppercase">
        Loading game...
      </div>
    );
  }

  let overlayMessage: string | null = null;
  let isGameOver = false;

  if (player1.hp <= 0) {
    overlayMessage = `🏆 ${player2.username} VINNER! 🏆`;
    isGameOver = true;
  } else if (player2.hp <= 0) {
    overlayMessage = `🏆 ${player1.username} VINNER! 🏆`;
    isGameOver = true;
  } else if (connectedPlayers < 2) {
    overlayMessage = "Väntar på att en motståndare ska ansluta... ⏳";
  } else if (turn !== localPlayer) {
    overlayMessage = "Motståndaren tänker... 🧠";
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-900">

      {/* MUTE MUSIC BUTTON */}
      {!isTest && (
        <button
          onClick={() => setMusicMuted((m) => !m)}
          className="absolute bottom-4 left-4 z-[300] bg-black/60 text-white px-4 py-2 rounded border border-white"
        >
          {musicMuted ? "Unmute Mucis" : "mute Music"}
        </button>
      )}
      {error && (
        <div className="absolute top-10 left-1/2 z-[110] -translate-x-1/2 rounded-full bg-red-600 px-6 py-2 font-bold text-white shadow-2xl">
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
            backgroundColor: isGameOver
              ? "rgba(88, 28, 135, 0.95)"
              : "rgba(0,0,0,0.7)",
            backdropFilter: "blur(4px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 100,
            color: "white",
            fontSize: isGameOver ? "2.5rem" : "2rem",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          <div
            style={{
              padding: isGameOver ? "20px" : undefined,
              borderRadius: isGameOver ? "20px" : undefined,
              border: isGameOver ? "5px solid gold" : undefined,
            }}
          >
            <p data-testid="winner-message">{overlayMessage}</p>

            <div
              style={{
                marginTop: 20,
                display: "flex",
                gap: 10,
                justifyContent: "center",
              }}
            >
              {isGameOver ? (
                <button
                  onClick={() => (window.location.href = "/")}
                  style={{
                    padding: "10px 20px",
                    fontSize: "1.2rem",
                    cursor: "pointer",
                    backgroundColor: "#9333ea",
                    border: "none",
                    color: "white",
                    borderRadius: "10px",
                  }}
                >
                  Spela igen
                </button>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}