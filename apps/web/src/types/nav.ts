import type { LucideIcon } from "lucide-react";

export interface NavChild {
  label: string;
  href: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  children?: NavChild[];
  group?: string;
}

export interface NavGroup {
  items: NavItem[];
}

export interface SidebarConfig {
  groups: NavGroup[];
}
