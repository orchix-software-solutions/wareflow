"use client";

import Image from "next/image";
import { useBranding } from "@/hooks/branding";
import { useMounted } from "@/hooks/use-mounted";

interface LogoProps {
  theme?: "light" | "dark";
  className?: string;
}

/**
 * WareFlow wordmark.
 * theme="light" → logo for light backgrounds (dark-coloured text)
 * theme="dark"  → logo for dark backgrounds (white-coloured text)
 *
 * Falls back to the bundled static logo until the branding API resolves
 * (or if no custom logo has been uploaded).
 */
export function Logo({ theme = "light", className }: LogoProps) {
  const { data: branding } = useBranding();
  const mounted = useMounted();

  const fallback = theme === "dark" ? "/logo-dark.png" : "/logo-light.png";
  const remote = theme === "dark" ? branding?.logoDark?.url : branding?.logoLight?.url;
  const src = mounted && remote ? remote : fallback;

  return (
    <div className={className}>
      <Image src={src} alt="WareFlow" width={200} height={35} priority unoptimized />
    </div>
  );
}
