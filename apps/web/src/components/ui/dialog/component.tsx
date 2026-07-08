"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { DialogProps } from "./types";

/** Modal dialog centered horizontally and vertically */
export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  fullscreen,
}: DialogProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-50 bg-black/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              />
            </DialogPrimitive.Overlay>

            {/* Content: fullscreen flex container handles centering */}
            <DialogPrimitive.Content
              className={cn(
                "fixed inset-0 z-50 flex items-center justify-center p-4 data-[state=closed]:pointer-events-none",
                fullscreen && "p-0",
              )}
              onInteractOutside={(e) => e.preventDefault()}
            >
              <motion.div
                className={cn(
                  "w-full bg-white shadow-xl focus:outline-none",
                  fullscreen
                    ? "h-full rounded-none border-0"
                    : "max-w-lg rounded-xl border border-[#E2E8F0] p-6",
                )}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <div className={cn("flex flex-col gap-4", fullscreen && "h-full p-6")}>
                  <div className="flex items-start justify-between">
                    <div>
                      <DialogPrimitive.Title className="text-lg font-semibold text-[#0F172A]">
                        {title}
                      </DialogPrimitive.Title>
                      <DialogPrimitive.Description className="mt-1 text-sm text-[#64748B]">
                        {description}
                      </DialogPrimitive.Description>
                    </div>
                    <DialogPrimitive.Close className="rounded-md p-1 text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]">
                      <X className="h-4 w-4" />
                    </DialogPrimitive.Close>
                  </div>
                  <div className={cn(fullscreen && "flex-1 overflow-y-auto")}>{children}</div>
                </div>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}
