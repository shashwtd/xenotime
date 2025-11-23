import Link from "next/link";
import { Clock3, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";

const highlights = [
  {
    icon: Clock3,
    title: "Pomodoro without friction",
    copy: "Preset timers inspired by study science keep you gently in rhythm.",
  },
  {
    icon: ShieldCheck,
    title: "Grounded breaks",
    copy: "Micro-reflection prompts help you reset instead of doom-scroll.",
  },
  {
    icon: Sparkles,
    title: "Premium calm",
    copy: "Claude-inspired visuals and soft audio cues lift the entire experience.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-16 px-6 py-20 lg:flex-row lg:items-center lg:px-12">
        <section className="flex-1 space-y-8">
          <span className="link-pill w-fit">xenotime · Pomodoro study timer</span>
          <div className="space-y-6">
            <h1 className="text-5xl font-semibold leading-tight tracking-tight">
              Premium focus rituals for calm, unstoppable study streaks.
            </h1>
            <p className="text-(--accent-soft)">
              xenotime helps you glide through deep work with intentional Pomodoro sessions, gentle breaks, and a
              dashboard that actually feels like a sanctuary.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link className="cta-button" href="/register">
              Start free
              <ArrowRight size={18} />
            </Link>
            <Link className="link-pill" href="/login">
              I already have an account
            </Link>
          </div>
          <p className="text-sm text-(--accent-soft)">
            Need to skip ahead? <Link href="/dashboard">Open the dashboard</Link> • Looking for support? Email us anytime.
          </p>
        </section>

        <section className="surface-card flex-1 space-y-8 p-10">
          <div>
            <p className="link-pill w-fit">Pomodoro study timer</p>
            <h2 className="mt-4 text-3xl font-semibold">What makes xenotime special?</h2>
            <p className="text-(--accent-soft)">
              Inspired by Anthropic's soft, premium palette—built for clarity and warmth.
            </p>
          </div>
          <div className="space-y-6">
            {highlights.map((highlight) => (
              <article key={highlight.title} className="flex gap-4">
                <div className="link-pill h-fit w-fit">
                  <highlight.icon size={16} />
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
