"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { X, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { ResponsiveDialogProps } from "./responsive-dialog.types";

/** Responsive dialog: centered modal on desktop, bottom drawer on mobile. Fully reusable. */
export function ResponsiveDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className,
}: ResponsiveDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const titleId = useId();
  const descId = useId();
  const triggerRef = useRef<Element | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (open) {
      triggerRef.current = document.activeElement;
      document.body.style.overflow = "hidden";
      document.body.style.pointerEvents = "";
    } else if (wasOpenRef.current) {
      // Only on a real open -> close transition. A dialog that mounts
      // closed (e.g. nested inside another dialog) must not clear the
      // parent dialog's scroll lock or steal focus.
      document.body.style.overflow = "";
      document.body.style.pointerEvents = "";

      // Safety net: Radix UI or nested elements sometimes leave pointer-events: none
      // on the body when abruptly unmounted. Reset on the next tick.
      const timer = setTimeout(() => {
        if (document.body.style.pointerEvents === "none") {
          document.body.style.pointerEvents = "";
        }
      }, 50);
      // Ensure we don't block clicks if the dialog closes
      return () => {
        clearTimeout(timer);
        if (document.body.style.pointerEvents === "none") {
          document.body.style.pointerEvents = "";
        }
      };
    }
    wasOpenRef.current = open;
    return () => {
      if (wasOpenRef.current) {
        document.body.style.overflow = "";
        document.body.style.pointerEvents = "";

        setTimeout(() => {
          if (document.body.style.pointerEvents === "none") {
            document.body.style.pointerEvents = "";
          }
        }, 50);
        setTimeout(() => {
          if (document.body.style.pointerEvents === "none") {
            document.body.style.pointerEvents = "";
          }
        }, 300);
      }
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
      }
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0]!;
        const last = focusable[focusable.length - 1]!;
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (open && dialogRef.current) {
      const first = dialogRef.current.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      first?.focus();
    }
  }, [open]);

  const shared = {
    open,
    onOpenChange,
    title,
    description,
    titleId,
    descId,
    dialogRef,
    footer,
    className,
  };

  if (isDesktop) {
    return <DesktopDialog {...shared}>{children}</DesktopDialog>;
  }

  return <MobileDrawer {...shared}>{children}</MobileDrawer>;
}

interface InternalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  titleId: string;
  descId: string;
  dialogRef: React.RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

function DesktopDialog({
  open,
  onOpenChange,
  title,
  description,
  titleId,
  descId,
  dialogRef,
  children,
  footer,
  className,
}: InternalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!open) setIsFullscreen(false);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="desktop-dialog"
          className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, pointerEvents: "none" }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto absolute inset-0 bg-[rgba(45,42,38,0.4)]"
            aria-hidden="true"
            onClick={() => onOpenChange(false)}
          />
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descId}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, pointerEvents: "none" }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
            }}
            className={cn(
              "pointer-events-auto relative z-10 flex flex-col border border-[#E2E8F0] bg-white",
              isFullscreen
                ? "inset-0 h-screen w-screen rounded-none !fixed"
                : "max-h-[85vh] w-full max-w-[560px] rounded-2xl",
              className,
              isFullscreen && "max-w-none max-h-none",
            )}
          >
            <div className="flex shrink-0 items-start justify-between border-b border-[#F1F5F9] px-6 py-5">
              <div className="min-w-0 flex-1 pr-4">
                <h2 id={titleId} className="text-lg font-semibold text-[#0F172A]">
                  {title}
                </h2>
                <p id={descId} className="mt-0.5 text-[13px] text-[#64748B]">
                  {description}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  onClick={() => setIsFullscreen((f) => !f)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-[#64748B] transition-colors duration-150 hover:text-[#2563EB]"
                  aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                >
                  {isFullscreen ? (
                    <Minimize2 className="h-[18px] w-[18px]" />
                  ) : (
                    <Maximize2 className="h-[18px] w-[18px]" />
                  )}
                </button>
                <button
                  onClick={() => onOpenChange(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-[#64748B] transition-colors duration-150 hover:text-[#2563EB]"
                  aria-label="Close dialog"
                >
                  <X className="h-[18px] w-[18px]" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
            {footer && (
              <div className="shrink-0 border-t border-[#F1F5F9] bg-white px-6 py-4">{footer}</div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MobileDrawer({
  open,
  onOpenChange,
  title,
  description,
  titleId,
  descId,
  dialogRef,
  children,
  footer,
  className,
}: InternalProps) {
  const dragControls = useDragControls();
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!open) setIsFullscreen(false);
  }, [open]);

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div key="mobile-drawer" className="fixed inset-0 z-50 flex flex-col">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, pointerEvents: "none" }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50"
            aria-hidden="true"
            onClick={handleClose}
          />
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descId}
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%", pointerEvents: "none" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            drag={isFullscreen ? false : "y"}
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.2 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 || info.velocity.y > 500) {
                handleClose();
              }
            }}
            className={cn(
              "fixed inset-x-0 bottom-0 z-50 flex flex-col bg-white",
              isFullscreen ? "top-0 rounded-none" : "max-h-[75vh] rounded-t-2xl",
              className,
              isFullscreen && "max-w-none max-h-none h-screen w-screen",
            )}
          >
            {!isFullscreen && (
              <div className="flex shrink-0 items-center justify-between px-4 pt-3 pb-2">
                <div
                  className="mx-auto h-1 w-10 rounded-full bg-[#CBD5E1]"
                  onPointerDown={(e) => dragControls.start(e)}
                />
              </div>
            )}
            <div
              className="flex shrink-0 items-center justify-between px-4 pb-3"
              style={
                isFullscreen ? { paddingTop: "max(env(safe-area-inset-top), 1rem)" } : undefined
              }
            >
              <div className="min-w-0 flex-1 pr-4">
                <h2 id={titleId} className="text-[15px] font-semibold text-[#0F172A]">
                  {title}
                </h2>
                <p id={descId} className="text-[12px] text-[#64748B]">
                  {description}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsFullscreen((f) => !f)}
                  className="rounded-md p-1.5 text-[#64748B] transition-colors duration-150 hover:text-[#0F172A]"
                  aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                >
                  {isFullscreen ? (
                    <Minimize2 className="h-[18px] w-[18px]" />
                  ) : (
                    <Maximize2 className="h-[18px] w-[18px]" />
                  )}
                </button>
                <button
                  onClick={handleClose}
                  className="rounded-md p-1.5 text-[#64748B] transition-colors duration-150 hover:text-[#0F172A]"
                  aria-label="Close drawer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto border-t border-[#F1F5F9] px-4 py-4">
              {children}
            </div>
            {footer && (
              <div
                className="shrink-0 border-t border-[#F1F5F9] bg-white px-4 py-4"
                style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
              >
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
