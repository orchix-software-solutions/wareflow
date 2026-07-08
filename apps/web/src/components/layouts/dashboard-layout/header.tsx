"use client";

import { usePageHeaderStore } from "@/store/use-page-header-store";
import { HeaderBreadcrumb } from "./header-breadcrumb";
import { HeaderSearch } from "./header-search";
import { HeaderScanner } from "./header-scanner";
import { HeaderQuickCreate } from "./header-quick-create";
import { HeaderNotifications } from "./header-notifications";
import { HeaderThemeToggle } from "./header-theme-toggle";
import { HeaderSettings } from "./header-settings";

/** Sticky global application header shown on every authenticated page. */
export function DashboardHeader() {
  const description = usePageHeaderStore((s) => s.description);
  const actions = usePageHeaderStore((s) => s.actions);

  return (
    <header className="sticky top-0 z-40 flex min-h-[68px] shrink-0 items-center border-b border-slate-200 bg-white px-5">
      {/* ─── Left: breadcrumb + page description ─── */}
      <div className="flex min-w-0 flex-col justify-center gap-0.5 py-2.5">
        <HeaderBreadcrumb />
        {description && (
          <p className="hidden max-w-[480px] truncate text-[13px] text-slate-400 sm:block">
            {description}
          </p>
        )}
      </div>

      {/* ─── Right: page actions + utility icons ─── */}
      <div className="ml-auto flex shrink-0 items-center gap-3">
        {actions && <div className="flex items-center gap-2">{actions}</div>}

        <div className="flex items-center gap-0.5">
          <HeaderSearch />
          <HeaderScanner />
          <HeaderQuickCreate />

          <span className="mx-1.5 h-5 w-px bg-slate-200" />

          <HeaderNotifications />
          <HeaderThemeToggle />
          <HeaderSettings />
        </div>
      </div>
    </header>
  );
}
