"use client";

import { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import {
  Settings,
  X,
  User,
  Building2,
  Bell,
  Globe,
  Shield,
  Database,
  Keyboard,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { HeaderBtn } from "./header-btn";
import { HeaderThemeToggle } from "./header-theme-toggle";

const QUICK_LINKS = [
  { icon: User, label: "Profile & Account", description: "Manage your personal information" },
  { icon: Building2, label: "Company Settings", description: "Branches, warehouses, taxes" },
  { icon: Bell, label: "Notifications", description: "Alerts, emails and push settings" },
  { icon: Globe, label: "Language & Region", description: "Locale, currency and timezone" },
  { icon: Shield, label: "Security", description: "Password, 2FA and sessions" },
  { icon: Database, label: "Backup & Restore", description: "Data export and restore points" },
];

const SHORTCUTS = [
  { keys: ["⌘", "K"], label: "Open search" },
  { keys: ["⌘", "B"], label: "Toggle sidebar" },
  { keys: ["⌘", "+"], label: "Quick create" },
  { keys: ["?"], label: "Keyboard shortcuts" },
];

export function HeaderSettings() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <HeaderBtn tooltip="Quick Settings" active={open} onClick={() => setOpen(true)}>
        <Settings className="h-[18px] w-[18px]" />
      </HeaderBtn>

      <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
        <AnimatePresence>
          {open && (
            <DialogPrimitive.Portal forceMount>
              <DialogPrimitive.Overlay asChild>
                <motion.div
                  className="fixed inset-0 z-50 bg-black/40"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                />
              </DialogPrimitive.Overlay>
              <DialogPrimitive.Content asChild>
                <motion.div
                  className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[360px] flex-col border-l border-slate-200 bg-white shadow-2xl focus:outline-none"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                    <div>
                      <DialogPrimitive.Title className="text-[15px] font-semibold text-slate-900">
                        Quick Settings
                      </DialogPrimitive.Title>
                      <DialogPrimitive.Description className="mt-0.5 text-[12px] text-slate-500">
                        Workspace preferences
                      </DialogPrimitive.Description>
                    </div>
                    <DialogPrimitive.Close className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                      <X className="h-4 w-4" />
                    </DialogPrimitive.Close>
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    {/* Appearance */}
                    <section className="border-b border-slate-100 px-5 py-4">
                      <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Appearance
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[13px] font-medium text-slate-800">Theme</p>
                          <p className="text-[12px] text-slate-500">
                            Switch between light and dark
                          </p>
                        </div>
                        <HeaderThemeToggle />
                      </div>
                    </section>

                    {/* Quick Links */}
                    <section className="border-b border-slate-100 px-5 py-4">
                      <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Settings
                      </p>
                      <ul className="space-y-0.5">
                        {QUICK_LINKS.map(({ icon: Icon, label, description }) => (
                          <li key={label}>
                            <button
                              type="button"
                              onClick={() => setOpen(false)}
                              className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-slate-50"
                            >
                              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                                <Icon className="h-4 w-4" />
                              </span>
                              <div className="min-w-0 flex-1 text-left">
                                <p className="text-[13px] font-medium text-slate-800">{label}</p>
                                <p className="text-[11px] text-slate-500">{description}</p>
                              </div>
                              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-300" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </section>

                    {/* Keyboard Shortcuts */}
                    <section className="px-5 py-4">
                      <div className="mb-3 flex items-center gap-1.5">
                        <Keyboard className="h-3.5 w-3.5 text-slate-400" />
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          Keyboard Shortcuts
                        </p>
                      </div>
                      <ul className="space-y-2">
                        {SHORTCUTS.map(({ keys, label }) => (
                          <li key={label} className="flex items-center justify-between">
                            <span className="text-[12px] text-slate-600">{label}</span>
                            <div className="flex items-center gap-1">
                              {keys.map((k) => (
                                <kbd
                                  key={k}
                                  className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-[11px] text-slate-500"
                                >
                                  {k}
                                </kbd>
                              ))}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </section>
                  </div>

                  {/* Footer */}
                  <div className="border-t border-slate-100 px-5 py-3">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2 text-[13px] font-medium text-slate-600 transition-colors hover:bg-slate-50"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Open Full Settings
                    </button>
                  </div>
                </motion.div>
              </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
          )}
        </AnimatePresence>
      </DialogPrimitive.Root>
    </>
  );
}
