"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Package,
  ShoppingCart,
  TrendingUp,
  Warehouse,
  Users,
  FileText,
  Tag,
  Truck,
} from "lucide-react";
import { HeaderBtn } from "./header-btn";

const GROUPS = [
  {
    label: "Products",
    items: [
      { label: "New Product", icon: Package },
      { label: "New Category", icon: Tag, href: "/products/categories/create" },
    ],
  },
  {
    label: "Purchasing",
    items: [
      { label: "New Purchase Order", icon: ShoppingCart },
      { label: "New Supplier", icon: Truck },
    ],
  },
  {
    label: "Sales",
    items: [
      { label: "New Sales Order", icon: TrendingUp },
      { label: "New Quotation", icon: FileText },
      { label: "New Customer", icon: Users },
    ],
  },
  {
    label: "Warehouse",
    items: [{ label: "New Transfer Request", icon: Warehouse }],
  },
];

export function HeaderQuickCreate() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <HeaderBtn tooltip="Quick Create" active={open}>
          <Plus className="h-[18px] w-[18px]" />
        </HeaderBtn>
      </DropdownMenu.Trigger>

      <AnimatePresence>
        {open && (
          <DropdownMenu.Portal forceMount>
            <DropdownMenu.Content align="end" sideOffset={6} asChild>
              <motion.div
                className="z-50 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
                initial={{ opacity: 0, scale: 0.96, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -4 }}
                transition={{ duration: 0.15 }}
              >
                <div className="border-b border-slate-100 px-3 py-2.5">
                  <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider">
                    Quick Create
                  </p>
                </div>
                <div className="p-1.5">
                  {GROUPS.map((group, gi) => (
                    <div key={group.label}>
                      {gi > 0 && <DropdownMenu.Separator className="my-1 h-px bg-slate-100" />}
                      <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        {group.label}
                      </p>
                      {group.items.map(({ label, icon: Icon, href }) => (
                        <DropdownMenu.Item
                          key={label}
                          onSelect={() => {
                            setOpen(false);
                            if (href) router.push(href);
                          }}
                          className="flex cursor-pointer select-none items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] text-slate-700 outline-none hover:bg-slate-100 focus:bg-slate-100"
                        >
                          <Icon className="h-4 w-4 shrink-0 text-slate-400" />
                          {label}
                        </DropdownMenu.Item>
                      ))}
                    </div>
                  ))}
                </div>
              </motion.div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        )}
      </AnimatePresence>
    </DropdownMenu.Root>
  );
}
