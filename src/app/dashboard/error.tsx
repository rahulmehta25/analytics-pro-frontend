"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6">
      <h2 className="text-base font-semibold text-zinc-900">Dashboard failed to load</h2>
      <p className="mt-2 text-sm text-zinc-600">
        Try loading this section again.
      </p>
      <Button className="mt-4" onClick={reset}>
        Retry
      </Button>
    </div>
  );
}
