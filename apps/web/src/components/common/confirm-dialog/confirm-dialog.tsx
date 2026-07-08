"use client";

import { TriangleAlert } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  warning?: string;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "destructive";
  loading?: boolean;
}

/** Confirmation dialog with optional destructive warning block */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  warning,
  onConfirm,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} title={title} description={description}>
      {variant === "destructive" && warning && (
        <div className="mt-1 flex gap-3 rounded-lg border border-[#FCDCDC] bg-[#FEF2F2] px-4 py-3">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#DC3545]" />
          <p className="text-[13px] leading-relaxed text-[#991B1B]">{warning}</p>
        </div>
      )}
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="outline" size="md" onClick={() => onOpenChange(false)} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button
          variant={variant === "destructive" ? "destructive" : "primary"}
          size="md"
          onClick={onConfirm}
          isLoading={loading}
        >
          {confirmLabel}
        </Button>
      </div>
    </Dialog>
  );
}
