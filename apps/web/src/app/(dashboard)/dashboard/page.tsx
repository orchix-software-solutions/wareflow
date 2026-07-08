"use client";

import { Package, ShoppingCart, TrendingUp, AlertTriangle } from "lucide-react";
import { usePageHeader } from "@/hooks/use-page-header";
import { StatCard } from "@/components/common/stat-card";
import { ActivityTimeline } from "@/components/common/activity-timeline";

const STATS = [
  {
    label: "Total SKUs",
    value: "4,820",
    icon: Package,
    trend: { value: "3.2%", direction: "up" as const },
  },
  {
    label: "Open Purchase Orders",
    value: "128",
    icon: ShoppingCart,
    trend: { value: "1.4%", direction: "down" as const },
  },
  {
    label: "Sales This Month",
    value: "$92,400",
    icon: TrendingUp,
    trend: { value: "8.1%", direction: "up" as const },
  },
  {
    label: "Low Stock Alerts",
    value: "17",
    icon: AlertTriangle,
    trend: { value: "5.0%", direction: "down" as const },
  },
];

const ACTIVITY = [
  {
    id: "1",
    description: "Purchase order PO-1042 received from Acme Supplies",
    timestamp: new Date(Date.now() - 1000 * 60 * 24).toISOString(),
  },
  {
    id: "2",
    description: "Stock adjustment on SKU WF-2201 (+120 units)",
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
  {
    id: "3",
    description: "Sales order SO-3391 shipped to North Depot",
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
];

export default function DashboardPage() {
  usePageHeader("Dashboard", "An overview of your warehouse operations");

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-base font-semibold text-slate-900">Inventory by Warehouse</h2>
          <p className="mt-1 text-sm text-slate-500">
            A summary panel placeholder demonstrating the WareFlow design system.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { name: "Main Depot", count: 2140 },
              { name: "North Depot", count: 1680 },
              { name: "Overflow", count: 1000 },
            ].map((warehouse) => (
              <div
                key={warehouse.name}
                className="rounded-lg border border-slate-200 bg-slate-50 p-4"
              >
                <p className="text-[13px] font-medium text-slate-500">{warehouse.name}</p>
                <p className="mt-1 text-lg font-bold text-slate-900">
                  {warehouse.count.toLocaleString()} SKUs
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">Recent Activity</h2>
          <ActivityTimeline items={ACTIVITY} />
        </div>
      </div>
    </div>
  );
}
