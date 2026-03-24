function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`skeleton-shimmer rounded ${className}`} />
  );
}

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>

      {/* KPI Cards skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-zinc-200 bg-white p-4 space-y-3"
          >
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>

      {/* Charts row skeleton */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-zinc-200 bg-white p-4 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <div className="flex gap-3">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 space-y-4">
          <Skeleton className="h-4 w-36" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-32 w-32 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row skeleton */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-zinc-200 bg-white p-4 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-56 w-full rounded-lg" />
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-14" />
          </div>
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="rounded-lg border border-zinc-100 p-3 space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-14 rounded-full" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
