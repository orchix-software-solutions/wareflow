"use client";

import { motion } from "framer-motion";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { SIDEBAR_CONFIG } from "@/config/nav";
import { useSidebarStore } from "@/store/use-sidebar-store";
import { Tooltip } from "@/components/ui/tooltip";
import { SidebarNavItem } from "./sidebar-nav-item";
import { SidebarUserProfile } from "./sidebar-user-profile";
import { Logo } from "./logo";
import type { SidebarConfig } from "@/types/nav";

interface SidebarProps {
  config?: SidebarConfig;
}

/** Desktop sidebar with collapsible width, grouped navigation, and pinned user profile */
export function Sidebar({ config = SIDEBAR_CONFIG }: SidebarProps) {
  const { isCollapsed, toggleCollapsed } = useSidebarStore();

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 68 : 280 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="hidden lg:flex lg:h-screen lg:shrink-0 lg:flex-col lg:border-r lg:border-sidebar-border lg:bg-sidebar-bg"
    >
      <div className="flex h-[80px] shrink-0 items-center justify-between border-b border-sidebar-border px-4">
        {!isCollapsed && (
          <div className="flex flex-1 items-center pl-2">
            <Logo variant="light" />
          </div>
        )}
        <Tooltip content={isCollapsed ? "Expand sidebar" : "Collapse sidebar"} side="right">
          <button
            onClick={toggleCollapsed}
            className="rounded-md p-2 text-sidebar-text-muted transition-colors duration-150 hover:bg-sidebar-hover hover:text-sidebar-text"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="h-[18px] w-[18px]" />
            ) : (
              <PanelLeftClose className="h-[18px] w-[18px]" />
            )}
          </button>
        </Tooltip>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4 scrollbar-thin" aria-label="Main navigation">
        {config.groups.map((group, groupIndex) => (
          <div key={groupIndex}>
            {groupIndex > 0 && <hr className="mx-2 my-3 border-sidebar-border" />}
            <ul role="list" className="space-y-0.5">
              {group.items.map((item) => (
                <SidebarNavItem key={item.href} item={item} isCollapsed={isCollapsed} />
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <SidebarUserProfile isCollapsed={isCollapsed} />
    </motion.aside>
  );
}
