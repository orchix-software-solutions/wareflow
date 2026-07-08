import type { LucideIcon } from "lucide-react";

export type NavChildType = "link" | "action" | "separator";

export interface NavChild {
  label: string;
  type?: NavChildType; // default: "link"
  href?: string; // required for "link", unused for "action"/"separator"
}

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  children?: NavChild[];
}

export interface NavGroup {
  label?: string;
  items: NavItem[];
}

export interface SidebarConfig {
  groups: NavGroup[];
}
