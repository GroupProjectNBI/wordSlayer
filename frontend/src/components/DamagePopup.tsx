import { useEffect, useState } from "react";

interface DamagePopupProps {
  amount: number;
  position: "left" | "right"; // vilken spelare som tog skada
  onComplete?: () => void;    // callback när animationen är klar
}

export default function DamagePopup({ amount, position, onComplete }: DamagePopupProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onComplete?.(), 300); // låt fade-out avslutas
    }, 900);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`
        pointer-events-none
        absolute 
        text-4xl font-extrabold 
        transition-all duration-300 
        ${visible ? "opacity-100 -translate-y-2" : "opacity-0 -translate-y-10"}
        ${position === "left" ? "left-10 top-32 text-red-400" : "right-10 bottom-32 text-red-400"}
      `}
    >
      -{amount}
    </div>
  );
}
