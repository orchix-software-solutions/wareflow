"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  TrendingUp,
  MoreHorizontal,
  X,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/store/use-sidebar-store";
import { SIDEBAR_CONFIG } from "@/config/nav";
import { SidebarNavItem } from "./sidebar-nav-item";
import { SidebarUserProfile } from "./sidebar-user-profile";
import type { SidebarConfig } from "@/types/nav";

const BOTTOM_TAB_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Inventory", href: "/dashboard/inventory", icon: Package },
  { label: "Purchases", href: "/dashboard/purchases", icon: ShoppingCart },
  { label: "Sales", href: "/dashboard/sales", icon: TrendingUp },
] as const;

interface MobileNavProps {
  config?: SidebarConfig;
}

/** Mobile bottom navigation bar with "More" bottom sheet */
export function MobileNav({ config = SIDEBAR_CONFIG }: MobileNavProps) {
  const pathname = usePathname();
  const { isMobileSheetOpen, setMobileSheetOpen, isSheetFullscreen, toggleSheetFullscreen } =
    useSidebarStore();
  const dragControls = useDragControls();
  const sheetRef = useRef<HTMLDivElement>(null);

  const bottomTabHrefs = new Set<string>(BOTTOM_TAB_ITEMS.map((t) => t.href));

  const sheetGroups = config.groups
    .map((group) => ({
      items: group.items.filter((item) => !bottomTabHrefs.has(item.href)),
    }))
    .filter((group) => group.items.length > 0);

  const handleCloseSheet = useCallback(() => {
    setMobileSheetOpen(false);
  }, [setMobileSheetOpen]);

  const handleNavigate = useCallback(() => {
    setMobileSheetOpen(false);
  }, [setMobileSheetOpen]);

  return (
    <div className="lg:hidden">
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-sidebar-border bg-sidebar-bg pb-[env(safe-area-inset-bottom)]"
        aria-label="Mobile navigation"
      >
        <div className="flex h-16 items-center justify-around">
          {BOTTOM_TAB_ITEMS.map((tab) => {
            const href = tab.href;
            const isActive =
              pathname === href || (href !== "/dashboard" && pathname.startsWith(href + "/"));
            return (
              <Link
                key={tab.href}
                href={href}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-3 py-1 transition-colors",
                  isActive ? "text-sidebar-text" : "text-sidebar-text-muted",
                )}
              >
                <div className="relative">
                  {isActive && (
                    <span className="absolute -top-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-sidebar-text" />
                  )}
                  <tab.icon className="h-6 w-6" />
                </div>
                <span className="text-[11px] font-medium">{tab.label}</span>
              </Link>
            );
          })}
          <button
            onClick={() => setMobileSheetOpen(true)}
            className={cn(
              "flex flex-col items-center gap-0.5 px-3 py-1 transition-colors",
              isMobileSheetOpen ? "text-sidebar-text" : "text-sidebar-text-muted",
            )}
            aria-label="More navigation options"
          >
            <MoreHorizontal className="h-6 w-6" />
            <span className="text-[11px] font-medium">More</span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileSheetOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/50"
              onClick={handleCloseSheet}
              aria-hidden="true"
            />

            <motion.div
              ref={sheetRef}
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              drag={isSheetFullscreen ? false : "y"}
              dragControls={dragControls}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.y > 100 || info.velocity.y > 500) {
                  handleCloseSheet();
                }
              }}
              className={cn(
                "fixed inset-x-0 bottom-0 z-50 flex flex-col bg-sidebar-bg",
                isSheetFullscreen ? "top-0 rounded-none" : "max-h-[60vh] rounded-t-2xl",
              )}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              {!isSheetFullscreen && (
                <div className="flex shrink-0 items-center justify-between px-4 pb-2 pt-3">
                  <div
                    className="mx-auto h-1 w-10 rounded-full bg-sidebar-text-muted"
                    onPointerDown={(e) => dragControls.start(e)}
                  />
                </div>
              )}
              <div
                className="flex shrink-0 items-center justify-between px-4 pb-3"
                style={
                  isSheetFullscreen
                    ? { paddingTop: "max(env(safe-area-inset-top), 1rem)" }
                    : undefined
                }
              >
                <div>
                  <span className="text-[15px] font-semibold text-sidebar-text">WareFlow</span>
                  <p className="text-[12px] text-sidebar-text-muted">
                    Enterprise operations platform
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={toggleSheetFullscreen}
                    className="rounded-md p-1.5 text-sidebar-text-muted transition-colors duration-150 hover:text-sidebar-text"
                    aria-label={isSheetFullscreen ? "Exit fullscreen" : "Fullscreen"}
                  >
                    {isSheetFullscreen ? (
                      <Minimize2 className="h-[18px] w-[18px]" />
                    ) : (
                      <Maximize2 className="h-[18px] w-[18px]" />
                    )}
                  </button>
                  <button
                    onClick={handleCloseSheet}
                    className="rounded-md p-1.5 text-sidebar-text-muted transition-colors duration-150 hover:text-sidebar-text"
                    aria-label="Close menu"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <nav className="flex-1 overflow-y-auto px-3 pb-2" aria-label="Full navigation">
                {sheetGroups.map((group, groupIndex) => (
                  <div key={groupIndex}>
                    {groupIndex > 0 && <hr className="mx-2 my-3 border-sidebar-border" />}
                    <ul role="list" className="space-y-0.5">
                      {group.items.map((item) => (
                        <SidebarNavItem key={item.href} item={item} onNavigate={handleNavigate} />
                      ))}
                    </ul>
                  </div>
                ))}
              </nav>

              <SidebarUserProfile />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
