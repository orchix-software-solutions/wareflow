"use client";

import { forwardRef, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { TextareaProps } from "./types";

/** Textarea with label, error (animated), and hint support — mirrors Input's visual style */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      hint,
      containerClassName,
      labelClassName,
      id: propId,
      required,
      rows = 4,
      ...props
    },
    ref,
  ) => {
    const autoId = useId();
    const id = propId ?? autoId;
    const errorId = error ? `${id}-error` : undefined;
    const hintId = hint && !error ? `${id}-hint` : undefined;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className={cn("mb-1.5 block text-[13px] font-medium text-slate-900", labelClassName)}
          >
            {label}
            {required && <span className="ml-0.5 text-red-500">*</span>}
          </label>
        )}
        <div
          className={cn(
            "flex rounded-[10px] border border-slate-200 bg-white px-3.5 py-2.5 transition-all duration-150 hover:border-slate-300 focus-within:border-brand-600",
            error && "border-red-500 focus-within:border-red-500",
            containerClassName,
          )}
        >
          <textarea
            id={id}
            ref={ref}
            required={required}
            rows={rows}
            aria-invalid={!!error}
            aria-describedby={errorId ?? hintId}
            className={cn(
              "min-w-0 flex-1 resize-none bg-transparent text-[14px] text-slate-900 placeholder:text-slate-400 outline-none focus:outline-none focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60",
              className,
            )}
            {...props}
          />
        </div>
        <AnimatePresence mode="wait">
          {error && (
            <motion.p
              id={errorId}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="mt-1 text-[12px] text-red-500"
            >
              {error}
            </motion.p>
          )}
          {hint && !error && (
            <motion.p
              id={hintId}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15 }}
              className="mt-1 text-[12px] text-slate-500"
            >
              {hint}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  },
);
Textarea.displayName = "Textarea";
