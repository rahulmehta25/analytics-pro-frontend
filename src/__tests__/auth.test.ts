import { describe, it, expect, beforeEach, vi } from "vitest";
import { setAuth, clearAuth, getToken, getEmail } from "@/lib/auth";

describe("auth helpers", () => {
  beforeEach(() => {
    localStorage.clear();
    document.cookie = "auth_token=; path=/; max-age=0";
  });

  it("setAuth stores token and email", () => {
    setAuth("tok123", "user@example.com");
    expect(localStorage.getItem("auth_token")).toBe("tok123");
    expect(localStorage.getItem("auth_email")).toBe("user@example.com");
    expect(document.cookie).toContain("auth_token=tok123");
  });

  it("getToken returns stored token", () => {
    localStorage.setItem("auth_token", "abc");
    expect(getToken()).toBe("abc");
  });

  it("getToken returns null when empty", () => {
    expect(getToken()).toBeNull();
  });

  it("getEmail returns stored email", () => {
    localStorage.setItem("auth_email", "a@b.com");
    expect(getEmail()).toBe("a@b.com");
  });

  it("clearAuth removes all auth state", () => {
    setAuth("tok", "e@e.com");
    clearAuth();
    expect(localStorage.getItem("auth_token")).toBeNull();
    expect(localStorage.getItem("auth_email")).toBeNull();
    expect(document.cookie).not.toContain("auth_token=tok");
  });
});

describe("login", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns ok on success", async () => {
    const { login } = await import("@/lib/auth");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ token: "t1", email: "u@e.com" }),
      }),
    );
    const result = await login("u@e.com", "pw");
    expect(result).toEqual({ ok: true, token: "t1", email: "u@e.com" });
  });

  it("returns error on 401", async () => {
    const { login } = await import("@/lib/auth");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ detail: "Bad creds" }),
      }),
    );
    const result = await login("u@e.com", "wrong");
    expect(result).toEqual({ ok: false, error: "Bad creds" });
  });

  it("returns network error on fetch failure", async () => {
    const { login } = await import("@/lib/auth");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network")));
    const result = await login("u@e.com", "pw");
    expect(result).toEqual({ ok: false, error: "Unable to connect to server" });
  });
});
