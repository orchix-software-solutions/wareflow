"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const FEATURES = [
  {
    title: "Inventory Management",
    description: "Track every item across all warehouses in real time.",
  },
  {
    title: "Sales Analytics",
    description: "Gain insights into your best sellers and revenue trends.",
  },
  {
    title: "Supplier Relationships",
    description: "Manage purchase orders and vendors from one place.",
  },
  {
    title: "Team Management",
    description: "Manage roles, permissions, and performance across your team.",
  },
];

const INTERVAL_MS = 4000;

/** Auto-scrolling feature carousel for the auth layout */
export function FeatureCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % FEATURES.length);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  const feature = FEATURES[activeIndex];

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-8 px-8">
      <AnimatePresence mode="wait">
        {feature && (
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold text-sidebar-accent">{feature.title}</h2>
            <p className="mt-3 text-warm-muted">{feature.description}</p>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex gap-2">
        {FEATURES.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`h-2 rounded-full transition-all ${
              index === activeIndex ? "w-8 bg-sidebar-accent" : "w-2 bg-sidebar-border"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
