"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowRight } from "lucide-react";
import { demoLogin, login as loginAPI } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDemo = async () => {
    setError("");
    setLoading(true);
    const result = await demoLogin();
    setLoading(false);
    if (result.ok) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setError(result.error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await loginAPI(email, password);
    setLoading(false);
    if (result.ok) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-xl font-semibold text-zinc-900">Analytics Pro</h1>
          <p className="text-sm text-zinc-500">Sign in to your account</p>
        </div>

        <Card className="border-zinc-200 shadow-sm rounded-xl animate-fade-in-scale">
          <CardContent className="p-6 space-y-4">
            <Button
              className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleDemo}
              disabled={loading}
            >
              Continue with Demo
              <ArrowRight className="size-4" />
            </Button>

            <div className="relative">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs text-zinc-400">
                or
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="border-zinc-200"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="border-zinc-200"
                />
              </div>
              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}
              <Button type="submit" variant="outline" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-zinc-500">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-700">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
