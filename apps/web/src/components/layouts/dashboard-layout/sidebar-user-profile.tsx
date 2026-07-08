"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Tooltip } from "@/components/ui/tooltip";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { cn } from "@/lib/utils";
import { useLogout } from "@/hooks/auth";
import { useAuthStore } from "@/store/use-auth-store";
import { toast } from "@/lib/toast";
import { ApiError } from "@/services/api-client";
import type { AuthUser } from "@/types/auth";

interface SidebarUserProfileProps {
  isCollapsed?: boolean;
  className?: string;
}

const FALLBACK_USER_NAME = "Admin User";
const FALLBACK_USER_EMAIL = "admin@wareflow.com";

/** User profile section with avatar, name, email, and sign-out button */
export function SidebarUserProfile({ isCollapsed = false, className }: SidebarUserProfileProps) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { mutateAsync: logout } = useLogout();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isSigningOut, startSignOutTransition] = useTransition();

  // Keep showing the last signed-in identity while the sign-out transition is
  // navigating away, instead of flashing the fallback identity on /dashboard
  // the instant the auth store clears (before the redirect finishes).
  const lastUserRef = useRef<AuthUser | null>(user);
  useEffect(() => {
    if (user) lastUserRef.current = user;
  }, [user]);
  const displayUser = user ?? lastUserRef.current;

  const USER_NAME = displayUser
    ? `${displayUser.firstName} ${displayUser.lastName}`.trim()
    : FALLBACK_USER_NAME;
  const USER_EMAIL = displayUser?.email ?? FALLBACK_USER_EMAIL;

  const handleSignOut = () => {
    startSignOutTransition(async () => {
      try {
        await logout();
      } catch (error) {
        const message = error instanceof ApiError ? error.message : "Something went wrong";
        toast.error({ title: "Sign out failed", description: message });
      } finally {
        setConfirmOpen(false);
      }
      router.push("/");
    });
  };

  const confirmDialog = (
    <ConfirmDialog
      open={confirmOpen}
      onOpenChange={setConfirmOpen}
      title="Sign Out"
      description="Are you sure you want to sign out of your WareFlow workspace?"
      variant="destructive"
      confirmLabel="Sign Out"
      cancelLabel="Cancel"
      loading={isSigningOut}
      onConfirm={handleSignOut}
    />
  );

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
              onClick={() => setConfirmOpen(true)}
              aria-label="Sign out"
              className="rounded-md p-1.5 text-sidebar-text-muted transition-colors duration-150 hover:text-sidebar-accent"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </Tooltip>
        </div>
        {confirmDialog}
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
          onClick={() => setConfirmOpen(true)}
          aria-label="Sign out"
          className="shrink-0 rounded-md p-2 text-sidebar-text-muted transition-colors duration-150 hover:text-sidebar-accent"
        >
          <LogOut className="h-[18px] w-[18px]" />
        </button>
      </div>
      {confirmDialog}
    </div>
  );
}
