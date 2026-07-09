import {
  LayoutDashboard,
  Package,
  Archive,
  Warehouse,
  ShoppingCart,
  TrendingUp,
  ScanLine,
  BarChart3,
  Users,
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
          children: [
            { label: "Overview", href: "/dashboard" },
            { label: "Analytics", href: "/dashboard/analytics" },
            { label: "Activity", href: "/dashboard/activity" },
          ],
        },
        {
          label: "Products",
          href: "/products",
          icon: Package,
          children: [
            { label: "All Products", href: "/products" },
            { label: "Categories", href: "/products/categories" },
            { label: "Brands", href: "/products/brands" },
            { label: "Units", href: "/products/units" },
            { label: "Product Variants", href: "/products/variants" },
            { label: "Price Lists", href: "/products/price-lists" },
            { label: "Import & Export", href: "/products/import-export" },
            { type: "separator", label: "Actions" },
            { type: "action", label: "Print QR Labels" },
            { type: "action", label: "Print Barcode Labels" },
            { type: "action", label: "Bulk Print Labels" },
            { type: "action", label: "Download Labels" },
            { type: "action", label: "Generate SKU" },
          ],
        },
        {
          label: "Inventory",
          href: "/inventory",
          icon: Archive,
          children: [
            { label: "Stock Overview", href: "/inventory" },
            { label: "Stock Movements", href: "/inventory/movements" },
            { label: "Stock Adjustments", href: "/inventory/adjustments" },
            { label: "Stock Transfers", href: "/inventory/transfers" },
            { label: "Cycle Counts", href: "/inventory/cycle-counts" },
            { label: "Low Stock", href: "/inventory/low-stock" },
            { label: "Stock Reservations", href: "/inventory/reservations" },
            { label: "Inventory Valuation", href: "/inventory/valuation" },
          ],
        },
        {
          label: "Warehouses",
          href: "/warehouses",
          icon: Warehouse,
          children: [
            { label: "All Warehouses", href: "/warehouses" },
            { label: "Zones", href: "/warehouses/zones" },
            { label: "Racks", href: "/warehouses/racks" },
            { label: "Bins", href: "/warehouses/bins" },
            { label: "Transfer Requests", href: "/warehouses/transfers" },
          ],
        },
        {
          label: "Purchases",
          href: "/purchases",
          icon: ShoppingCart,
          children: [
            { label: "Purchase Orders", href: "/purchases" },
            { label: "Goods Received", href: "/purchases/goods-received" },
            { label: "Purchase Returns", href: "/purchases/returns" },
            { label: "Suppliers", href: "/purchases/suppliers" },
          ],
        },
        {
          label: "Sales",
          href: "/sales",
          icon: TrendingUp,
          children: [
            { label: "Sales Orders", href: "/sales" },
            { label: "Quotations", href: "/sales/quotations" },
            { label: "Invoices", href: "/sales/invoices" },
            { label: "Returns", href: "/sales/returns" },
            { label: "Customers", href: "/sales/customers" },
          ],
        },
        {
          label: "Point of Sale",
          href: "/pos",
          icon: ScanLine,
          children: [
            { label: "New Sale", href: "/pos/new-sale" },
            { label: "Registers", href: "/pos/registers" },
            { label: "Transactions", href: "/pos/transactions" },
            { label: "Returns", href: "/pos/returns" },
            { label: "Receipts", href: "/pos/receipts" },
          ],
        },
        {
          label: "Reports",
          href: "/reports",
          icon: BarChart3,
          children: [
            { label: "Sales Reports", href: "/reports/sales" },
            { label: "Purchase Reports", href: "/reports/purchases" },
            { label: "Inventory Reports", href: "/reports/inventory" },
            { label: "Warehouse Reports", href: "/reports/warehouses" },
            { label: "Customer Reports", href: "/reports/customers" },
            { label: "Supplier Reports", href: "/reports/suppliers" },
            { label: "Profit & Loss", href: "/reports/profit-loss" },
          ],
        },
      ],
    },
    {
      items: [
        {
          label: "Users",
          href: "/users",
          icon: Users,
          children: [
            { label: "Users", href: "/users" },
            { label: "Roles", href: "/users/roles" },
            { label: "Permissions", href: "/users/permissions" },
          ],
        },
        {
          label: "Settings",
          href: "/settings",
          icon: Settings,
        },
      ],
    },
  ],
};
