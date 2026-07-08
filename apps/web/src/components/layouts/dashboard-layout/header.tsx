"use client";

import { Bell } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Tooltip } from "@/components/ui/tooltip";

/** Dashboard top header with user avatar and actions */
export function DashboardHeader() {
  return (
    <header className="flex h-16 items-center justify-end gap-4 border-b border-slate-200 bg-white px-6">
      <Tooltip content="Notifications">
        <button className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900">
          <Bell className="h-5 w-5" />
        </button>
      </Tooltip>
      <Avatar name="Admin User" size="sm" />
    </header>
  );
}
