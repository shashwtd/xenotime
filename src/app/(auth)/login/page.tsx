"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Loader2, Mail } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabaseClient";

const supabase = getSupabaseClient();

type Status = "idle" | "loading" | "success" | "error";

export default function LoginPage() {
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

  const handleEmailLink = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) {
      setEmailStatus("error");
      setMessage("Enter your email first.");
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
    setMessage("Magic link sent. Check your inbox.");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Welcome back</h1>
        <p className="text-sm text-(--accent-soft)">
          Pick up where you left off
        </p>
      </div>

      <div className="space-y-4">
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

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-black/10" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-background px-2 text-(--accent-soft)">or</span>
          </div>
        </div>

        <form onSubmit={handleEmailLink} className="space-y-2">
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-(--accent) placeholder:text-(--accent-soft)/40 focus:border-(--accent) focus:outline-none focus:ring-1 focus:ring-(--accent-warm)/20"
            required
          />
          <button
            type="submit"
            disabled={emailStatus === "loading"}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-(--accent) px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-(--accent)/90 disabled:cursor-not-allowed disabled:opacity-60"
            style={{ color: "#ffffff" }}
          >
            {emailStatus === "loading" ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Sending…
              </>
            ) : (
              <>
                <Mail size={16} />
                Email me a link
              </>
            )}
          </button>
        </form>

        {message && (
          <p className={`text-sm ${emailStatus === "error" || googleStatus === "error" ? "text-red-600" : "text-(--accent-soft)"}`}>
            {message}
          </p>
        )}
      </div>

      <p className="text-sm text-(--accent-soft)">
        Need an account?{" "}
        <Link className="font-medium text-(--accent) underline underline-offset-2" href="/register">
          Sign up
        </Link>
      </p>
    </motion.div>
  );
}
