"use client";

import { useState, useEffect } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Package, Archive, TrendingUp, Clock, X, ArrowRight } from "lucide-react";
import { HeaderBtn } from "./header-btn";
import { cn } from "@/lib/utils";

const RECENT = ["Stock Overview", "Purchase Orders", "Sales Reports", "Low Stock"];

const SUGGESTIONS = [
  { group: "Products", icon: Package, items: ["All Products", "Categories", "Price Lists"] },
  { group: "Inventory", icon: Archive, items: ["Stock Movements", "Cycle Counts", "Low Stock"] },
  { group: "Sales", icon: TrendingUp, items: ["Sales Orders", "Invoices", "Customers"] },
];

export function HeaderSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleOpen = (val: boolean) => {
    setOpen(val);
    if (!val) setQuery("");
  };

  return (
    <>
      <HeaderBtn tooltip="Search (⌘K)" onClick={() => setOpen(true)}>
        <Search className="h-[18px] w-[18px]" />
      </HeaderBtn>

      <DialogPrimitive.Root open={open} onOpenChange={handleOpen}>
        <AnimatePresence>
          {open && (
            <DialogPrimitive.Portal forceMount>
              <DialogPrimitive.Overlay asChild>
                <motion.div
                  className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                />
              </DialogPrimitive.Overlay>
              <DialogPrimitive.Content className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
                <motion.div
                  className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
                  initial={{ opacity: 0, scale: 0.96, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -8 }}
                  transition={{ duration: 0.18 }}
                >
                  {/* Search input */}
                  <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5">
                    <Search className="h-4.5 w-4.5 shrink-0 text-slate-400" />
                    <DialogPrimitive.Title className="sr-only">Search</DialogPrimitive.Title>
                    <input
                      autoFocus
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search products, orders, customers…"
                      className="flex-1 bg-transparent text-[14px] text-slate-900 placeholder:text-slate-400 outline-none"
                    />
                    <kbd className="hidden rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[11px] font-medium text-slate-400 sm:block">
                      ESC
                    </kbd>
                    <DialogPrimitive.Close className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                      <X className="h-4 w-4" />
                    </DialogPrimitive.Close>
                  </div>

                  <div className="max-h-[440px] overflow-y-auto p-3">
                    {!query ? (
                      <>
                        {/* Recent */}
                        <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          Recent
                        </p>
                        <ul className="mb-4 space-y-0.5">
                          {RECENT.map((item) => (
                            <li key={item}>
                              <button
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13.5px] text-slate-700 hover:bg-slate-100"
                                onClick={() => handleOpen(false)}
                              >
                                <Clock className="h-4 w-4 shrink-0 text-slate-400" />
                                {item}
                                <ArrowRight className="ml-auto h-3.5 w-3.5 text-slate-300" />
                              </button>
                            </li>
                          ))}
                        </ul>

                        {/* Suggestions */}
                        {SUGGESTIONS.map(({ group, icon: Icon, items }) => (
                          <div key={group} className="mb-4">
                            <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                              {group}
                            </p>
                            <ul className="space-y-0.5">
                              {items.map((item) => (
                                <li key={item}>
                                  <button
                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13.5px] text-slate-700 hover:bg-slate-100"
                                    onClick={() => handleOpen(false)}
                                  >
                                    <Icon className="h-4 w-4 shrink-0 text-slate-400" />
                                    {item}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </>
                    ) : (
                      <p className="px-3 py-8 text-center text-[13px] text-slate-400">
                        No results for &ldquo;{query}&rdquo;
                      </p>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center gap-4 border-t border-slate-100 px-4 py-2.5">
                    {[
                      { key: "↑↓", label: "navigate" },
                      { key: "↵", label: "select" },
                      { key: "esc", label: "close" },
                    ].map(({ key, label }) => (
                      <span
                        key={key}
                        className="flex items-center gap-1.5 text-[11px] text-slate-400"
                      >
                        <kbd
                          className={cn(
                            "rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-[10px] text-slate-500",
                          )}
                        >
                          {key}
                        </kbd>
                        {label}
                      </span>
                    ))}
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
