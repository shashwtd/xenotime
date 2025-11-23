"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Timer, Flame, Leaf, Play } from "lucide-react";
import { useAuth } from "@/components/auth-context";

const stats = [
  {
    icon: Timer,
    label: "Today's Focus",
    value: "3 sessions",
    caption: "150 minutes logged",
  },
  {
    icon: Flame,
    label: "Streak",
    value: "Day 12",
    caption: "Keep the chain alive",
  },
  {
    icon: Leaf,
    label: "Break Quality",
    value: "Calm",
    caption: "Rested and ready",
  },
];

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-(--accent-soft)">
        Checking your session…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-6 py-16 text-foreground lg:px-12">
      <header className="mx-auto flex w-full max-w-6xl flex-col gap-6 pb-12 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="inline-flex w-fit items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-(--accent-soft)">
            xenotime dashboard
          </p>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight">Welcome back—ready for a deep session?</h1>
          <p className="text-(--accent-soft)">
            Start a Pomodoro, monitor your streak, and stay in tune with a calm, premium workspace.
          </p>
        </div>
        <Link
          className="inline-flex items-center justify-center gap-2 rounded-full bg-(--accent) px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:brightness-110"
          href="/"
        >
          Customize timers
        </Link>
      </header>

      <section className="mx-auto grid w-full max-w-6xl gap-6 md:grid-cols-3">
        {stats.map((stat) => (
          <article key={stat.label} className="rounded-3xl border border-black/5 bg-white/95 p-6 shadow-[0_18px_40px_-30px_rgba(15,10,6,0.35)]">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-(--accent-soft)">
              <stat.icon size={14} />
              {stat.label}
            </div>
            <p className="mt-4 text-3xl font-semibold">{stat.value}</p>
            <p className="text-(--accent-soft)">{stat.caption}</p>
          </article>
        ))}
      </section>

      <section className="mx-auto mt-12 w-full max-w-6xl">
        <div className="flex flex-col gap-8 rounded-3xl border border-black/5 bg-white/95 p-10 shadow-[0_25px_55px_-35px_rgba(15,10,6,0.35)] lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="inline-flex w-fit items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-(--accent-soft)">
              Pomodoro preset
            </p>
            <h2 className="mt-4 text-3xl font-semibold">Classic 25 • 5 tempo</h2>
            <p className="text-(--accent-soft)">
              Lock into 25 minutes of flow with mindful, five-minute breaks. Adjust presets soon.
            </p>
          </div>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-full bg-(--accent) px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:brightness-110"
            type="button"
          >
            <Play size={18} />
            Start Session
          </button>
        </div>
      </section>
    </div>
  );
}
