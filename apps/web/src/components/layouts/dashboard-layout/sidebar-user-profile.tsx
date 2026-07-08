"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface SidebarUserProfileProps {
  isCollapsed?: boolean;
  className?: string;
}

const USER_NAME = "Admin User";
const USER_EMAIL = "admin@wareflow.com";

/** User profile section with avatar, name, email, and sign-out button */
export function SidebarUserProfile({ isCollapsed = false, className }: SidebarUserProfileProps) {
  const router = useRouter();
  const handleSignOut = () => router.push("/");

  const nameParts = USER_NAME.split(" ");
  const initials =
    nameParts.length >= 2
      ? `${nameParts[0]?.[0] ?? ""}${nameParts[nameParts.length - 1]?.[0] ?? ""}`
      : USER_NAME.slice(0, 2);

  if (isCollapsed) {
    return (
      <div className={cn("border-t border-sidebar-border p-2", className)}>
        <div className="flex flex-col items-center gap-2">
          <Tooltip content={USER_NAME} side="right">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-accent-dark text-xs font-semibold text-white"
              aria-hidden="true"
            >
              {initials}
            </div>
          </Tooltip>
          <Tooltip content="Sign out" side="right">
            <button
              onClick={handleSignOut}
              aria-label="Sign out"
              className="rounded-md p-1.5 text-sidebar-text-muted transition-colors duration-150 hover:text-sidebar-accent"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </Tooltip>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("border-t border-sidebar-border p-4", className)}>
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sidebar-accent-dark text-sm font-semibold text-white"
          aria-hidden="true"
        >
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-medium text-sidebar-text">{USER_NAME}</p>
          <p className="truncate text-[12px] text-sidebar-text-muted">{USER_EMAIL}</p>
        </div>
        <button
          onClick={handleSignOut}
          aria-label="Sign out"
          className="shrink-0 rounded-md p-2 text-sidebar-text-muted transition-colors duration-150 hover:text-sidebar-accent"
        >
          <LogOut className="h-[18px] w-[18px]" />
        </button>
      </div>
    </div>
  );
}
