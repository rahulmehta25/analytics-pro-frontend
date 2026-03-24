import { createClient } from "@/lib/supabase/client";

export type AuthResult =
  | { ok: true; token: string; email: string }
  | { ok: false; error: string };

export async function login(email: string, password: string): Promise<AuthResult> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  return {
    ok: true,
    token: data.session.access_token,
    email: data.user.email ?? email,
  };
}

export async function signup(email: string, password: string): Promise<AuthResult> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  if (!data.session) {
    // Email confirmation required
    return { ok: false, error: "Check your email to confirm your account." };
  }

  return {
    ok: true,
    token: data.session.access_token,
    email: data.user?.email ?? email,
  };
}

export async function demoLogin(): Promise<AuthResult> {
  // Demo login uses a known demo account in Supabase
  return login("demo@analyticspro.com", "DemoPassword123!");
}

export async function logout(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
}

export async function getSession() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function getUser() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export function getToken(): string | null {
  // Legacy compat - use getSession() instead for new code
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

export function getEmail(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_email");
}

export function setAuth(token: string, email: string) {
  // Legacy compat - Supabase manages tokens via cookies now
  localStorage.setItem("auth_token", token);
  localStorage.setItem("auth_email", email);
}

export function clearAuth() {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("auth_email");
}
