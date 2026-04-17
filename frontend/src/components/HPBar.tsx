interface HPBarProps {
  hp: number;
  color?: "green" | "red";
  width?: number;
}

export default function HPBar({ hp, color = "green", width = 160 }: HPBarProps) {
  const barColor = color === "green" ? "bg-green-500" : "bg-red-500";

  return (
    <div
      className="hp-bar h-4 bg-gray-700 rounded-full overflow-hidden"
      style={{ width, boxSizing: "border-box" }}
    >
      <div
        className={`hp-fill h-full ${barColor} transition-all duration-300`}
        style={{ width: `${hp}%` }}
      />
    </div>
  );
}
