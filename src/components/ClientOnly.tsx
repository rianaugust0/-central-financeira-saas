import { useEffect, useState, ReactNode } from "react";

/** Renders children only after client mount. Required for Recharts ResponsiveContainer under SSR. */
export function ClientOnly({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <>{fallback}</>;
  return <>{children}</>;
}

export function ChartSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full h-full rounded-xl bg-gradient-to-br from-surface-elevated/60 to-surface/30 animate-pulse ${className}`} />
  );
}
