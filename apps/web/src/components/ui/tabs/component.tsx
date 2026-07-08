"use client";

import { useState, useCallback, useRef, useId, createContext } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Tab, TabsProps, TabPanelProps } from "./types";

interface TabsContextValue {
  direction: number;
  instanceId: string;
}

const TabsContext = createContext<TabsContextValue>({ direction: 0, instanceId: "" });

const sizeStyles = {
  sm: { height: "h-9", px: "px-4", text: "text-[13px]" },
  md: { height: "h-10", px: "px-5", text: "text-[13.5px]" },
  lg: { height: "h-11", px: "px-6", text: "text-[14px]" },
};

interface TabListSharedProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  size: "sm" | "md" | "lg";
  fullWidth: boolean;
  onKeyDown: (e: React.KeyboardEvent, index: number) => void;
  tabRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>;
  instanceId: string;
}

/** Underline-variant tab list with animated bottom-border indicator */
function UnderlineTabList({
  tabs,
  activeTab,
  onTabChange,
  size,
  fullWidth,
  onKeyDown,
  tabRefs,
  instanceId,
}: TabListSharedProps) {
  const { height, px, text } = sizeStyles[size];
  const indicatorId = `underline-indicator-${instanceId}`;

  return (
    <div
      role="tablist"
      aria-label="Tabs"
      className={cn("relative flex border-b border-[#F1F5F9]", fullWidth && "w-full")}
    >
      {tabs.map((tab, index) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            id={`tab-${tab.id}`}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            disabled={tab.disabled}
            onClick={() => !tab.disabled && onTabChange(tab.id)}
            onKeyDown={(e) => onKeyDown(e, index)}
            className={cn(
              "relative inline-flex items-center justify-center gap-1.5 whitespace-nowrap uppercase tracking-[0.05em] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[rgba(37,99,235,0.25)] disabled:pointer-events-none disabled:opacity-40",
              height,
              px,
              text,
              isActive
                ? "font-semibold text-[#2563EB]"
                : "font-medium text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]",
              fullWidth && "flex-1",
            )}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            {tab.label}
            {isActive && (
              <motion.div
                layoutId={indicatorId}
                className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-[#2563EB]"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

/** Pill-variant tab list with animated white-pill background */
function PillTabList({
  tabs,
  activeTab,
  onTabChange,
  size,
  fullWidth,
  onKeyDown,
  tabRefs,
  instanceId,
}: TabListSharedProps) {
  const { height, px, text } = sizeStyles[size];
  const pillId = `pill-bg-${instanceId}`;

  return (
    <div
      role="tablist"
      aria-label="Tabs"
      className={cn("flex rounded-[10px] bg-[#F1F5F9] p-1", fullWidth && "w-full")}
    >
      {tabs.map((tab, index) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            id={`tab-${tab.id}`}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            disabled={tab.disabled}
            onClick={() => !tab.disabled && onTabChange(tab.id)}
            onKeyDown={(e) => onKeyDown(e, index)}
            className={cn(
              "relative inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-[8px] uppercase tracking-[0.05em] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[rgba(37,99,235,0.25)] disabled:pointer-events-none disabled:opacity-40",
              height,
              px,
              text,
              isActive
                ? "font-semibold text-[#0F172A]"
                : "font-medium text-[#64748B] hover:text-[#0F172A]",
              fullWidth && "flex-1",
            )}
          >
            {isActive && (
              <motion.div
                layoutId={pillId}
                className="absolute inset-0 rounded-[8px] bg-white shadow-[0_1px_3px_rgba(45,42,38,0.06)]"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            {tab.icon && <span className="relative z-10 shrink-0">{tab.icon}</span>}
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/** Enclosed (folder-tab) variant tab list */
function EnclosedTabList({
  tabs,
  activeTab,
  onTabChange,
  size,
  fullWidth,
  onKeyDown,
  tabRefs,
}: TabListSharedProps) {
  const { height, px, text } = sizeStyles[size];

  return (
    <div role="tablist" aria-label="Tabs" className={cn("flex", fullWidth && "w-full")}>
      {tabs.map((tab, index) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            id={`tab-${tab.id}`}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            disabled={tab.disabled}
            onClick={() => !tab.disabled && onTabChange(tab.id)}
            onKeyDown={(e) => onKeyDown(e, index)}
            className={cn(
              "relative inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-t-lg border border-b-0 uppercase tracking-[0.05em] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[rgba(37,99,235,0.25)] disabled:pointer-events-none disabled:opacity-40",
              height,
              px,
              text,
              isActive
                ? "z-10 border-[#E2E8F0] bg-white font-semibold text-[#0F172A]"
                : "border-[#E2E8F0] bg-[#F1F5F9] font-medium text-[#64748B] hover:text-[#0F172A]",
              fullWidth && "flex-1",
            )}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

/**
 * TabPanel renders a single panel for the given tabId.
 * Only mounts when active; fades in to avoid layout height collapse.
 */
export function TabPanel({ tabId, activeTab, children, className }: TabPanelProps) {
  const isActive = tabId === activeTab;

  if (!isActive) return null;

  return (
    <motion.div
      key={tabId}
      role="tabpanel"
      id={`tabpanel-${tabId}`}
      aria-labelledby={`tab-${tabId}`}
      tabIndex={0}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={cn("focus:outline-none", className)}
    >
      {children}
    </motion.div>
  );
}

/**
 * Tabs component with three visual variants (underline, pill, enclosed),
 * full ARIA keyboard navigation, and Framer Motion animated transitions.
 */
export function Tabs({
  tabs,
  activeTab,
  onTabChange,
  variant = "underline",
  size = "md",
  fullWidth = false,
  children,
  className,
}: TabsProps) {
  const instanceId = useId();
  const [direction, setDirection] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleTabChange = useCallback(
    (tabId: string) => {
      const prevIndex = tabs.findIndex((t) => t.id === activeTab);
      const nextIndex = tabs.findIndex((t) => t.id === tabId);
      setDirection(nextIndex > prevIndex ? 1 : -1);
      onTabChange(tabId);
    },
    [tabs, activeTab, onTabChange],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, currentIndex: number) => {
      const enabledTabs = tabs.map((t, i) => ({ ...t, origIndex: i })).filter((t) => !t.disabled);
      const currentEnabledPos = enabledTabs.findIndex((t) => t.origIndex === currentIndex);

      let target: (typeof enabledTabs)[0] | undefined;

      switch (e.key) {
        case "ArrowRight":
          e.preventDefault();
          target = enabledTabs[(currentEnabledPos + 1) % enabledTabs.length];
          break;
        case "ArrowLeft":
          e.preventDefault();
          target = enabledTabs[(currentEnabledPos - 1 + enabledTabs.length) % enabledTabs.length];
          break;
        case "Home":
          e.preventDefault();
          target = enabledTabs[0];
          break;
        case "End":
          e.preventDefault();
          target = enabledTabs[enabledTabs.length - 1];
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          handleTabChange(tabs[currentIndex]!.id);
          return;
        default:
          return;
      }

      if (target) {
        tabRefs.current[target.origIndex]?.focus();
        handleTabChange(target.id);
      }
    },
    [tabs, handleTabChange],
  );

  const tabListProps: TabListSharedProps = {
    tabs,
    activeTab,
    onTabChange: handleTabChange,
    size,
    fullWidth,
    onKeyDown: handleKeyDown,
    tabRefs,
    instanceId,
  };

  return (
    <TabsContext.Provider value={{ direction, instanceId }}>
      <div className={cn("w-full", className)}>
        {variant === "underline" && (
          <>
            <UnderlineTabList {...tabListProps} />
            <div>{children}</div>
          </>
        )}
        {variant === "pill" && (
          <>
            <PillTabList {...tabListProps} />
            <div>{children}</div>
          </>
        )}
        {variant === "enclosed" && (
          <>
            <EnclosedTabList {...tabListProps} />
            <div className="-mt-px rounded-b-[12px] rounded-tr-[12px] border border-[#E2E8F0] bg-white">
              {children}
            </div>
          </>
        )}
      </div>
    </TabsContext.Provider>
  );
}
