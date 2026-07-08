import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  TrendingUp,
  BarChart3,
  Settings,
} from "lucide-react";
import type { SidebarConfig } from "@/types/nav";

export const SIDEBAR_CONFIG: SidebarConfig = {
  groups: [
    {
      items: [
        {
          label: "Dashboard",
          href: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          label: "Inventory",
          href: "/dashboard/inventory",
          icon: Package,
        },
        {
          label: "Purchases",
          href: "/dashboard/purchases",
          icon: ShoppingCart,
        },
        {
          label: "Sales",
          href: "/dashboard/sales",
          icon: TrendingUp,
        },
      ],
    },
    {
      items: [
        {
          label: "Reports",
          href: "/dashboard/reports",
          icon: BarChart3,
        },
        {
          label: "Settings",
          href: "/dashboard/settings",
          icon: Settings,
        },
      ],
    },
  ],
};
