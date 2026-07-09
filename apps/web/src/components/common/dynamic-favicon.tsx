"use client";

import { useEffect } from "react";
import { useBranding } from "@/hooks/branding";

/**
 * Swaps the document favicon to the uploaded branding asset once it loads.
 * The static icons declared in `app/layout.tsx` metadata remain the
 * pre-hydration fallback; this only overrides them client-side.
 */
export function DynamicFavicon() {
  const { data: branding } = useBranding();
  const faviconUrl = branding?.favicon?.url;

  useEffect(() => {
    if (!faviconUrl) return;

    const OWN_ID = "dynamic-favicon";
    let link = document.head.querySelector<HTMLLinkElement>(`link#${OWN_ID}`);
    if (!link) {
      link = document.createElement("link");
      link.id = OWN_ID;
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = faviconUrl;
  }, [faviconUrl]);

  return null;
}
