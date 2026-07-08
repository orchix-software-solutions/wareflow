"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/** Search input with icon and clear button */
export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  className,
}: SearchInputProps) {
  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-warm-muted" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-md border border-charcoal-300 bg-charcoal-100 pl-9 pr-9 text-sm text-warm-white placeholder:text-warm-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-muted hover:text-warm-white"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
