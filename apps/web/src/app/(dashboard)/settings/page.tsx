"use client";

import { useRouter } from "next/navigation";
import {
  Settings as SettingsIcon,
  Image,
  Bell,
  Plug,
  Webhook,
  ChevronRight,
  Palette,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { usePageHeader } from "@/hooks/use-page-header";

interface SettingsCardConfig {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

const SETTINGS_CARDS: SettingsCardConfig[] = [
  {
    id: "general",
    label: "General Settings",
    description: "Configure the fundamental information of the site.",
    href: "/settings/general",
    icon: SettingsIcon,
  },
  {
    id: "logo-favicon",
    label: "Logo and Favicon",
    description: "Upload your logo and favicon here.",
    href: "/settings/logo-favicon",
    icon: Image,
  },
  {
    id: "notifications",
    label: "Notification Settings",
    description: "Control and configure overall notification elements of the system.",
    href: "/settings/notifications",
    icon: Bell,
  },
  {
    id: "integrations",
    label: "Integrations",
    description: "Connect and manage third-party services and apps.",
    href: "/settings/integrations",
    icon: Plug,
  },
  {
    id: "webhooks",
    label: "Webhooks",
    description: "Send real-time event data to external endpoints.",
    href: "/settings/webhooks",
    icon: Webhook,
  },
  {
    id: "theme",
    label: "Theme",
    description: "Customize the appearance and color scheme of the app.",
    href: "/settings/theme",
    icon: Palette,
  },
];

function SettingsCard({ card }: { card: SettingsCardConfig }) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push(card.href)}
      className="group flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-left transition-colors duration-150 hover:border-brand-200 hover:bg-slate-50"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white">
        <card.icon className="h-4 w-4" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-[13px] font-semibold text-slate-900">{card.label}</span>
        <span className="truncate text-[12px] text-slate-500">{card.description}</span>
      </span>
      <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 transition-colors group-hover:text-brand-600" />
    </button>
  );
}

export default function SettingsPage() {
  usePageHeader("Settings", "Manage your system configuration and preferences.");

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {SETTINGS_CARDS.map((card) => (
        <SettingsCard key={card.id} card={card} />
      ))}
    </div>
  );
}
