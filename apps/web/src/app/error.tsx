"use client";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-white">
      <h1 className="text-4xl font-bold text-brand-600">Something went wrong</h1>
      <p className="text-slate-500">{error.message}</p>
      <button
        onClick={reset}
        className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
      >
        Try Again
      </button>
    </div>
  );
}
