"use client";

import { Logo } from "@/components/layouts/dashboard-layout/logo";
import { PublicRoute } from "@/components/common/route-guard";
import { FeatureSlider } from "./feature-slider";
import type { AuthLayoutProps } from "./auth-layout.types";

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <PublicRoute>
      <div className="flex h-screen overflow-hidden bg-white">
        {/* ─── LEFT PANEL — white form ──────────────────────────── */}
        <div className="flex w-full flex-col overflow-y-auto bg-white lg:w-1/2">
          {/* Logo pinned top on desktop */}
          <div className="hidden px-8 pt-10 lg:block">
            <Logo theme="light" />
          </div>

          {/* Mobile logo */}
          <div className="flex justify-center px-6 pt-10 lg:hidden">
            <Logo theme="light" />
          </div>

          <div className="flex w-full grow flex-col items-center px-6 pb-16 pt-8 lg:min-h-0 lg:px-8 lg:py-8">
            <div className="my-auto w-full max-w-md">{children}</div>
          </div>
        </div>

        {/* ─── RIGHT PANEL — dark feature slider ───────────────── */}
        <div className="relative hidden flex-col overflow-hidden bg-brand-900 lg:flex lg:w-1/2">
          <FeatureSlider />
        </div>
      </div>
    </PublicRoute>
  );
}
