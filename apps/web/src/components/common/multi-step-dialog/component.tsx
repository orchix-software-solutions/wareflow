"use client";

import { ResponsiveDialog } from "@/components/common/responsive-dialog";
import type { MultiStepDialogProps } from "./types";
import { motion } from "framer-motion";

function StepProgress({ total, current }: { total: number; current: number }) {
  const pct = total <= 1 ? 100 : Math.round(((current + 1) / total) * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[#E2E8F0]">
        <motion.div
          className="h-full rounded-full bg-[#2563EB]"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
        />
      </div>
      <span className="text-[11px] tabular-nums text-[#64748B]">
        {current + 1}/{total}
      </span>
    </div>
  );
}

export function MultiStepDialog({
  open,
  onOpenChange,
  steps,
  currentStep,
  children,
  className,
  subSteps,
  currentSubStep,
}: MultiStepDialogProps) {
  const step = steps[currentStep]!;
  const total = subSteps ?? steps.length;
  const progressCurrent = subSteps !== undefined ? (currentSubStep ?? 0) : currentStep;

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={step.title}
      description={step.description ?? ""}
      className={className}
      footer={
        step.footer !== null ? (
          <div className="flex w-full items-center justify-between gap-4">
            <StepProgress total={total} current={progressCurrent} />
            <div className="flex flex-1 items-center justify-end gap-3">{step.footer}</div>
          </div>
        ) : undefined
      }
    >
      {open && children}
    </ResponsiveDialog>
  );
}
