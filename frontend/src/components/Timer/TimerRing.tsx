interface TimerRingProps {
  ratio: number; // 0–1
  state: "normal" | "warning" | "danger";
}

export default function TimerRing({ ratio, state }: TimerRingProps) {
  const circumference = 2 * Math.PI * 45; // r = 45
  const offset = circumference * (1 - ratio);

  return (
    <svg className="timer-ring" width="120" height="120">
      <circle
        className="timer-ring-bg"
        cx="60"
        cy="60"
        r="45"
      />
      <circle
        className={`timer-ring-progress timer-${state}`}
        cx="60"
        cy="60"
        r="45"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
    </svg>
  );
}
