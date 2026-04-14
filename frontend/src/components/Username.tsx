
interface UsernameProps {
  name: string;
  isActive?: boolean; // highlight när det är spelarens tur
  align?: "left" | "right" | "center";
}

export default function Username({ name, isActive = false, align = "left" }: UsernameProps) {
  const alignment =
    align === "left"
      ? "text-left"
      : align === "right"
        ? "text-right"
        : "text-center";

  return (
    <div
      className={`
        text-lg font-bold tracking-wide
        ${alignment}
        ${isActive ? "text-yellow-300 drop-shadow-md" : "text-white opacity-90"}
        transition-all duration-200
      `}
    >
      {name}
    </div>
  );
}
