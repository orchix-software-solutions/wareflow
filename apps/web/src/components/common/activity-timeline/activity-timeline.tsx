"use client";

export interface ActivityTimelineItem {
  id: string;
  description: string;
  timestamp: string;
  color?: string;
}

interface ActivityTimelineProps {
  items: ActivityTimelineItem[];
  isLoading?: boolean;
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return timestamp;
  return date.toLocaleString();
}

/** Vertical timeline of recent activity for a record */
export function ActivityTimeline({ items, isLoading = false }: ActivityTimelineProps) {
  if (isLoading) {
    return (
      <div className="mt-3 space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex animate-pulse items-center gap-3">
            <span className="h-2 w-2 shrink-0 rounded-full bg-slate-100" />
            <span className="h-3 flex-1 rounded bg-slate-100" />
            <span className="h-3 w-14 rounded bg-slate-100" />
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return <p className="mt-3 text-[13px] text-slate-500">No activity recorded yet.</p>;
  }

  return (
    <ol className="mt-3">
      {items.map((item, index) => (
        <li key={item.id} className="relative flex gap-3 pb-4 last:pb-0">
          {index < items.length - 1 && (
            <span
              aria-hidden="true"
              className="absolute bottom-0 left-[3.5px] top-3.5 border-l border-slate-200"
            />
          )}
          <span
            className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: item.color ?? "#2563EB" }}
          />
          <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
            <p className="min-w-0 truncate text-[13px] text-slate-900">{item.description}</p>
            <span className="shrink-0 text-[12px] text-slate-500">
              {formatTimestamp(item.timestamp)}
            </span>
          </div>
        </li>
      ))}
    </ol>
  );
}
