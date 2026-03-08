export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="h-28 rounded-xl border border-zinc-200 bg-white" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="h-80 rounded-xl border border-zinc-200 bg-white lg:col-span-2" />
        <div className="h-80 rounded-xl border border-zinc-200 bg-white" />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="h-72 rounded-xl border border-zinc-200 bg-white lg:col-span-2" />
        <div className="h-72 rounded-xl border border-zinc-200 bg-white" />
      </div>
    </div>
  );
}
