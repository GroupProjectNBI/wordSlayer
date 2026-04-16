interface WordInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled: boolean;        // styrs av cooldown + timer
  isActive: boolean;        // styrs av turn
  isTimerRunning: boolean;  // styrs av premium-timer
}

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

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") return;

    // TEST MODE — exakt och stabilt
    if (isTest) {
      e.preventDefault();
      e.stopPropagation();
      onSubmit();
      return;
    }

    // LIVE MODE — premium logik
    if (!disabled && isActive && isTimerRunning) {
      onSubmit();
    }
  }

  //
  // PREMIUM PLACEHOLDER LOGIK
  //
  let placeholder = "Type your word...";

  if (disabled && !isTest) {
    placeholder = "Cooldown...";
  } else if (!isActive && !isTest) {
    placeholder = "Opponent's turn...";
  }

  //
  // PREMIUM UI STATES
  //
  const baseClasses = `
    w-full px-4 py-3 rounded-xl text-white text-lg
    transition-all duration-200 outline-none
  `;

  const disabledClasses = disabled
    ? "opacity-40 cursor-not-allowed"
    : "opacity-100";

  const activeClasses = isActive && !disabled
    ? "ring-2 ring-yellow-300"
    : "";

  const runningClasses = isTimerRunning && !disabled
    ? "animate-pulse ring-2 ring-green-400"
    : "";

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`${baseClasses} ${disabledClasses} ${activeClasses} ${runningClasses}`}
      disabled={disabled}
      onKeyDown={handleKeyDown}
    />
  );
}
