import Link from "next/link";
import { Timer, Flame, Leaf, Play } from "lucide-react";

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
  return (
    <div className="min-h-screen bg-background px-6 py-16 text-foreground lg:px-12">
      <header className="mx-auto flex w-full max-w-6xl flex-col gap-6 pb-12 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="link-pill w-fit">xenotime dashboard</p>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight">Welcome back—ready for a deep session?</h1>
          <p className="text-(--accent-soft)">
            Start a Pomodoro, monitor your streak, and stay in tune with a calm, premium workspace.
          </p>
        </div>
        <Link className="cta-button" href="/">
          Customize timers
        </Link>
      </header>

      <section className="mx-auto grid w-full max-w-6xl gap-6 md:grid-cols-3">
        {stats.map((stat) => (
          <article key={stat.label} className="surface-card space-y-3 p-6">
            <div className="link-pill w-fit">
              <stat.icon size={16} />
              {stat.label}
            </div>
            <p className="text-3xl font-semibold">{stat.value}</p>
            <p className="text-(--accent-soft)">{stat.caption}</p>
          </article>
        ))}
      </section>

      <section className="mx-auto mt-12 w-full max-w-6xl">
        <div className="surface-card flex flex-col gap-8 p-10 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="link-pill w-fit">Pomodoro preset</p>
            <h2 className="mt-4 text-3xl font-semibold">Classic 25 • 5 tempo</h2>
            <p className="text-(--accent-soft)">
              Lock into 25 minutes of flow with mindful, five-minute breaks. Adjust presets soon.
            </p>
          </div>
          <button className="cta-button" type="button">
            <Play size={18} />
            Start Session
          </button>
        </div>
      </section>
    </div>
  );
}
