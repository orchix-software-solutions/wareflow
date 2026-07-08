"use client";

import { X, CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";
import { toast as sonnerToast } from "sonner";
import type { ToastVariant } from "./types";

export interface WareFlowToastProps {
  id: string | number;
  variant: ToastVariant;
  title: string;
  description: string;
}

const CONFIG: Record<
  ToastVariant,
  { Icon: React.ElementType; accent: string; iconColor: string; border: string }
> = {
  success: {
    Icon: CheckCircle2,
    accent: "bg-emerald-500",
    iconColor: "text-emerald-600",
    border: "border-emerald-100",
  },
  error: {
    Icon: XCircle,
    accent: "bg-red-500",
    iconColor: "text-red-500",
    border: "border-red-100",
  },
  warning: {
    Icon: AlertTriangle,
    accent: "bg-amber-400",
    iconColor: "text-amber-500",
    border: "border-amber-100",
  },
  info: {
    Icon: Info,
    accent: "bg-brand-600",
    iconColor: "text-brand-600",
    border: "border-brand-100",
  },
};

export function WareFlowToast({ id, variant, title, description }: WareFlowToastProps) {
  const { Icon, accent, iconColor, border } = CONFIG[variant];

  return (
    <div
      className={`pointer-events-auto flex w-[380px] max-w-[calc(100vw-48px)] overflow-hidden rounded-xl border bg-white shadow-[0_4px_24px_rgba(0,0,0,0.10)] ${border}`}
    >
      <div className={`w-1 shrink-0 rounded-l-xl ${accent}`} />
      <div className="flex flex-1 items-start gap-3 px-4 py-3.5">
        <Icon size={18} className={`mt-0.5 shrink-0 ${iconColor}`} />
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-semibold leading-snug text-slate-900">{title}</p>
          <p className="mt-0.5 text-[13px] leading-relaxed text-slate-500">{description}</p>
        </div>
        <button
          type="button"
          onClick={() => sonnerToast.dismiss(id)}
          className="mt-0.5 shrink-0 text-slate-300 transition-colors hover:text-slate-600"
          aria-label="Dismiss notification"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
