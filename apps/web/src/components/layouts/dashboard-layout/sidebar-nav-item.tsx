"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/store/use-sidebar-store";
import { Tooltip } from "@/components/ui/tooltip";
import type { NavItem } from "@/types/nav";

interface SidebarNavItemProps {
  item: NavItem;
  isCollapsed?: boolean;
  onNavigate?: () => void;
}

/** Sidebar navigation item with optional expandable children (accordion) */
export function SidebarNavItem({ item, isCollapsed = false, onNavigate }: SidebarNavItemProps) {
  const pathname = usePathname();
  const { expandedGroup, toggleGroup } = useSidebarStore();

  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = expandedGroup === item.label;
  const isActive =
    pathname === item.href ||
    (item.href !== "/" && item.href !== "/dashboard" && pathname.startsWith(item.href + "/"));

  if (isCollapsed) {
    const content = (
      <Link
        href={item.href}
        onClick={onNavigate}
        className={cn(
          "flex items-center justify-center rounded-lg p-3 transition-colors duration-150",
          isActive
            ? "relative bg-sidebar-active text-sidebar-text"
            : "text-sidebar-text-muted hover:bg-sidebar-hover hover:text-sidebar-text",
        )}
      >
        {isActive && (
          <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-sidebar-accent" />
        )}
        <item.icon className="h-[22px] w-[22px] shrink-0" />
      </Link>
    );

    return (
      <li>
        <Tooltip content={item.label} side="right">
          {content}
        </Tooltip>
      </li>
    );
  }

  if (hasChildren) {
    const activeChildHref =
      item.children!.find((child) => child.href === pathname)?.href ??
      item
        .children!.filter((child) => pathname.startsWith(child.href + "/"))
        .sort((a, b) => b.href.length - a.href.length)[0]?.href ??
      null;

    return (
      <li>
        <button
          onClick={() => toggleGroup(item.label)}
          aria-expanded={isExpanded}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-[14px] font-medium transition-colors duration-150",
            isActive
              ? "relative bg-sidebar-active text-sidebar-text"
              : "text-sidebar-text hover:bg-sidebar-hover",
          )}
        >
          {isActive && (
            <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-sidebar-accent" />
          )}
          <item.icon className="h-[22px] w-[22px] shrink-0 text-sidebar-text-muted" />
          <span className="flex-1 text-left">{item.label}</span>
          <motion.span animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="h-4 w-4 text-sidebar-text-muted" />
          </motion.span>
        </button>
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.ul
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
              role="list"
            >
              <div className="mt-1 mb-1 space-y-0.5 pl-9">
                {item.children!.map((child) => {
                  const isChildActive = child.href === activeChildHref;
                  return (
                    <li key={child.href}>
                      <Link
                        href={child.href}
                        onClick={onNavigate}
                        className={cn(
                          "relative block rounded-md px-3 py-2 text-[14px] transition-colors duration-150",
                          isChildActive
                            ? "bg-white/8 font-medium text-sidebar-text"
                            : "font-normal text-sidebar-text-muted hover:bg-white/5 hover:text-sidebar-text",
                        )}
                      >
                        {isChildActive && (
                          <span className="absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-r-full bg-sidebar-accent" />
                        )}
                        {child.label}
                      </Link>
                    </li>
                  );
                })}
              </div>
            </motion.ul>
          )}
        </AnimatePresence>
      </li>
    );
  }

  return (
    <li>
      <Link
        href={item.href}
        onClick={onNavigate}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-3 text-[14px] font-medium transition-colors duration-150",
          isActive
            ? "relative bg-sidebar-active text-sidebar-text"
            : "text-sidebar-text hover:bg-sidebar-hover",
        )}
      >
        {isActive && (
          <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-sidebar-accent" />
        )}
        <item.icon className="h-[22px] w-[22px] shrink-0 text-sidebar-text-muted" />
        <span>{item.label}</span>
      </Link>
    </li>
  );
}
