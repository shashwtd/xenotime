"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, Loader2 } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabaseClient";

const supabase = getSupabaseClient();

type StatusState =
  | { state: "idle" }
  | { state: "loading" }
  | { state: "success"; message: string }
  | { state: "error"; message: string };

export default function ForgotPasswordPage() {
  const [status, setStatus] = useState<StatusState>({ state: "idle" });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus({ state: "loading" });

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email"));

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });

    if (error) {
      setStatus({ state: "error", message: error.message });
      return;
    }

    setStatus({
      state: "success",
      message: "Magic link sent. Check your inbox to finish resetting your password.",
    });
  };

  return (
    <div className="auth-shell">
      <div>
        <div className="link-pill w-fit">
          <Mail size={16} />
          Reset access
        </div>
        <h2 className="mt-4 text-2xl font-semibold">Send a reset link</h2>
        <p className="text-(--accent-soft)">
          We will email you a secure link to update your credentials and get back into flow.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="input-shell">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" placeholder="you@example.com" required />
        </div>

        <div className="form-actions">
          <button className="cta-button" type="submit" disabled={status.state === "loading"}>
            {status.state === "loading" ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Sending link
              </>
            ) : (
              <>
                Email reset link
                <ArrowRight size={18} />
              </>
            )}
          </button>
          <Link className="secondary-link" href="/login">
            Back to sign in
          </Link>
        </div>

        {status.state === "error" && <p className="status-text error">{status.message}</p>}
        {status.state === "success" && <p className="status-text success">{status.message}</p>}
      </form>
    </div>
  );
}
