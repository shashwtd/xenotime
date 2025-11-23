import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center gap-16 px-6 py-16 lg:flex-row lg:items-center lg:px-12">
        <div className="max-w-lg space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-[#e07122] via-[#e6a448] to-[#ff6a00] shadow-lg">
              <Clock size={24} strokeWidth={2.2} className="text-white opacity-90" />
            </div>
            <div>
              <p className="text-xl font-semibold tracking-tight text-foreground">xenotime</p>
              <p className="text-xs font-medium text-(--accent-soft)">Focus rituals</p>
            </div>
          </div>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight">
            Set your rhythm, stay in flow.
          </h1>
          <p className="text-lg text-(--accent-soft)">
            Portable Pomodoro guidance, gentle reminders, and streak tracking. Sign in to keep your timers synced across every study session.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-(--accent-soft) transition-colors hover:text-(--accent)"
          >
            <ArrowLeft size={16} />
            Back to home
          </Link>
        </div>
        <section className="w-full max-w-md rounded-3xl border border-black/5 bg-white/95 p-8 shadow-[0_25px_55px_-35px_rgba(15,10,6,0.35)]">
          {children}
        </section>
      </div>
    </div>
  );
}
