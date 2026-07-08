"use client";

import { motion } from "framer-motion";

export function FullPageSpinner() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="flex h-screen w-full flex-col items-center justify-center bg-[#F8FAFC]"
    >
      <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-[#E2E8F0] border-t-[#2563EB]" />
      <p className="mt-4 text-[14px] font-normal text-[#64748B]">Loading...</p>
    </motion.div>
  );
}
