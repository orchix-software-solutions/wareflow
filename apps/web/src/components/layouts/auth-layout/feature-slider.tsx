"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";

export interface Slide {
  id: string;
  badge: string;
  title: string;
  description: string;
  highlights: string[];
  image: string;
  badgeClass: string;
}

const SLIDES: Slide[] = [
  {
    id: "inventory",
    badge: "Real-Time Visibility",
    title: "Total Inventory Control",
    description:
      "Track every SKU across all your warehouses in real time. Never oversell, never run out.",
    highlights: ["Live stock levels", "Multi-warehouse sync", "Low-stock alerts"],
    image:
      "https://images.unsplash.com/photo-1553413077-190dd305871c?w=1440&auto=format&fit=crop&q=80",
    badgeClass: "bg-brand-600",
  },
  {
    id: "orders",
    badge: "Streamlined Operations",
    title: "Purchase & Sales in One View",
    description: "Manage supplier orders and customer fulfilment from a single, unified dashboard.",
    highlights: ["One-click PO creation", "Shipment tracking", "Supplier scorecards"],
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1440&auto=format&fit=crop&q=80",
    badgeClass: "bg-brand-700",
  },
  {
    id: "reports",
    badge: "Actionable Insights",
    title: "Reports That Drive Decisions",
    description:
      "Turn warehouse activity into clear charts and KPIs so your team acts on data, not guesswork.",
    highlights: ["Revenue trends", "Stock turn rate", "Team performance"],
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1440&auto=format&fit=crop&q=80",
    badgeClass: "bg-brand-800",
  },
];

const INTERVAL_MS = 5000;

export function FeatureSlider() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setActive((p) => (p + 1) % SLIDES.length), []);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, INTERVAL_MS);
    return () => clearInterval(t);
  }, [paused, next]);

  const slide = SLIDES[active]!;

  return (
    <div
      className="relative flex h-full w-full flex-col overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Screenshot visual ────────────────────────────────── */}
      <div className="relative flex-1 overflow-hidden">
        <Image
          key={slide.id}
          src={slide.image}
          alt={slide.title}
          fill
          className="object-cover object-top transition-opacity duration-700"
          priority
        />

        {/* Bottom gradient fade */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-brand-900 via-brand-900/80 to-transparent" />

        {/* Badge */}
        <div className="absolute left-8 top-8">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white ${slide.badgeClass}`}
          >
            {slide.badge}
          </span>
        </div>
      </div>

      {/* ── Slide text content ───────────────────────────────── */}
      <div className="relative z-10 flex flex-col gap-4 px-8 pb-8 pt-2">
        <div key={slide.id + "-text"} className="flex flex-col gap-3">
          <h2 className="text-[26px] font-bold leading-tight text-white">{slide.title}</h2>
          <p className="text-[14px] leading-relaxed text-slate-400">{slide.description}</p>

          <ul className="flex flex-col gap-1.5">
            {slide.highlights.map((h) => (
              <li key={h} className="flex items-center gap-2 text-[13px] text-slate-300">
                <span className="text-brand-400">✦</span>
                {h}
              </li>
            ))}
          </ul>
        </div>

        {/* ── Dot indicators + progress bar ────────────────────── */}
        <div className="mt-2 flex items-center gap-3">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setActive(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`relative h-1.5 overflow-hidden rounded-full transition-all duration-300 ${i === active ? "bg-brand-400" : "bg-brand-800"}`}
              style={{ width: i === active ? 32 : 8 }}
            >
              {i === active && !paused && (
                <span
                  className="absolute inset-y-0 left-0 rounded-full bg-white/40"
                  style={{
                    animation: `slideProgress ${INTERVAL_MS}ms linear forwards`,
                  }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideProgress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
