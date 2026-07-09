"use client";

import { QueryProvider } from "@/providers/query-provider";
import { DynamicFavicon } from "@/components/common/dynamic-favicon";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <DynamicFavicon />
      {children}
      <Toaster
        position="top-right"
        gap={8}
        offset={24}
        visibleToasts={5}
        style={{ fontFamily: "var(--font-bricolage)" }}
      />
    </QueryProvider>
  );
}
