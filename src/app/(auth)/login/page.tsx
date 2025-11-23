"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { LogIn, Loader2, ArrowRight } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabaseClient";

const supabase = getSupabaseClient();

type StatusState =
  | { state: "idle" }
  | { state: "loading" }
  | { state: "success"; message: string }
  | { state: "error"; message: string };

export default function LoginPage() {
  const [status, setStatus] = useState<StatusState>({ state: "idle" });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus({ state: "loading" });

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setStatus({ state: "error", message: error.message });
      return;
    }

    setStatus({ state: "success", message: "Signed in. Redirecting..." });
  };

  return (
    <div className="auth-shell">
      <div>
        <div className="link-pill w-fit">
          <LogIn size={16} />
          Welcome back
        </div>
        <h2 className="mt-4 text-2xl font-semibold">Log in to xenotime</h2>
        <p className="text-(--accent-soft)">
          Pick up where you left off—your timers, streaks, and study rituals are ready.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="input-shell">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" placeholder="you@example.com" required />
        </div>

        <div className="input-shell">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" placeholder="••••••••" required />
        </div>

        <div className="form-actions">
          <button className="cta-button" type="submit" disabled={status.state === "loading"}>
            {status.state === "loading" ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Signing in
              </>
            ) : (
              <>
                Enter workspace
                <ArrowRight size={18} />
              </>
            )}
          </button>
          <Link className="secondary-link" href="/register">
            Need an account? Join xenotime →
          </Link>
          <Link className="secondary-link" href="/forgot-password">
            Forgot password?
          </Link>
        </div>

        {status.state === "error" && <p className="status-text error">{status.message}</p>}
        {status.state === "success" && <p className="status-text success">{status.message}</p>}
      </form>
    </div>
  );
}
