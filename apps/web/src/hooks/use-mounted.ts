import { useEffect, useState } from "react";

/**
 * Returns `false` during SSR and the first client render, then `true` after
 * mount. Use it to gate client-only dynamic data (e.g. values fetched via
 * React Query) so the first client render matches the server HTML and React
 * does not report a hydration mismatch.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
