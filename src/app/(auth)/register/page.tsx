"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Sparkles, Loader2, ArrowRight } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabaseClient";

const supabase = getSupabaseClient();

type StatusState =
  | { state: "idle" }
  | { state: "loading" }
  | { state: "success"; message: string }
  | { state: "error"; message: string };

export default function RegisterPage() {
  const [status, setStatus] = useState<StatusState>({ state: "idle" });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus({ state: "loading" });

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));
    const fullName = String(formData.get("fullName"));

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      setStatus({ state: "error", message: error.message });
      return;
    }

    setStatus({
      state: "success",
      message: "Check your inbox to confirm your account. We will redirect you once verified.",
    });
  };

  return (
    <div className="auth-shell">
      <div>
        <div className="link-pill w-fit">
          <Sparkles size={16} />
          New to xenotime
        </div>
        <h2 className="mt-4 text-2xl font-semibold">Create your study HQ</h2>
        <p className="text-(--accent-soft)">
          Streak tracking, mindful breaks, and premium Pomodoro presets—crafted for calm productivity.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="input-shell">
          <label htmlFor="fullName">Full name</label>
          <input id="fullName" name="fullName" type="text" placeholder="Ada Lovelace" required />
        </div>

        <div className="input-shell">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" placeholder="you@example.com" required />
        </div>

        <div className="input-shell">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" placeholder="Create a password" required />
        </div>

        <div className="form-actions">
          <button className="cta-button" type="submit" disabled={status.state === "loading"}>
            {status.state === "loading" ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Creating workspace
              </>
            ) : (
              <>
                Join xenotime
                <ArrowRight size={18} />
              </>
            )}
          </button>
          <Link className="secondary-link" href="/login">
            Already have an account? Sign in
          </Link>
        </div>

        {status.state === "error" && <p className="status-text error">{status.message}</p>}
        {status.state === "success" && <p className="status-text success">{status.message}</p>}
      </form>
    </div>
  );
}
