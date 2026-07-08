"use client";

import { useRouter } from "next/navigation";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import { motion } from "framer-motion";

export function AccessDenied() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-brand-50 px-4 font-sans selection:bg-brand-600/10 selection:text-brand-700">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10"
      >
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 15 }}
            className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-brand-200 bg-brand-50"
          >
            <ShieldAlert className="h-10 w-10 text-brand-600" />
            <span className="absolute inset-0 rounded-2xl bg-brand-600 opacity-5 blur-xl" />
          </motion.div>

          <div className="mt-8 flex flex-col gap-3">
            <span className="text-[14px] font-bold uppercase tracking-widest text-brand-600">
              Error 403
            </span>
            <h1 className="text-[26px] font-bold tracking-tight text-slate-900">Access Denied</h1>
            <p className="max-w-sm text-[14px] leading-relaxed text-slate-500">
              You do not have the required permissions to view this resource. Please contact your
              administrator if you believe this is an error.
            </p>
          </div>

          <div className="mt-10 flex w-full flex-col gap-3 sm:flex-row">
            <button
              onClick={() => router.back()}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-[14px] font-medium text-slate-900 transition-all hover:bg-slate-50 active:scale-[0.98]"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </button>
            <button
              onClick={() => router.push("/")}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 text-[14px] font-medium text-white shadow-sm shadow-brand-600/10 transition-all hover:bg-brand-700 active:scale-[0.98]"
            >
              <Home className="h-4 w-4" />
              Return Home
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
