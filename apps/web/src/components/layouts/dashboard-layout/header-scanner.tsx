"use client";

import { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { ScanLine, X, Keyboard } from "lucide-react";
import { HeaderBtn } from "./header-btn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMediaQuery } from "@/hooks/use-media-query";

interface ScannerContentProps {
  tab: "camera" | "manual";
  manual: string;
  onTabChange: (t: "camera" | "manual") => void;
  onManualChange: (v: string) => void;
  onClose: () => void;
}

function ScannerContent({
  tab,
  manual,
  onTabChange,
  onManualChange,
  onClose,
}: ScannerContentProps) {
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <DialogPrimitive.Title className="text-[15px] font-semibold text-slate-900">
            QR / Barcode Scanner
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="mt-0.5 text-[12px] text-slate-500">
            Scan a code or enter it manually
          </DialogPrimitive.Description>
        </div>
        <DialogPrimitive.Close
          onClick={onClose}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-4 w-4" />
        </DialogPrimitive.Close>
      </div>

      {/* Tab toggle */}
      <div className="flex border-b border-slate-100">
        {(["camera", "manual"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => onTabChange(t)}
            className={`flex-1 py-2.5 text-[13px] font-medium capitalize transition-colors ${
              tab === t
                ? "border-b-2 border-brand-600 text-brand-700"
                : "text-slate-400 hover:text-slate-700"
            }`}
          >
            {t === "camera" ? "Camera Scan" : "Manual Entry"}
          </button>
        ))}
      </div>

      {/* Body */}
      <div className="p-5">
        {tab === "camera" ? (
          <div className="flex flex-col items-center gap-4">
            <div
              className="relative w-full overflow-hidden rounded-xl bg-slate-950"
              style={{ aspectRatio: "1 / 1" }}
            >
              {[
                "top-3 left-3 border-t-2 border-l-2",
                "top-3 right-3 border-t-2 border-r-2",
                "bottom-3 left-3 border-b-2 border-l-2",
                "bottom-3 right-3 border-b-2 border-r-2",
              ].map((cls, i) => (
                <span key={i} className={`absolute h-6 w-6 rounded-sm border-brand-400 ${cls}`} />
              ))}
              <motion.div
                className="absolute inset-x-6 h-px bg-brand-400 opacity-80"
                animate={{ y: [-80, 80] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
                <ScanLine className="h-10 w-10 text-slate-600" />
                <p className="text-[12px] text-slate-500">Camera access required</p>
              </div>
            </div>
            <p className="text-center text-[12px] text-slate-400">
              Point the camera at a QR code or barcode to scan
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <Input
              label="Barcode / QR Code"
              placeholder="Enter or paste code here"
              leftIcon={<Keyboard className="h-4 w-4" />}
              value={manual}
              onChange={(e) => onManualChange(e.target.value)}
              autoFocus
            />
            <Button size="lg" className="w-full" disabled={!manual.trim()} onClick={onClose}>
              Look Up
            </Button>
          </div>
        )}
      </div>
    </>
  );
}

export function HeaderScanner() {
  const [open, setOpen] = useState(false);
  const [manual, setManual] = useState("");
  const [tab, setTab] = useState<"camera" | "manual">("camera");
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const handleClose = () => {
    setOpen(false);
    setManual("");
    setTab("camera");
  };

  const sharedProps = {
    tab,
    manual,
    onTabChange: setTab,
    onManualChange: setManual,
    onClose: handleClose,
  };

  return (
    <>
      <HeaderBtn tooltip="Scan QR / Barcode" onClick={() => setOpen(true)}>
        <ScanLine className="h-[18px] w-[18px]" />
      </HeaderBtn>

      <DialogPrimitive.Root open={open} onOpenChange={(v) => !v && handleClose()}>
        <AnimatePresence>
          {open && (
            <DialogPrimitive.Portal forceMount>
              {/* Overlay */}
              <DialogPrimitive.Overlay asChild>
                <motion.div
                  className="fixed inset-0 z-50 bg-black/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                />
              </DialogPrimitive.Overlay>

              {isDesktop ? (
                /* ── Desktop: centered dialog ── */
                <DialogPrimitive.Content className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <motion.div
                    className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.18 }}
                  >
                    <ScannerContent {...sharedProps} />
                  </motion.div>
                </DialogPrimitive.Content>
              ) : (
                /* ── Mobile: bottom drawer ── */
                <DialogPrimitive.Content className="fixed inset-x-0 bottom-0 z-50">
                  <motion.div
                    className="overflow-hidden rounded-t-2xl border-t border-slate-200 bg-white shadow-2xl"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  >
                    {/* Drag handle */}
                    <div className="flex justify-center pt-3 pb-1">
                      <span className="h-1 w-10 rounded-full bg-slate-200" />
                    </div>
                    <ScannerContent {...sharedProps} />
                  </motion.div>
                </DialogPrimitive.Content>
              )}
            </DialogPrimitive.Portal>
          )}
        </AnimatePresence>
      </DialogPrimitive.Root>
    </>
  );
}
