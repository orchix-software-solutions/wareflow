"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SheetProps } from "./types";

const SIDE_VARIANTS = {
  left: {
    initial: { x: "-100%" },
    animate: { x: 0 },
    exit: { x: "-100%" },
    className: "inset-y-0 left-0 w-3/4 max-w-sm border-r",
  },
  right: {
    initial: { x: "100%" },
    animate: { x: 0 },
    exit: { x: "100%" },
    className: "inset-y-0 right-0 w-3/4 max-w-sm border-l",
  },
  top: {
    initial: { y: "-100%" },
    animate: { y: 0 },
    exit: { y: "-100%" },
    className: "inset-x-0 top-0 border-b",
  },
  bottom: {
    initial: { y: "100%" },
    animate: { y: 0 },
    exit: { y: "100%" },
    className: "inset-x-0 bottom-0 border-t",
  },
};

/** Slide-out sheet panel using Radix Dialog */
export function Sheet({
  open,
  onOpenChange,
  title,
  description,
  children,
  side = "right",
}: SheetProps) {
  const sideConfig = SIDE_VARIANTS[side];

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-50 bg-black/60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              />
            </DialogPrimitive.Overlay>
            <DialogPrimitive.Content asChild>
              <motion.div
                className={cn(
                  "fixed z-50 flex flex-col border-charcoal-300 bg-charcoal-100 shadow-lg focus:outline-none",
                  sideConfig.className,
                )}
                initial={sideConfig.initial}
                animate={sideConfig.animate}
                exit={sideConfig.exit}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className="flex items-start justify-between border-b border-charcoal-300 p-4">
                  <div>
                    <DialogPrimitive.Title className="text-lg font-semibold text-warm-white">
                      {title}
                    </DialogPrimitive.Title>
                    <DialogPrimitive.Description className="mt-1 text-sm text-warm-muted">
                      {description}
                    </DialogPrimitive.Description>
                  </div>
                  <DialogPrimitive.Close className="rounded-md p-1 text-warm-muted hover:bg-charcoal-200 hover:text-warm-white">
                    <X className="h-4 w-4" />
                  </DialogPrimitive.Close>
                </div>
                <div className="flex-1 overflow-y-auto p-4">{children}</div>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}
