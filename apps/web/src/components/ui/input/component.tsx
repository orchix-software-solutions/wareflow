"use client";

import { forwardRef, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { InputProps } from "./types";

/** Text input with label, error (animated), hint, and icon support */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      containerClassName,
      labelClassName,
      id: propId,
      required,
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
            "flex h-11 items-center rounded-[10px] border border-slate-200 bg-white px-3.5 transition-all duration-150 hover:border-slate-300 focus-within:border-brand-600",
            error && "border-red-500 focus-within:border-red-500",
            containerClassName,
          )}
        >
          {leftIcon && (
            <span className="mr-2.5 flex shrink-0 items-center text-slate-500">{leftIcon}</span>
          )}
          <input
            id={id}
            type={type}
            ref={ref}
            required={required}
            aria-invalid={!!error}
            aria-describedby={errorId ?? hintId}
            className={cn(
              "h-full min-w-0 flex-1 bg-transparent text-[14px] text-slate-900 placeholder:text-slate-400 outline-none focus:outline-none focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60",
              className,
            )}
            {...props}
          />
          {rightIcon && (
            <span className="ml-2.5 flex shrink-0 items-center text-slate-500">{rightIcon}</span>
          )}
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
Input.displayName = "Input";
