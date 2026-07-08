"use client";

import { useId } from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SelectProps } from "./types";

/** Dropdown select with label, error (animated), hint, and checkmark indicator */
export function Select({
  options,
  value,
  onValueChange,
  placeholder = "Select...",
  disabled,
  error,
  label,
  hint,
  required,
  className,
}: SelectProps) {
  const autoId = useId();
  const errorId = error ? `${autoId}-error` : undefined;
  const hintId = hint && !error ? `${autoId}-hint` : undefined;

  return (
    <div className="w-full">
      {label && (
        <label className="mb-1.5 block text-[13px] font-medium text-[#0F172A]">
          {label}
          {required && <span className="ml-0.5 text-[#DC3545]">*</span>}
        </label>
      )}
      <SelectPrimitive.Root value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectPrimitive.Trigger
          aria-invalid={!!error}
          aria-describedby={errorId ?? hintId}
          className={cn(
            "flex h-11 w-full items-center justify-between rounded-[10px] border border-[#E2E8F0] bg-white px-3.5 text-[14px] text-[#0F172A] transition-all duration-150 hover:border-[#CBD5E1] focus:border-[#2563EB] focus:outline-none focus:ring-[3px] focus:ring-[rgba(37,99,235,0.12)] disabled:cursor-not-allowed disabled:bg-[#F8FAFC] disabled:opacity-60 data-[placeholder]:text-[#94A3B8]",
            error && "border-[#DC3545] focus:border-[#DC3545] focus:ring-[rgba(220,53,69,0.1)]",
            className,
          )}
        >
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon asChild>
            <ChevronDown className="h-4 w-4 shrink-0 text-[#64748B] transition-transform duration-200 data-[state=open]:rotate-180" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className="z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-[10px] border border-[#E2E8F0] bg-white shadow-[0_4px_16px_rgba(45,42,38,0.08)]"
            position="popper"
            sideOffset={4}
          >
            <SelectPrimitive.Viewport className="max-h-60 p-1">
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className="relative flex h-10 cursor-pointer select-none items-center rounded-lg px-3.5 pr-9 text-[14px] text-[#0F172A] outline-none hover:bg-[#F8FAFC] focus:bg-[#F8FAFC] data-[state=checked]:bg-[#F1F5F9] data-[state=checked]:text-[#2563EB] data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                >
                  <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator className="absolute right-3">
                    <Check className="h-4 w-4 text-[#2563EB]" />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            id={errorId}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="mt-1 text-[12px] text-[#DC3545]"
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
            className="mt-1 text-[12px] text-[#64748B]"
          >
            {hint}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
