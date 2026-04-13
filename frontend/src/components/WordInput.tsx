import React from "react";

interface WordInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled: boolean;
  isActive: boolean;
}

export default function WordInput({
  value,
  onChange,
  onSubmit,
  disabled,
  isActive
}: WordInputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={
        isActive ? "Type your word..." : "Waiting for opponent..."
      }
      className={`
        w-full px-4 py-3 rounded-xl text-black text-lg
        transition-all duration-200
        ${disabled ? "opacity-50 cursor-not-allowed" : "opacity-100"}
        ${isActive ? "ring-2 ring-yellow-300" : ""}
      `}
      disabled={disabled}
      onKeyDown={(e) => e.key === "Enter" && onSubmit()}
    />
  );
}
