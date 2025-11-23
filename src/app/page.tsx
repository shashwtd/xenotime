import Link from "next/link";
import { ArrowRight, BarChart3, Layers, Notebook, Clock } from "lucide-react";

const highlights = [
  {
    icon: Layers,
    title: "Group timers",
    copy: "Stack work, review, and cool-down intervals so every study block has a clear cadence.",
  },
  {
    icon: Notebook,
    title: "Custom subjects",
    copy: "Color-code playlists of readings, labs, or essays and watch them auto-roll into your queue.",
  },
  {
    icon: BarChart3,
    title: "Daily overview",
    copy: "Detailed stats dig into focus time, recovery, and streak momentum with richer insights on the way.",
  },
];

export default function Home() {
  return (
  <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-16 px-6 py-20 lg:flex-row lg:items-center lg:px-12">
        <section className="flex-1 space-y-8">
          <div className="flex items-center gap-3.5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-[#e07122] via-[#e6a448] to-[#ff6a00] shadow-[0_8px_20px_-8px_rgba(15,10,6,0.3)]">
              <Clock size={32} strokeWidth={2.2} className="text-white opacity-80" />
            </div>
            <div>
              <p className="text-2xl font-semibold tracking-tight text-foreground">xenotime</p>
              <p className="text-xs font-semibold uppercase tracking-wide text-(--accent-soft)">study tracker</p>
            </div>
          </div>
          <div className="space-y-6">
            <h1 className="text-5xl font-semibold tracking-[-0.035em]">
              Pomodoro rituals for calm, confident study sprints.
            </h1>
            <p className="text-(--accent-soft)">
              xenotime keeps every session orchestrated—from gentle pre-focus cues to restorative breaks—so you can
              build streaks without burning out.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-(--accent) px-7 py-4 text-lg font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 focus-visible:ring-2 focus-visible:ring-[rgba(242,178,107,0.65)] focus-visible:ring-offset-2"
              href="/register"
              style={{ color: "#ffffff" }}
            >
              Start free
              <ArrowRight size={18} className="group-hover:translate-x-1 duration-200" />
            </Link>
            <Link
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#2f2b3233] bg-white/70 px-6 py-4 font-semibold text-(--accent) transition-all duration-200 hover:-translate-y-0.5 hover:border-(--accent) hover:bg-white focus-visible:ring-2 focus-visible:ring-[rgba(242,178,107,0.45)] focus-visible:ring-offset-2"
              href="/login"
            >
              Login to Workspace
            </Link>
          </div>
          <p className="text-sm text-(--accent-soft)">
            Need a hand? Email support@xenotime.app and we&apos;ll sort it out fast.
          </p>
        </section>

        <section className="flex-1 space-y-8 rounded-3xl border border-black/5 bg-linear-to-br from-white to-[#fef9f2] p-10 shadow-[0_25px_55px_-35px_rgba(15,10,6,0.35)]">
          <div>
            <h2 className="mt-4 text-3xl font-semibold">Group timers, custom subjects, detailed stats, and more in one calm view.</h2>
            <p className="text-(--accent-soft)">
              This is xenotime&apos;s own briefing room: it surfaces what matters now, keeps tomorrow queued up, and
              grows with every ritual you add.
            </p>
          </div>
          <div className="space-y-6">
            {highlights.map((highlight) => (
              <article key={highlight.title} className="flex gap-5">
                <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-black/6 bg-linear-to-br from-white to-(--accent-warm-soft) text-(--accent) shadow-[0_8px_16px_-12px_rgba(0,0,0,0.35)]">
                  <highlight.icon size={18} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{highlight.title}</h3>
                  <p className="text-(--accent-soft)">{highlight.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
