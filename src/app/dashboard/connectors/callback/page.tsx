"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

const API_BASE = (() => {
  const fromEnv = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (fromEnv) {
    return `${fromEnv.replace(/\/$/, "")}/api`;
  }
  return process.env.NODE_ENV === "development"
    ? "http://localhost:8000/api"
    : "/api";
})();

type CallbackState = "processing" | "success" | "error";

export default function OAuthCallbackPage() {
  const searchParams = useSearchParams();
  const [state, setState] = useState<CallbackState>("processing");
  const [message, setMessage] = useState("Processing authentication...");

  useEffect(() => {
    const code = searchParams.get("code");
    const connectorId = searchParams.get("state");

    if (!code || !connectorId) {
      setState("error");
      setMessage("Missing authorization code or connector ID.");
      return;
    }

    async function exchangeCode() {
      try {
        const res = await fetch(
          `${API_BASE}/connectors/${connectorId}/auth-callback`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
            signal: AbortSignal.timeout(15000),
          },
        );

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.detail || `HTTP ${res.status}`);
        }

        setState("success");
        setMessage("Connector authenticated successfully.");
      } catch (err) {
        setState("error");
        setMessage(
          err instanceof Error ? err.message : "Authentication failed.",
        );
      }
    }

    exchangeCode();
  }, [searchParams]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center animate-fade-in">
      <Card className="w-full max-w-md border-zinc-200 shadow-sm rounded-xl">
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
          {state === "processing" && (
            <Loader2 className="size-10 animate-spin text-zinc-400" />
          )}
          {state === "success" && (
            <CheckCircle2 className="size-10 text-emerald-500" />
          )}
          {state === "error" && (
            <XCircle className="size-10 text-red-500" />
          )}

          <h2 className="text-lg font-semibold text-zinc-900">
            {state === "processing"
              ? "Connecting..."
              : state === "success"
                ? "Connected"
                : "Connection Failed"}
          </h2>

          <p className="text-sm text-zinc-500">{message}</p>

          {state !== "processing" && (
            <Button
              variant="outline"
              className="mt-2"
              onClick={() =>
                (window.location.href = "/dashboard/connectors")
              }
            >
              Back to Connectors
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
