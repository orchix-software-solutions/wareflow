"use client";

import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";
import { DashboardHeader } from "./header";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

/** Root dashboard layout with responsive sidebar/mobile nav, global page header, and main content area */
export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex flex-1 flex-col overflow-y-auto px-4 py-6 pb-36 sm:px-6 lg:pb-6">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
