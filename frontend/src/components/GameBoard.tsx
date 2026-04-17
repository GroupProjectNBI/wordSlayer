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
  localPlayer: "player1" | "player2"; // NY: Berättar vem JAG är
  word: string;
  setWord: (value: string) => void;
  onSubmitWord: () => void;
  history: WordEntry[];
  timerRunning: boolean;
  children?: React.ReactNode;
}

export default function GameBoard({
  player1,
  player2,
  timer,
  turn,
  localPlayer, // Ta emot den här
  word,
  setWord,
  onSubmitWord,
  history,
  timerRunning,
  children
}: GameBoardProps) {

  const isTest =
    typeof window !== "undefined" &&
    window.location.search.includes("test");

  // ÄNDRING: Jämför turn med localPlayer istället för hårdkodat "player1"
  const inputDisabled = isTest ? false : turn !== localPlayer;
  const inputActive = isTest ? true : turn === localPlayer;
  const timerIsRunning = isTest ? true : timerRunning;

  return (
    <main className="min-h-screen bg-[#1a1a2e] text-white relative overflow-hidden">
      {/* TITLE */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center">
        <h1 className="text-4xl font-extrabold tracking-widest uppercase">
          Word Slayer
        </h1>
      </div>

      {/* WORD HISTORY */}
      <WordHistory words={history} />

      {/* PLAYER 1 */}
      <div
        data-player="player1"
        data-active={turn === "player1"}
        className="absolute top-20 left-4 text-left"
      >
        <Username
          name={player1.username}
          isActive={turn === "player1"}
          align="left"
        />
        <div style={{ width: 160 }}>
          <HPBar hp={player1.hp} color="green" width={160} />
        </div>
        <div className="text-sm mt-1">{player1.hp} HP</div>
      </div>

      {/* PLAYER 2 */}
      {player2 ? (
        <div
          data-player="player2"
          data-active={turn === "player2"}
          className="absolute bottom-20 right-4 text-right"
        >
          <Username
            name={player2.username}
            isActive={turn === "player2"}
            align="right"
          />
          <div style={{ width: 160 }}>
            <HPBar hp={player2.hp} color="red" width={160} />
          </div>
          <div className="text-sm mt-1">{player2.hp} HP</div>
        </div>
      ) : null}

      {/* CENTER VS + TIMER */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
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