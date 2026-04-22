interface WordInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled: boolean;
  isActive: boolean;
  isTimerRunning: boolean;
}


type Language = "en" | "sv";

export default function WordInput({
  value,
  onChange,
  onSubmit,
  disabled,
  isActive,
  isTimerRunning
}: WordInputProps) {

  const isTest =
    typeof window !== "undefined" &&
    window.location.search.includes("test");
  
  const savedLang = localStorage.getItem("lang");
  const lang: Language = savedLang === "sv" ? "sv" : "en";

  const texts = {
    en: {
      activePlaceholder: "Type your word...",
      waitingPlaceholder: "Waiting for opponent..."
    },
    sv: {
      activePlaceholder: "Skriv ditt ord...",
      waitingPlaceholder: "Väntar på motståndare..."
    }
  };

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") return;

    // TEST MODE: prevent double submit
    if (isTest) {
      e.preventDefault();
      e.stopPropagation();
      onSubmit();
      return;
    }

    // LIVE MODE
    if (!disabled && isActive && isTimerRunning) {
      onSubmit();
    }
  }

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={
        isActive
          ? texts[lang].activePlaceholder
          : texts[lang].waitingPlaceholder
      }
      className={`
        w-full px-4 py-3 rounded-xl text-white text-lg
        transition-all duration-200

        ${disabled ? "opacity-50 cursor-not-allowed" : "opacity-100"}
        ${isActive ? "ring-2 ring-yellow-300" : ""}
        ${isTimerRunning ? "animate-pulse ring-2 ring-green-400" : ""}
      `}
      disabled={disabled}
      onKeyDown={handleKeyDown}
    />
  );
}
