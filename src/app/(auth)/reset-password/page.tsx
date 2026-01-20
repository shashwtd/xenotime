"use client";

import { FormEvent, useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, Lock } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabaseClient";

const supabase = getSupabaseClient();

type Status = "idle" | "loading" | "success" | "error";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<Status>("idle");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSessionValid, setIsSessionValid] = useState(false);

  useEffect(() => {
    const handleSession = async () => {
      const code = searchParams.get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setStatus("error");
          setMessage("Invalid or expired reset link.");
        } else {
          setIsSessionValid(true);
        }
      } else {
        // Check if we already have a session (e.g. implicit flow or already logged in)
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          setIsSessionValid(true);
        } else {
          setStatus("error");
          setMessage("No reset code found. Please request a new link.");
        }
      }
    };

    handleSession();
  }, [searchParams]);

  const handleUpdatePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "loading") return;
    
    if (!password) {
      setStatus("error");
      setMessage("Please enter a new password.");
      return;
    }
    setStatus("loading");
    setMessage("");

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }

    setStatus("success");
    setMessage("Password updated successfully! Redirecting...");
    setTimeout(() => {
      router.push("/dashboard");
    }, 2000);
  };

  if (!isSessionValid && status !== "error") {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin text-(--accent-soft)" size={24} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full space-y-6"
    >
      <div className="space-y-1.5 text-center sm:text-left">
        <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground">Set new password</h2>
        <p className="text-sm text-(--accent-soft)">
          Enter your new password below.
        </p>
      </div>

      {status === "error" && !isSessionValid ? (
        <div className="space-y-4">
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">
            {message}
          </div>
          <Link 
            href="/forgot-password"
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-(--accent) px-4 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-(--accent)/90"
          >
            Request new link
          </Link>
        </div>
      ) : (
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="password" className="sr-only">New Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-(--accent-soft)">
                <Lock size={18} />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="New Password"
                disabled={status === "loading" || status === "success"}
                className="block w-full rounded-xl border border-black/10 bg-white pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-(--accent-soft)/60 focus:border-(--accent)/60 focus:outline-none focus:ring-2 focus:ring-(--accent)/30 disabled:cursor-not-allowed disabled:opacity-60 transition-colors"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-(--accent) px-4 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-(--accent)/90 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-(--accent) focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {status === "loading" ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <span>Update password</span>
            )}
          </button>
        </form>
      )}

      {message && isSessionValid && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-lg p-3 text-sm ${
          status === "error"
            ? "bg-red-50 text-red-600 border border-red-100"
            : "bg-green-50 text-green-600 border border-green-100"
        }`}>
          {message}
        </motion.div>
      )}
    </motion.div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin text-(--accent-soft)" size={24} />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
