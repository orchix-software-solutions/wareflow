"use client";

import * as DropdownPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";
import type { DropdownMenuProps } from "./types";

/** Dropdown menu built on Radix UI */
export function DropdownMenu({ trigger, items, align = "end" }: DropdownMenuProps) {
  return (
    <DropdownPrimitive.Root>
      <DropdownPrimitive.Trigger asChild>{trigger}</DropdownPrimitive.Trigger>
      <DropdownPrimitive.Portal>
        <DropdownPrimitive.Content
          align={align}
          sideOffset={4}
          className="z-50 min-w-[8rem] overflow-hidden rounded-md border border-charcoal-300 bg-charcoal-100 p-1 shadow-lg animate-in fade-in-0 zoom-in-95"
        >
          {items.map((item, index) => {
            if (item.separator) {
              return (
                <DropdownPrimitive.Separator
                  key={`sep-${index}`}
                  className="my-1 h-px bg-charcoal-300"
                />
              );
            }

            return (
              <DropdownPrimitive.Item
                key={item.label}
                disabled={item.disabled}
                onClick={item.onClick}
                className={cn(
                  "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-3 py-2 text-sm outline-none transition-colors hover:bg-charcoal-200 focus:bg-charcoal-200 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                  item.destructive ? "text-red-400 hover:text-red-300" : "text-warm-white",
                )}
              >
                {item.icon}
                {item.label}
              </DropdownPrimitive.Item>
            );
          })}
        </DropdownPrimitive.Content>
      </DropdownPrimitive.Portal>
    </DropdownPrimitive.Root>
  );
}
