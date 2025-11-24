"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Loader2, Mail, Lock } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

const supabase = getSupabaseClient();

type Status = "idle" | "loading" | "success" | "error";

export default function LoginPage() {
  const router = useRouter();
  const [googleStatus, setGoogleStatus] = useState<Status>("idle");
  const [emailStatus, setEmailStatus] = useState<Status>("idle");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const redirectTo = useMemo(() => {
    if (typeof window === "undefined") return undefined;
    return `${window.location.origin}/dashboard`;
  }, []);

  const isLoading = googleStatus === "loading" || emailStatus === "loading";

  const handleGoogle = async () => {
    if (isLoading) return;
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

  const handleEmailLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading) return;
    
    if (!email || !password) {
      setEmailStatus("error");
      setMessage("Please enter both email and password.");
      return;
    }
    setEmailStatus("loading");
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setEmailStatus("error");
      setMessage(error.message);
      return;
    }

    setEmailStatus("success");
    setMessage("Signed in successfully!");
    router.push("/dashboard");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full space-y-6"
    >
      <div className="space-y-1.5 text-center sm:text-left">
        <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground">Welcome back</h2>
        <p className="text-sm text-(--accent-soft)">
          Enter your credentials to access your workspace.
        </p>
      </div>

      <div className="space-y-4">
        <button
          type="button"
          onClick={handleGoogle}
          disabled={isLoading}
          className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-medium text-foreground shadow-sm transition-all hover:bg-gray-50 hover:border-black/20 focus:outline-none focus:ring-2 focus:ring-(--accent-warm) focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {googleStatus === "loading" ? (
            <Loader2 className="animate-spin text-(--accent-soft)" size={18} />
          ) : (
            <Image src="/google-logo.svg" alt="Google" width={18} height={18} />
          )}
          <span>Continue with Google</span>
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-black/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-(--accent-soft)">Or</span>
          </div>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div className="space-y-4">
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
                  disabled={isLoading}
                  className="block w-full rounded-xl border border-black/10 bg-white pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-(--accent-soft)/60 focus:border-(--accent)/60 focus:outline-none focus:ring-2 focus:ring-(--accent)/30 disabled:cursor-not-allowed disabled:opacity-60 transition-colors"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="sr-only">Password</label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-(--accent-soft)">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Password"
                  disabled={isLoading}
                  className="block w-full rounded-xl border border-black/10 bg-white pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-(--accent-soft)/60 focus:border-(--accent)/60 focus:outline-none focus:ring-2 focus:ring-(--accent)/30 disabled:cursor-not-allowed disabled:opacity-60 transition-colors"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <Link 
              href="/forgot-password" 
              className="text-xs font-medium text-(--accent-soft) hover:text-foreground transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-(--accent) px-4 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-(--accent)/90 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-(--accent) focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {emailStatus === "loading" ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <span>Sign in</span>
            )}
          </button>
        </form>

        {message && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-lg p-3 text-sm ${
            emailStatus === "error" || googleStatus === "error" 
              ? "bg-red-50 text-red-600 border border-red-100" 
              : "bg-green-50 text-green-600 border border-green-100"
          }`}>
            {message}
          </motion.div>
        )}
      </div>

      <p className="text-center text-sm text-(--accent-soft)">
        Don&apos;t have an account?{" "}
        <Link className="font-semibold text-foreground hover:underline decoration-2 underline-offset-2 transition-all" href="/register">
          Sign up
        </Link>
      </p>
    </motion.div>
  );
}
