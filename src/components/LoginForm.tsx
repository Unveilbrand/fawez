"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase/client";

const field =
  "w-full rounded-md bg-[#F3F8FF] px-4 py-3.5 text-sm text-black placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-primary/40";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "").trim().toLowerCase();
    const password = String(form.get("password") ?? "");

    try {
      const supabase = getSupabaseBrowser();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (authError) {
        setError(authError.message);
        return;
      }

      const res = await fetch("/api/auth/admin-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const { isAdmin } = await res.json();

      router.push(isAdmin ? "/admin" : "/");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-[420px] rounded-2xl bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.08)] sm:p-8"
    >
      <h2 className="text-2xl font-bold text-black">Welcome back</h2>
      <p className="mt-1 text-sm text-black">Sign in to your account to continue.</p>

      <div className="mt-6">
        <label htmlFor="login-email" className="mb-2 block text-sm font-medium text-black">
          Email*
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className={field}
        />
      </div>
      <div className="mt-5">
        <label htmlFor="login-password" className="mb-2 block text-sm font-medium text-black">
          Password*
        </label>
        <input
          id="login-password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="Your password"
          className={field}
        />
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-md bg-primary py-4 text-sm font-bold uppercase text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
      >
        {loading ? "Signing in..." : "Login"}
      </button>
    </form>
  );
}
