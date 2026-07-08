"use client";

import { forwardRef } from "react";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface HeaderBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tooltip: string;
  active?: boolean;
  badge?: number;
}

export const HeaderBtn = forwardRef<HTMLButtonElement, HeaderBtnProps>(
  ({ tooltip, active, badge, className, children, ...props }, ref) => (
    <Tooltip content={tooltip} side="bottom">
      <button
        ref={ref}
        type="button"
        className={cn(
          "relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600/30",
          active && "bg-slate-100 text-slate-900",
          className,
        )}
        {...props}
      >
        {children}
        {badge != null && badge > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-0.5 text-[9px] font-bold leading-none text-white">
            {badge > 99 ? "99+" : badge}
          </span>
        )}
      </button>
    </Tooltip>
  ),
);
HeaderBtn.displayName = "HeaderBtn";
