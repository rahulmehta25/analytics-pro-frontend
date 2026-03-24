"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="max-w-md w-full border-zinc-200 shadow-sm">
        <CardContent className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex size-12 items-center justify-center rounded-full bg-red-50">
              <AlertCircle className="size-6 text-red-500" />
            </div>
          </div>

          <h2 className="text-lg font-semibold text-zinc-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-sm text-zinc-500 mb-6">
            We encountered an error loading this page. This might be a temporary issue.
          </p>

          {error.digest && (
            <p className="text-xs text-zinc-400 mb-4 font-mono">
              Error ID: {error.digest}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button
              onClick={reset}
              className="gap-2 bg-zinc-900 text-white hover:bg-zinc-800"
            >
              <RefreshCw className="size-4" />
              Try again
            </Button>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
            >
              <Home className="size-4" />
              Go to Dashboard
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
