"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/store/use-sidebar-store";
import { Tooltip } from "@/components/ui/tooltip";
import type { NavChild, NavItem } from "@/types/nav";

interface SidebarNavItemProps {
  item: NavItem;
  isCollapsed?: boolean;
  onNavigate?: () => void;
}

function ChildLink({
  child,
  isActive,
  onNavigate,
}: {
  child: NavChild;
  isActive: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={child.href!}
      onClick={onNavigate}
      className={cn(
        "relative block rounded-md px-3 py-2 text-[13px] transition-colors duration-150",
        isActive
          ? "bg-white/8 font-medium text-sidebar-text"
          : "font-normal text-sidebar-text-muted hover:bg-white/5 hover:text-sidebar-text",
      )}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-r-full bg-sidebar-accent" />
      )}
      {child.label}
    </Link>
  );
}

function ChildAction({ child }: { child: NavChild }) {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-[13px] font-normal text-sidebar-text-muted transition-colors duration-150 hover:bg-white/5 hover:text-sidebar-text"
    >
      <Zap className="h-3 w-3 shrink-0 opacity-60" />
      {child.label}
    </button>
  );
}

function ChildSeparator({ label }: { label?: string }) {
  return (
    <div className="px-3 pb-1 pt-3">
      {label && (
        <p className="text-[10px] font-semibold uppercase tracking-widest text-sidebar-text-muted opacity-50">
          {label}
        </p>
      )}
    </div>
  );
}

/** Sidebar navigation item with optional expandable children (accordion) */
export function SidebarNavItem({ item, isCollapsed = false, onNavigate }: SidebarNavItemProps) {
  const pathname = usePathname();
  const { expandedGroup, toggleGroup } = useSidebarStore();

  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = expandedGroup === item.label;

  const linkChildren = item.children?.filter((c) => c.type === "link" || !c.type) ?? [];
  const activeChildHref =
    linkChildren.find((c) => c.href === pathname)?.href ??
    linkChildren
      .filter((c) => c.href && pathname.startsWith(c.href + "/"))
      .sort((a, b) => (b.href?.length ?? 0) - (a.href?.length ?? 0))[0]?.href ??
    null;

  const isActive =
    pathname === item.href ||
    (item.href !== "/" && item.href !== "/dashboard" && pathname.startsWith(item.href + "/")) ||
    activeChildHref !== null;

  // ── Collapsed: icon only ────────────────────────────────
  if (isCollapsed) {
    return (
      <li>
        <Tooltip content={item.label} side="right">
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
        </Tooltip>
      </li>
    );
  }

  // ── With children: accordion ────────────────────────────
  if (hasChildren) {
    return (
      <li>
        <button
          onClick={() => toggleGroup(item.label)}
          aria-expanded={isExpanded}
          className={cn(
            "relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-medium transition-colors duration-150",
            isActive
              ? "bg-sidebar-active text-sidebar-text"
              : "text-sidebar-text hover:bg-sidebar-hover",
          )}
        >
          {isActive && (
            <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-sidebar-accent" />
          )}
          <item.icon className="h-[18px] w-[18px] shrink-0 text-sidebar-text-muted" />
          <span className="flex-1 text-left">{item.label}</span>
          <motion.span animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="h-3.5 w-3.5 text-sidebar-text-muted" />
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
              <div className="mb-1 mt-0.5 space-y-0.5 pl-8">
                {item.children!.map((child, i) => {
                  if (child.type === "separator") {
                    return <ChildSeparator key={`sep-${i}`} label={child.label} />;
                  }
                  if (child.type === "action") {
                    return (
                      <li key={`action-${child.label}`}>
                        <ChildAction child={child} />
                      </li>
                    );
                  }
                  const isChildActive = child.href === activeChildHref;
                  return (
                    <li key={child.href}>
                      <ChildLink child={child} isActive={isChildActive} onNavigate={onNavigate} />
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

  // ── No children: simple link ────────────────────────────
  return (
    <li>
      <Link
        href={item.href}
        onClick={onNavigate}
        className={cn(
          "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-medium transition-colors duration-150",
          isActive
            ? "bg-sidebar-active text-sidebar-text"
            : "text-sidebar-text hover:bg-sidebar-hover",
        )}
      >
        {isActive && (
          <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-sidebar-accent" />
        )}
        <item.icon className="h-[18px] w-[18px] shrink-0 text-sidebar-text-muted" />
        <span>{item.label}</span>
      </Link>
    </li>
  );
}
