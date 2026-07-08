"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

const SEGMENT_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  create: "Create",
  edit: "Edit",
  products: "Products",
  categories: "Categories",
  brands: "Brands",
  units: "Units",
  variants: "Product Variants",
  "price-lists": "Price Lists",
  "import-export": "Import & Export",
  inventory: "Inventory",
  movements: "Stock Movements",
  adjustments: "Stock Adjustments",
  transfers: "Stock Transfers",
  "cycle-counts": "Cycle Counts",
  "low-stock": "Low Stock",
  reservations: "Stock Reservations",
  valuation: "Inventory Valuation",
  warehouses: "Warehouses",
  zones: "Zones",
  racks: "Racks",
  bins: "Bins",
  purchases: "Purchases",
  "goods-received": "Goods Received",
  returns: "Returns",
  suppliers: "Suppliers",
  sales: "Sales",
  quotations: "Quotations",
  invoices: "Invoices",
  customers: "Customers",
  pos: "Point of Sale",
  "new-sale": "New Sale",
  registers: "Registers",
  transactions: "Transactions",
  receipts: "Receipts",
  reports: "Reports",
  "profit-loss": "Profit & Loss",
  users: "Users",
  roles: "Roles",
  permissions: "Permissions",
  settings: "Settings",
  company: "Company",
  branches: "Branches",
  taxes: "Taxes",
  currency: "Currency",
  email: "Email",
  notifications: "Notifications",
  backup: "Backup & Restore",
  system: "System Information",
  analytics: "Analytics",
  activity: "Activity",
};

export function HeaderBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const crumbs = segments.map((seg, i) => ({
    label: SEGMENT_LABELS[seg] ?? seg,
    href: "/" + segments.slice(0, i + 1).join("/"),
    isLast: i === segments.length - 1,
  }));

  return (
    <nav aria-label="Breadcrumb" className="hidden items-center gap-1 sm:flex">
      <ol className="flex items-center gap-1">
        {crumbs.map((crumb, i) => (
          <li key={crumb.href} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-300" />}
            {crumb.isLast ? (
              <span className="text-[15px] font-semibold text-slate-800">{crumb.label}</span>
            ) : (
              <Link
                href={crumb.href}
                className="text-[14px] text-slate-400 transition-colors hover:text-slate-700"
              >
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
