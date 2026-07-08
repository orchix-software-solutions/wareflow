"use client";

import { useRef, KeyboardEvent, ClipboardEvent } from "react";
import { cn } from "@/lib/utils";
import type { OtpInputProps } from "./types";

export function OtpInput({ length = 6, value, onChange, disabled, error, label }: OtpInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.replace(/\D/g, "").split("").concat(Array(length).fill("")).slice(0, length);

  const update = (index: number, char: string) => {
    const next = [...digits];
    next[index] = char;
    onChange(next.join(""));
    if (char && index < length - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (digits[index]) {
        update(index, "");
      } else if (index > 0) {
        refs.current[index - 1]?.focus();
        update(index - 1, "");
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      refs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      e.preventDefault();
      refs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    const padded = pasted.padEnd(length, "").slice(0, length);
    onChange(padded);
    const focusIndex = Math.min(pasted.length, length - 1);
    refs.current[focusIndex]?.focus();
  };

  return (
    <div className="flex flex-col gap-2">
      {label && <span className="block text-[13px] font-medium text-slate-900">{label}</span>}
      <div className="flex gap-2 sm:gap-3">
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            disabled={disabled}
            onPaste={handlePaste}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "");
              if (val) update(i, val[val.length - 1]!);
            }}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onFocus={(e) => e.target.select()}
            className={cn(
              "h-12 w-10 flex-1 rounded-[10px] border border-slate-200 bg-white text-center text-lg font-semibold text-slate-900 outline-none transition-all duration-150 hover:border-slate-300 focus:border-brand-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-12",
              error && "border-red-500 focus:border-red-500",
            )}
          />
        ))}
      </div>
      {error && <p className="text-[12px] text-red-500">{error}</p>}
    </div>
  );
}
