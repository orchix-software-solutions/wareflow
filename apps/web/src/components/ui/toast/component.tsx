"use client";

import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { create } from "zustand";
import type { ToastProps, ToastState, ToastVariant } from "./types";

const MAX_TOASTS = 5;
const DEFAULT_DURATION = 5000;

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  addToast: (toast) => {
    const id = crypto.randomUUID();
    const duration = toast.duration ?? DEFAULT_DURATION;

    set((state) => {
      const updated = [...state.toasts, { ...toast, id }];
      return { toasts: updated.slice(-MAX_TOASTS) };
    });

    if (duration > 0) {
      setTimeout(() => get().removeToast(id), duration);
    }
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
  clearToasts: () => set({ toasts: [] }),
}));

const VARIANT_CONFIG: Record<
  ToastVariant,
  { icon: typeof CheckCircle2; border: string; accent: string; color: string }
> = {
  success: {
    icon: CheckCircle2,
    border: "border-[rgba(40,167,69,0.2)]",
    accent: "bg-[#28A745]",
    color: "text-[#28A745]",
  },
  error: {
    icon: XCircle,
    border: "border-[rgba(220,53,69,0.2)]",
    accent: "bg-[#DC3545]",
    color: "text-[#DC3545]",
  },
  warning: {
    icon: AlertTriangle,
    border: "border-[rgba(232,163,23,0.2)]",
    accent: "bg-[#E8A317]",
    color: "text-[#E8A317]",
  },
  info: {
    icon: Info,
    border: "border-[rgba(43,123,191,0.2)]",
    accent: "bg-[#2B7BBF]",
    color: "text-[#2B7BBF]",
  },
};

function ToastItem({ id, title, description, variant = "info", dismissible = true }: ToastProps) {
  const removeToast = useToastStore((s) => s.removeToast);
  const config = VARIANT_CONFIG[variant];
  const Icon = config.icon;

  return (
    <motion.div
      layout
      role="alert"
      aria-live={variant === "error" || variant === "warning" ? "assertive" : "polite"}
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 80 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`pointer-events-auto flex w-full max-w-[400px] overflow-hidden rounded-xl border bg-white shadow-lg ${config.border}`}
    >
      <div className={`w-1 shrink-0 rounded-l-xl ${config.accent}`} />
      <div className="flex flex-1 items-start gap-3 px-4 py-3.5">
        <Icon size={20} className={`mt-0.5 shrink-0 ${config.color}`} />
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold leading-snug text-[#0F172A]">{title}</p>
          {description && (
            <p className="mt-0.5 text-[13px] font-normal leading-relaxed text-[#64748B]">
              {description}
            </p>
          )}
        </div>
        {dismissible && (
          <button
            type="button"
            onClick={() => removeToast(id)}
            className="shrink-0 text-[#94A3B8] transition-colors hover:text-[#0F172A]"
            aria-label="Dismiss notification"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </motion.div>
  );
}

function ToastPortal({ children }: { children: React.ReactNode }) {
  if (typeof document === "undefined") return null;
  return createPortal(children, document.body);
}

/** Toast container rendered at the top-right of the viewport. */
export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const removeToast = useToastStore((s) => s.removeToast);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && toasts.length > 0) {
        const last = toasts[toasts.length - 1];
        if (last) removeToast(last.id);
      }
    },
    [toasts, removeToast],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <ToastPortal>
      <div className="fixed right-6 top-6 z-[9999] flex flex-col gap-2">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <ToastItem key={toast.id} {...toast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastPortal>
  );
}
