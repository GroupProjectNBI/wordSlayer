import TimerBar from "./TimerBar";
import TimerRing from "./TimerRing";
import "./timer.css";

interface TimerProps {
  value: number;
  max?: number;
}

export default function Timer({ value, max = 30 }: TimerProps) {
  const ratio = value / max;

  const state =
    value > 10 ? "normal"
      : value > 5 ? "warning"
        : "danger";

  return (
    <div className={`timer-container timer-${state}`}>
      <TimerRing ratio={ratio} state={state} />
      <TimerBar ratio={ratio} state={state} />
      <div className="timer-text">{value}s</div>
    </div>
  );
}