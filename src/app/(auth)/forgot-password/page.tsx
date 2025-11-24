"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabaseClient";

const supabase = getSupabaseClient();

type Status = "idle" | "loading" | "success" | "error";

export default function ForgotPasswordPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "loading") return;
    
    if (!email) {
      setStatus("error");
      setMessage("Please enter your email address.");
      return;
    }
    setStatus("loading");
    setMessage("");

    const redirectTo = `${window.location.origin}/reset-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }

    setStatus("success");
    setMessage("Check your email for the password reset link.");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full space-y-6"
    >
      <div className="space-y-1.5 text-center sm:text-left">
        <Link 
          href="/login" 
          className="mb-6 inline-flex items-center gap-1 text-xs font-medium text-(--accent-soft) hover:text-foreground transition-colors"
        >
          <ArrowLeft size={12} />
          Back to login
        </Link>
        <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground">Reset password</h2>
        <p className="text-sm text-(--accent-soft)">
          Enter your email to receive a reset link.
        </p>
      </div>

      <form onSubmit={handleReset} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="sr-only">Email address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-(--accent-soft)">
              <Mail size={18} />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
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
            <span>Send reset link</span>
          )}
        </button>
      </form>

      {message && (
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
