import Link from "next/link";
import { PackageX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6">
      <span className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
        <PackageX className="h-10 w-10" />
      </span>

      <h1 className="mb-2 text-7xl font-bold text-brand-600">404</h1>
      <p className="mb-1 text-lg font-medium text-slate-900">Page not found</p>
      <p className="mb-8 text-center text-sm text-slate-500">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/dashboard"
        className="rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
