import HPBar from "./HPBar";
import Timer from "./Timer";
import Username from "./Username";
import WordHistory from "./WordHistory";
import WordInput from "./WordInput";

interface Player {
  username: string;
  hp: number;
}

interface WordEntry {
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
  languageIcon?: React.ReactNode; // NY: Tar emot flaggan från PlayGame
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
  languageIcon
}: GameBoardProps) {

  const isTest =
    typeof window !== "undefined" &&
    window.location.search.includes("test");

  const inputDisabled = isTest ? false : turn !== localPlayer;
  const inputActive = isTest ? true : turn === localPlayer;
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
        <h1 className="text-4xl font-extrabold tracking-widest uppercase">
          Word Slayer
        </h1>
      </div>

      {/* NY: SPRÅK-INDIKATOR (FLAGGAN) */}
      {languageIcon && (
        <div className="absolute top-4 right-4 flex items-center justify-center bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700 shadow-lg backdrop-blur-sm z-50 transition-all hover:bg-slate-700">
          {languageIcon}
        </div>
      )}

      {/* WORD HISTORY */}
      <WordHistory words={history} />


      {/* OPPONENT (always top left) */}
      <div
        data-player="opponent"
        data-active={opponent ? turn === (isPlayer1 ? "player2" : "player1") : false}
        className="absolute top-20 left-4 text-left"
      >
        <Username
          name={opponent?.username || "Opponent"}
          isActive={opponent ? turn === (isPlayer1 ? "player2" : "player1") : false}
          align="left"
        />
        <div style={{ width: 160 }}>
          <HPBar hp={opponent?.hp ?? 0} color={opponentColor} width={160} />
        </div>
        <div className="text-sm mt-1" data-testid="opponent-hp">{`${opponent?.hp ?? 0} HP`}</div>
      </div>

      {/* ME (always bottom right) */}
      <div
        data-player="me"
        data-active={me ? turn === localPlayer : false}
        className="absolute bottom-20 right-4 text-right"
      >
        <Username
          name={me?.username || "Me"}
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