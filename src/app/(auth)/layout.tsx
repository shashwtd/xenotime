import type { ReactNode } from "react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center gap-16 px-6 py-16 lg:flex-row lg:items-center lg:px-12">
        <div className="max-w-lg space-y-6">
          <span className="link-pill">xenotime · deep focus rituals</span>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight">
            Set your rhythm, stay in flow.
          </h1>
          <p className="text-lg text-[var(--accent-soft)]">
            Portable Pomodoro guidance, gentle reminders, and streak tracking.
            Sign in to keep your timers synced across every study session.
          </p>
          <div className="flex gap-4">
            <Link className="cta-button" href="/">
              ← Back home
            </Link>
            <Link className="link-pill" href="/dashboard">
              Explore dashboard
            </Link>
          </div>
        </div>
        <section className="surface-card w-full max-w-md p-8">
          {children}
        </section>
      </div>
    </div>
  );
}
