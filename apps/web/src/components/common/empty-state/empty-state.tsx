import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

/** Empty state placeholder with icon, message, and optional action */
export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-4 py-16", className)}>
      <div className="text-[#94A3B8]">{icon ?? <Inbox className="h-12 w-12" />}</div>
      <div className="text-center">
        <h3 className="text-lg font-medium text-[#0F172A]">{title}</h3>
        {description && <p className="mt-1 text-sm text-[#64748B]">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
