interface HPBarProps {
  hp: number;               // 0–100
  color?: "green" | "red";  // färgtema
  width?: number;           // px-bredd (default 160)
}

export default function HPBar({ hp, color = "green", width = 160 }: HPBarProps) {
  const barColor =
    color === "green"
      ? "bg-green-500"
      : "bg-red-500";

  return (
    <div
      className="hp-bar h-4 bg-gray-700 rounded-full overflow-hidden"
      style={{ width }}
    >
      <div
        className={`hp-fill h-full ${barColor} rounded-full transition-all duration-300`}
        style={{ width: `${hp}%` }}
      />
    </div>
  );
}
