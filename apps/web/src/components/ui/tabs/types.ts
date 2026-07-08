import type React from "react";

/** A single tab entry */
export interface Tab {
  id: string;
  label: string;
  /** Optional leading icon */
  icon?: React.ReactNode;
  disabled?: boolean;
}

/** Props for the Tabs container component */
export interface TabsProps {
  tabs: Tab[];
  /** Controlled active tab ID */
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: "underline" | "pill" | "enclosed";
  size?: "sm" | "md" | "lg";
  /** Stretch all tabs to fill equal width */
  fullWidth?: boolean;
  /** Tab panels — compose with <TabPanel> */
  children: React.ReactNode;
  className?: string;
}

/** Props for a single animated tab panel */
export interface TabPanelProps {
  /** Must match a tab id defined in the parent Tabs */
  tabId: string;
  /** The currently active tab ID — pass the same value used by Tabs */
  activeTab: string;
  children: React.ReactNode;
  className?: string;
}
