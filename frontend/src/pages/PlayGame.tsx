import { useState, useEffect, useCallback } from "react";
import { useWebsocket } from "../hooks/useWebsocket";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import GameBoard from "../components/GameBoard";
import DamagePopup from "../components/DamagePopup";
import swedenFlag from "../assets/sweden.png";
import ukFlag from "../assets/uk.png";

type Language = "en" | "sv";
import { useSound } from "../hooks/useSound";


interface BackendGameSession {
  sessionId: string;
  players: { name: string; health: number; }[];
  currentTurn: string;
  language: string;
}

interface TurnChangedDetail {
  nextTurn: "player1" | "player2";
  p1Hp: number;
  p2Hp: number;
}

export default function PlayGame() {
  const { sessionId } = useParams<{ sessionId: string; }>();
  const myName = sessionStorage.getItem("playerName") || "Player 1";
  const isTest = useLocation().search.includes("test");
  const navigate = useNavigate();
  // 1. UI Språk (Hämtas från webläsaren för att översätta texter)
  const savedLang = localStorage.getItem("lang");
  const uiLang: Language = savedLang === "sv" ? "sv" : "en";

  // 2. Ordboksspråk (Hämtas från backend, default är 'eng')
  const [dictLang, setDictLang] = useState("eng");

  const texts = {
    en: {
      fetchError: "Could not fetch game data",
      loadingError: "An error occurred while loading.",
      invalidWord: "Invalid word.",
      serverError: "Could not reach the server.",
      loadingGame: "Loading game...",
      waitingForOpponent: "Waiting for opponent... ⏳",
      opponentThinking: "Opponent is thinking... 🧠",
      winner: "WINS!",
      replay: "Play again",
    },
    sv: {
      fetchError: "Kunde inte hämta speldata",
      loadingError: "Ett fel uppstod vid laddning.",
      invalidWord: "Ogiltigt ord.",
      serverError: "Kunde inte nå servern.",
      loadingGame: "Laddar spel...",
      waitingForOpponent: "Väntar på motståndare... ⏳",
      opponentThinking: "Motståndaren tänker... 🧠",
      winner: "VINNER!",
      replay: "Spela igen",
    }
  };

  const [player1, setPlayer1] = useState({ username: "Player 1", hp: 100 });
  const [player2, setPlayer2] = useState({ username: "Player 2", hp: 100 });
  const [connectedPlayers, setConnectedPlayers] = useState(0);

  const [word, setWord] = useState("");
  const [timer, setTimer] = useState(12);
  const [turn, setTurn] = useState<"player1" | "player2">("player1");
  const [timerRunning, setTimerRunning] = useState(false);

  const [musicMuted, setMusicMuted] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [popups, setPopups] = useState<
    { id: number; amount: number; position: "left" | "right"; }[]
  >([]);
  const [history, setHistory] = useState<
    { id: number; word: string; player: "player1" | "player2"; damage: number; }[]
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
      setTimer(timer);
      setTimerRunning(false);
      setError("");
    },
    []
  );

  const handlePlayerJoined = useCallback(() => {
    setConnectedPlayers((prev) => Math.min(prev + 1, 2));
  }, []);

  useWebsocket(sessionId, myName, handlePlayerJoined, handleTurnChanged);

  useEffect(() => {
    if (!isTest) return;

    const handleTestSignal = (event: Event) => {
      const e = event as CustomEvent<TurnChangedDetail>;
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
        if (!res.ok) throw new Error(texts[uiLang].fetchError);

        const game = (await res.json()) as BackendGameSession;

        // Sätt ORDBOKENS språk från backend!
        if (game.language) {
          setDictLang(game.language);
        }

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
        setError(texts[uiLang].loadingError);
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, [sessionId, uiLang]); // Notera att dependencyn nu är uiLang istället för lang

  useEffect(() => {
    const gameOver = player1.hp <= 0 || player2.hp <= 0;
    const myTurn = turn === localPlayer;

    if (isTest) {
      setTimerRunning(false);
      return;
    }

    if (connectedPlayers < 2 || gameOver) {
      setTimerRunning(false);
      return;
    }

    if (myTurn) {
      setTimerRunning(true);
    } else {
      setTimerRunning(false);
    }
  }, [turn, localPlayer, connectedPlayers, player1.hp, player2.hp, isTest]);

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

  const handleLeaveGame = async () => {
    // 1. Berätta för servern att jag ger upp (HP blir 0)
    fetch(`/api/game/${sessionId}/surrender?playerId=${myName}`, { method: "POST" });

    // 2. För den som ger upp: Skicka hem direkt
    navigate("/");
  };


  function applyWordDamage(cleanWord: string) {
    const damage = cleanWord.length;
    // Eget id behövs för stabil rendering och för att varje ord ska kunna få
    // en separat, deterministisk rörelse i FloatingWordCloud.
    const id = Date.now() + Math.floor(Math.random() * 10000);

    setHistory((prev) => [...prev, { id, word: cleanWord, player: turn, damage }]);

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
        // Här skickar vi dictLang (ordboken) till backend, INTE uiLang
        body: JSON.stringify({ wordGuess: cleanWord, playerId: myName, language: dictLang }),
      });

      if (res.ok) {
        applyWordDamage(cleanWord);
      } else {
        setWord(cleanWord);
        setError(texts[uiLang].invalidWord);
      }
    } catch {
      setWord(cleanWord);
      setError(texts[uiLang].serverError);
    }
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white uppercase">
        {texts[uiLang].loadingGame}
      </div>
    );
  }

  // --- 7. OVERLAY & WINNER LOGIC ---
  let overlayMessage: string | null = null;
  let isGameOver = false;

  if (player1.hp <= 0 || player2.hp <= 0) {
    isGameOver = true;

    // Kolla om någon har exakt -1 (Surrender-flaggan från backend)
    const p1Surrendered = player1.hp === -1;
    const p2Surrendered = player2.hp === -1;

    if (p1Surrendered || p2Surrendered) {
      // Om vi har hamnat här, betyder det att NÅGON gav upp.
      // Eftersom den som gav upp redan har navigerat bort, 
      // är det bara vinnaren som ser detta:
      overlayMessage = "YOU WIN (OPPONENT LEFT)";
    } else {
      // Vanlig vinst/förlust genom att HP nådde 0 via ordskada
      if (player1.hp <= 0) {
        overlayMessage = localPlayer === "player1" ? "YOU LOSE" : "YOU WIN";
      } else {
        overlayMessage = localPlayer === "player2" ? "YOU LOSE" : "YOU WIN";
      }
    }
  } else if (connectedPlayers < 2) {
    overlayMessage = texts[uiLang].waitingForOpponent;
  } else if (turn !== localPlayer) {
    overlayMessage = texts[uiLang].opponentThinking;
  }


  // Använder dictLang för att rita rätt flagga
  const languageIcon = dictLang === "swe"
    ? <img src={swedenFlag} alt="Svensk Ordbok" className="h-6 w-8 object-cover rounded-sm shadow-md" title="Dictionary: Svenska" />
    : <img src={ukFlag} alt="English Dictionary" className="h-6 w-8 object-cover rounded-sm shadow-md" title="Dictionary: English" />;

  // UI:t visar bara lokal spelares ord. Historiken sparar allt som spelas,
  // men visualiseringen filtreras här innan GameBoard renderar den.
  const ownWordHistory = history.filter((entry) => entry.player === localPlayer);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-900">
      {error && (
        <div className="absolute top-10 left-1/2 z-110 -translate-x-1/2 rounded-full bg-red-600 px-6 py-2 font-bold text-white shadow-2xl">
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
        history={ownWordHistory}
        timerRunning={timerRunning}
        lang={uiLang}
        setWord={(v) => {
          setWord(v);
        }}
        onSubmitWord={onSubmitWord}
        languageIcon={languageIcon}
        headerControls={
          <button
            type="button"
            data-testid="music-button"
            onClick={() => setMusicMuted((m) => !m)}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/30 bg-black/60 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-black/75 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 focus:ring-offset-slate-900"
            aria-pressed={musicMuted}
            aria-label={musicMuted ? "Unmute sound" : "Mute sound"}
          >
            {musicMuted ? "Unmute Sound" : "Mute Sound"}
          </button>
        }
        onLeaveGame={handleLeaveGame}
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
                  {texts[uiLang].replay}
                </button>
              ) : (
                // Behåller de gömda utvecklarknapparna (från din HEAD) om du skulle behöva dem i test/debug
                <>
                  {connectedPlayers < 2 && (
                    <button onClick={() => setConnectedPlayers(2)} className="opacity-0 cursor-default">
                    </button>
                  )}
                  {turn !== localPlayer && connectedPlayers === 2 && (
                    <button onClick={() => setTurn(localPlayer)} className="opacity-0 cursor-default">
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