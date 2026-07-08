"use client";

import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, CheckCircle2, AlertTriangle, Info, Package, Check } from "lucide-react";
import { HeaderBtn } from "./header-btn";
import { cn } from "@/lib/utils";

type NotifType = "success" | "warning" | "info";

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

const INIT_NOTIFS: Notification[] = [
  {
    id: "1",
    type: "info",
    title: "New Purchase Order",
    body: "PO-2024-0045 has been created and is awaiting approval.",
    time: "2m ago",
    read: false,
  },
  {
    id: "2",
    type: "warning",
    title: "Low Stock Alert",
    body: "3 products are running below minimum stock levels.",
    time: "18m ago",
    read: false,
  },
  {
    id: "3",
    type: "success",
    title: "Transfer Completed",
    body: "Stock transfer #ST-0012 to Warehouse B is complete.",
    time: "1h ago",
    read: false,
  },
  {
    id: "4",
    type: "info",
    title: "System Maintenance",
    body: "Scheduled maintenance tonight at 2:00 AM — 15 minutes downtime.",
    time: "3h ago",
    read: true,
  },
  {
    id: "5",
    type: "success",
    title: "Invoice Paid",
    body: "Invoice #INV-0892 from Acme Corp has been marked as paid.",
    time: "5h ago",
    read: true,
  },
];

const ICON_MAP: Record<NotifType, React.ElementType> = {
  success: CheckCircle2,
  warning: AlertTriangle,
  info: Info,
};

const COLOR_MAP: Record<NotifType, string> = {
  success: "text-emerald-600 bg-emerald-50",
  warning: "text-amber-600 bg-amber-50",
  info: "text-brand-600 bg-brand-50",
};

export function HeaderNotifications() {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState(INIT_NOTIFS);

  const unread = notifs.filter((n) => !n.read).length;

  const markAllRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <HeaderBtn tooltip="Notifications" badge={unread} active={open}>
          <Bell className="h-[18px] w-[18px]" />
        </HeaderBtn>
      </DropdownMenu.Trigger>

      <AnimatePresence>
        {open && (
          <DropdownMenu.Portal forceMount>
            <DropdownMenu.Content align="end" sideOffset={6} asChild>
              <motion.div
                className="z-50 w-[360px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
                initial={{ opacity: 0, scale: 0.96, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -4 }}
                transition={{ duration: 0.15 }}
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <p className="text-[14px] font-semibold text-slate-900">Notifications</p>
                    {unread > 0 && (
                      <span className="rounded-full bg-brand-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                        {unread}
                      </span>
                    )}
                  </div>
                  {unread > 0 && (
                    <button
                      type="button"
                      onClick={markAllRead}
                      className="flex items-center gap-1 text-[12px] font-medium text-brand-600 hover:text-brand-700"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Mark all read
                    </button>
                  )}
                </div>

                {/* List */}
                <ul className="max-h-[380px] divide-y divide-slate-50 overflow-y-auto">
                  {notifs.map((n) => {
                    const Icon = ICON_MAP[n.type];
                    return (
                      <li key={n.id}>
                        <button
                          type="button"
                          onClick={() => markRead(n.id)}
                          className={cn(
                            "flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-slate-50",
                            !n.read && "bg-brand-50/40",
                          )}
                        >
                          <span
                            className={cn(
                              "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                              COLOR_MAP[n.type],
                            )}
                          >
                            <Icon className="h-4 w-4" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p
                                className={cn(
                                  "text-[13px] leading-snug",
                                  n.read
                                    ? "font-normal text-slate-700"
                                    : "font-semibold text-slate-900",
                                )}
                              >
                                {n.title}
                              </p>
                              {!n.read && (
                                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
                              )}
                            </div>
                            <p className="mt-0.5 line-clamp-2 text-[12px] leading-relaxed text-slate-500">
                              {n.body}
                            </p>
                            <p className="mt-1 text-[11px] text-slate-400">{n.time}</p>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>

                {/* Footer */}
                <div className="border-t border-slate-100 px-4 py-2.5">
                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-1.5 text-[12px] font-medium text-brand-600 hover:text-brand-700"
                    onClick={() => setOpen(false)}
                  >
                    <Package className="h-3.5 w-3.5" />
                    View all notifications
                  </button>
                </div>
              </motion.div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        )}
      </AnimatePresence>
    </DropdownMenu.Root>
  );
}
