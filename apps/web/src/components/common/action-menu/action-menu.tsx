"use client";

import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ActionMenuProps } from "./action-menu.types";

/** Reusable three-dot row-actions menu (View / Edit / Delete, etc.) */
export function ActionMenu({ items, align = "end" }: ActionMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label="Row actions"
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700",
            open && "bg-slate-100 text-slate-700",
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </DropdownMenu.Trigger>

      <AnimatePresence>
        {open && (
          <DropdownMenu.Portal forceMount>
            <DropdownMenu.Content align={align} sideOffset={4} asChild>
              <motion.div
                className="z-50 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl"
                initial={{ opacity: 0, scale: 0.96, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -4 }}
                transition={{ duration: 0.15 }}
              >
                {items.map((item) => (
                  <div key={item.id}>
                    {item.separatorBefore && (
                      <DropdownMenu.Separator className="my-1 h-px bg-slate-100" />
                    )}
                    <DropdownMenu.Item
                      disabled={item.disabled}
                      onClick={(e) => {
                        e.stopPropagation();
                        item.onClick();
                      }}
                      className={cn(
                        "flex cursor-pointer select-none items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                        item.destructive
                          ? "text-red-600 hover:bg-red-50 focus:bg-red-50"
                          : "text-slate-700 hover:bg-slate-100 focus:bg-slate-100",
                      )}
                    >
                      {item.icon && (
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center [&>svg]:h-4 [&>svg]:w-4">
                          {item.icon}
                        </span>
                      )}
                      {item.label}
                    </DropdownMenu.Item>
                  </div>
                ))}
              </motion.div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        )}
      </AnimatePresence>
    </DropdownMenu.Root>
  );
}
