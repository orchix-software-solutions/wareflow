"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import type { TooltipProps } from "./types";

/** Tooltip with dark bg, arrow, configurable side and delay */
export function Tooltip({ content, children, side = "top", delayDuration = 400 }: TooltipProps) {
  return (
    <TooltipPrimitive.Provider>
      <TooltipPrimitive.Root delayDuration={delayDuration}>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            className="z-50 max-w-[200px] rounded-md bg-[#0F172A] px-2.5 py-1.5 text-[12px] text-white shadow-md animate-in fade-in-0 zoom-in-95"
            sideOffset={4}
          >
            {content}
            <TooltipPrimitive.Arrow className="fill-[#0F172A]" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
