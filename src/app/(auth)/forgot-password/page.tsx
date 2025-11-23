"use client";

import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-black/10 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-(--accent-soft)">
          <Mail size={14} />
          Passwordless access
        </div>
        <h2 className="text-3xl font-semibold">No reset link needed</h2>
        <p className="text-(--accent-soft)">
          xenotime authenticates exclusively through Google, so there are no passwords to manage or recover. Use the
          same Google account you started with and you&apos;re back in immediately.
        </p>
      </div>

      <div className="space-y-4 rounded-2xl border border-black/5 bg-white/80 p-6 text-sm text-(--accent-soft)">
        <p>
          If you&apos;re having trouble accessing that Google account, follow Google&apos;s recovery steps or drop us a note
          and we&apos;ll help fast.
        </p>
        <a className="inline-flex items-center gap-2 font-semibold text-(--accent) underline" href="mailto:support@xenotime.app">
          Email support@xenotime.app
          <ArrowRight size={16} />
        </a>
      </div>

      <div>
        <Link
          className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-6 py-3 font-semibold text-(--accent) transition hover:-translate-y-0.5"
          href="/login"
        >
          ← Back to login
        </Link>
      </div>
    </div>
  );
}
