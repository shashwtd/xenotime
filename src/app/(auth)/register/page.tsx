"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabaseClient";

const supabase = getSupabaseClient();

type Status = "idle" | "loading" | "success" | "error";

export default function RegisterPage() {
  const [googleStatus, setGoogleStatus] = useState<Status>("idle");
  const [emailStatus, setEmailStatus] = useState<Status>("idle");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const redirectTo = useMemo(() => {
    if (typeof window === "undefined") return undefined;
    return `${window.location.origin}/dashboard`;
  }, []);

  const handleGoogle = async () => {
    setGoogleStatus("loading");
    setMessage("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    });

    if (error) {
      setGoogleStatus("error");
      setMessage(error.message);
      return;
    }

    setGoogleStatus("success");
    setMessage("Redirecting to Google…");
  };

  const handleEmailInvite = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) {
      setEmailStatus("error");
      setMessage("Pop your email in first.");
      return;
    }
    setEmailStatus("loading");
    setMessage("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    if (error) {
      setEmailStatus("error");
      setMessage(error.message);
      return;
    }

    setEmailStatus("success");
    setMessage("Invite sent. Watch your inbox for the link.");
  };

  return (
    <div className="space-y-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-4">
        <p className="inline-flex items-center gap-2 text-sm font-medium text-(--accent-soft)">
          <Sparkles size={16} />
          Start something focused
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">Create your xenotime studio</h1>
        <p className="max-w-md text-base text-(--accent-soft)">
          Your playlists, rituals, and streaks live here. Sign up with Google or request a magic link and we’ll prep your workspace.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="space-y-6 rounded-3xl border border-black/5 bg-linear-to-br from-white via-[#fef9f2] to-[#fdeedd] p-8 shadow-[0_25px_55px_-35px_rgba(15,10,6,0.35)]"
      >
        <button
          type="button"
          onClick={handleGoogle}
          disabled={googleStatus === "loading"}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-(--accent) transition-colors hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {googleStatus === "loading" ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              Connecting…
            </>
          ) : (
            <>
              <Image src="/google-logo.svg" alt="" width={16} height={16} />
              Continue with Google
            </>
          )}
        </button>

        <div className="flex items-center gap-4 text-xs font-medium text-(--accent-soft)/70">
          <span className="h-px flex-1 bg-black/10" />
          or
          <span className="h-px flex-1 bg-black/10" />
        </div>

        <form onSubmit={handleEmailInvite} className="space-y-3">
          <label htmlFor="signup-email" className="text-sm font-medium text-(--accent)">
            Email address
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="flex-1 rounded-2xl border border-black/10 bg-white/90 px-4 py-3 text-(--accent) shadow-inner shadow-black/5 focus:border-(--accent) focus:outline-none focus:ring-2 focus:ring-[rgba(242,178,107,0.35)]"
              required
            />
            <button
              type="submit"
              disabled={emailStatus === "loading"}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-(--accent) px-6 py-3 font-semibold text-white transition-colors duration-200 hover:bg-(--accent)/90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {emailStatus === "loading" ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Sending
                </>
              ) : (
                "Email me an invite"
              )}
            </button>
          </div>
        </form>

        {message && (
          <p className={`text-sm ${emailStatus === "error" || googleStatus === "error" ? "text-red-600" : "text-(--accent-soft)"}`}>
            {message}
          </p>
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
        <p className="text-sm text-(--accent-soft)">
          Already in the flow?{" "}
          <Link className="font-semibold text-(--accent) underline decoration-1 underline-offset-2" href="/login">
            Head to login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
