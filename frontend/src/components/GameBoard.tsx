import HPBar from "./HPBar";
import FloatingWordCloud from "./FloatingWordCloud";
import Timer from "./Timer/Timer";
import Username from "./Username";
import WordInput from "./WordInput";

type Language = "en" | "sv";

interface Player {
  username: string;
  hp: number;
}

interface WordEntry {
  id: number;
  word: string;
  player: "player1" | "player2";
  damage: number;
}

interface GameBoardProps {
  player1: Player;
  player2?: Player;
  timer: number;
  turn: "player1" | "player2";
  localPlayer: "player1" | "player2";
  word: string;
  setWord: (value: string) => void;
  onSubmitWord: () => void;
  history: WordEntry[];
  timerRunning: boolean;
  children?: React.ReactNode;
  languageIcon?: React.ReactNode;
  onLeaveGame: () => void;
  lang: Language; // Tillagd prop för UI-språk
}

export default function GameBoard({
  player1,
  player2,
  timer,
  turn,
  localPlayer,
  word,
  setWord,
  onSubmitWord,
  history,
  timerRunning,
  children,
  languageIcon,
  onLeaveGame,
  lang,
}: GameBoardProps) {

  const isTest =
    typeof window !== "undefined" &&
    window.location.search.includes("test");

  // Ordbok för GameBoard-specifika texter
  const texts = {
    en: {
      surrenderBtn: "Surrender",
      surrenderConfirm: "Are you sure you want to surrender?",
      opponent: "Opponent",
      me: "Me"
    },
    sv: {
      surrenderBtn: "Ge upp",
      surrenderConfirm: "Är du säker på att du vill ge upp?",
      opponent: "Motståndare",
      me: "Jag"
    }
  };

  // --- LOGIK FÖR ATT LÅSA INPUT VID GAME OVER (Viktigt för Playwright) ---
  // Vi kollar om någon spelare har 0 eller mindre HP
  const isGameOver = (player1.hp <= 0) || (player2 ? player2.hp <= 0 : false);
  // Om det är test-läge (Playwright), låt isGameOver styra helt. 
  // Annars (Live) lås om det inte är din tur ELLER om spelet är slut.
  const inputDisabled = isTest ? isGameOver : (turn !== localPlayer || isGameOver);
  const inputActive = isTest ? !isGameOver : (turn === localPlayer && !isGameOver);
  const timerIsRunning = isTest ? true : timerRunning;
  // Determine which player is "me" and which is "opponent" for layout
  const isPlayer1 = localPlayer === "player1";
  // Always assign 'me' and 'opponent' for perspective
  const me = isPlayer1 ? player1 : player2;
  const opponent = isPlayer1 ? player2 : player1;
  const meColor = isPlayer1 ? "green" : "red";
  const opponentColor = isPlayer1 ? "red" : "green";

  return (
    <main className="min-h-screen bg-[#1a1a2e] text-white relative overflow-hidden">
      {/* TITLE */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center">
        <h1 className="text-4xl font-extrabold tracking-widest uppercase text-slate-200">
          Word Slayer
        </h1>
      </div>

      {/* SURRENDER BUTTON */}
      <div className="absolute top-4 left-4 z-50">
        <button
          data-testid="surrender-button"
          onClick={() => {
            if (window.confirm(texts[lang].surrenderConfirm)) {
              onLeaveGame();
            }
          }}
          className="flex items-center gap-2 bg-red-900/40 hover:bg-red-800/60 text-red-200 px-4 py-2 rounded-xl border border-red-700/50 transition-all backdrop-blur-sm group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 group-hover:-translate-x-1 transition-transform"
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="font-semibold text-sm uppercase tracking-wider">
            {texts[lang].surrenderBtn}
          </span>
        </button>
      </div>

      {/* LANGUAGE INDICATOR */}
      {languageIcon && (
        <div className="absolute top-4 right-4 flex items-center justify-center bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700 shadow-lg backdrop-blur-sm z-50 transition-all hover:bg-slate-700">
          {languageIcon}
        </div>
      )}

      <FloatingWordCloud words={history} />

      {/* OPPONENT */}
      <div
        data-player="opponent"
        className="absolute top-20 left-4 text-left"
      >
        <Username
          name={opponent?.username || texts[lang].opponent}
          isActive={opponent ? turn === (isPlayer1 ? "player2" : "player1") : false}
          align="left"
        />
        <div style={{ width: 160 }}>
          <HPBar hp={opponent?.hp ?? 0} color={opponentColor} width={160} />
        </div>
        <div className="text-sm mt-1" data-testid="opponent-hp">{`${opponent?.hp ?? 0} HP`}</div>
      </div>

      {/* ME */}
      <div
        data-player="me"
        className="absolute bottom-20 right-4 text-right"
      >
        <Username
          name={me?.username || texts[lang].me}
          isActive={me ? turn === localPlayer : false}
          align="right"
        />
        <div style={{ width: 160 }}>
          <HPBar hp={me?.hp ?? 0} color={meColor} width={160} />
        </div>
        <div className="text-sm mt-1" data-testid="me-hp">{`${me?.hp ?? 0} HP`}</div>
      </div>

      {/* CENTER VS + TIMER */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div data-testid="turn-indicator" className="mb-2 text-lg font-bold">
          {turn === "player1" ? "Player 1" : "Player 2"}
        </div>
        <h1 className="text-7xl font-extrabold tracking-widest opacity-80">
          VS
        </h1>
        <div className="mt-4">
          <Timer value={timer} />
        </div>
      </div>

      {/* WORD INPUT */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-md px-4">
        <WordInput
          value={word}
          onChange={setWord}
          onSubmit={onSubmitWord}
          disabled={inputDisabled}
          isActive={inputActive}
          isTimerRunning={timerIsRunning}
        />
      </div>

      {/* DAMAGE POPUPS */}
      {children}
    </main>
  );
}