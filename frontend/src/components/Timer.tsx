

interface TimerProps {
  value: number; // antal sekunder kvar
}

export default function Timer({ value }: TimerProps) {
  // färg baserat på tid
  const color =
    value > 10
      ? "text-yellow-400"
      : value > 5
        ? "text-orange-400"
        : "text-red-500";

  // blink-animation när tiden är kritiskt låg
  const blink = value <= 5 ? "animate-pulse" : "";

  return (
    <div className={`text-3xl font-bold ${color} ${blink}`}>
      {value}s
    </div>
  );
}
