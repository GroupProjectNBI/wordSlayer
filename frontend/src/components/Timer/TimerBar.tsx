interface TimerBarProps {
  ratio: number; // 0–1
  state: "normal" | "warning" | "danger";
}

export default function TimerBar({ ratio, state }: TimerBarProps) {
  return (
    <div className="timer-bar-wrapper">
      <div
        className={`timer-bar-fill timer-${state}`}
        style={{ width: `${ratio * 100}%` }}
      />
    </div>
  );
}