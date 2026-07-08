"use client";

import { useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import type { CheckboxProps } from "./types";

export function Checkbox({ checked, onChange, label, hint, disabled, id: propId }: CheckboxProps) {
  const autoId = useId();
  const id = propId ?? autoId;

  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-start gap-2.5"
      style={{ cursor: disabled ? "not-allowed" : "pointer" }}
    >
      <button
        type="button"
        id={id}
        role="checkbox"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative mt-[1px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[4px] border-[1.5px] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600/25 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${checked ? "border-brand-600 bg-brand-600" : "border-slate-300 bg-white"}`}
      >
        <AnimatePresence>
          {checked && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <Check size={11} className="text-white" strokeWidth={3} />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {(label || hint) && (
        <div className="flex flex-col gap-0.5">
          {label && <span className="text-[13px] font-medium text-slate-900">{label}</span>}
          {hint && <span className="text-[12px] text-slate-500">{hint}</span>}
        </div>
      )}
    </label>
  );
}
