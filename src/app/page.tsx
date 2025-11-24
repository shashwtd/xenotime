"use client";

import Link from "next/link";
import { ArrowRight, BarChart3, Layers, Notebook, Clock } from "lucide-react";
import { motion, Variants } from "framer-motion";

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

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-16 px-6 py-20 lg:flex-row lg:items-center lg:px-12">
        <motion.section 
          className="flex-1 space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="flex items-center gap-3.5 select-none">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-[#e07122] via-[#e6a448] to-[#ff6a00] shadow-[0_8px_20px_-8px_rgba(15,10,6,0.3)]">
              <Clock size={32} strokeWidth={2.2} className="text-white opacity-80" />
            </div>
            <div>
              <p className="text-2xl font-semibold tracking-tight text-foreground">xenotime</p>
              <p className="text-xs font-semibold uppercase tracking-wide text-(--accent-soft)">study tracker</p>
            </div>
          </motion.div>
          
          <div className="space-y-4">
            <motion.h1 variants={itemVariants} className="font-serif text-4xl font-medium tracking-tight leading-[1.1]">
              Pomodoro rituals for calm, confident study sprints.
            </motion.h1>
            <motion.p variants={itemVariants} className="text-md text-(--accent-soft) max-w-sm leading-relaxed">
              xenotime keeps every session orchestrated—from gentle pre-focus cues to restorative breaks—so you can
              build streaks without burning out.
            </motion.p>
          </div>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 select-none">
            <Link
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-(--accent) px-7 py-3 text-lg font-semibold text-white transition-all duration-200 hover:bg-(--accent)/90 hover:shadow-lg hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[rgba(242,178,107,0.65)] focus-visible:ring-offset-2"
              href="/register"
              style={{ color: "#ffffff" }}
            >
              Start free
              <ArrowRight size={18} className="group-hover:translate-x-1 duration-200" />
            </Link>
            <Link
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white/80 px-6 py-3 font-semibold text-(--accent) transition-all duration-200 hover:bg-white hover:border-black/20 hover:shadow-sm hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[rgba(242,178,107,0.45)] focus-visible:ring-offset-2"
              href="/login"
            >
              Login to Workspace
            </Link>
          </motion.div>
          
          <motion.p variants={itemVariants} className="text-sm text-(--accent-soft)">
            Need a hand? Email <a href="mailto:support@xenotime.app" className="underline hover:text-foreground transition-colors">support@xenotime.app</a> and we&apos;ll sort it out fast.
          </motion.p>
        </motion.section>

        <motion.section 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
          className="flex-1 space-y-8 rounded-3xl border border-black/5 bg-linear-to-br from-white to-[#fef9f2] p-8 sm:p-10 shadow-[0_25px_55px_-35px_rgba(15,10,6,0.35)]"
        >
          <div>
            <h2 className="mt-2 font-serif text-3xl font-medium tracking-tight">Some Key Features</h2>
            <p className="mt-3 text-(--accent-soft) leading-relaxed">
              This is xenotime&apos;s own briefing room: it surfaces what matters now, keeps tomorrow queued up, and
              grows with every ritual you add.
            </p>
          </div>
          <div className="space-y-6">
            {highlights.map((highlight, index) => (
              <motion.article 
                key={highlight.title} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + (index * 0.15), duration: 0.5 }}
                className="flex gap-5 group select-none"
              >
                <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-black/6 bg-linear-to-br from-white to-(--accent-warm-soft) text-(--accent) shadow-[0_8px_16px_-12px_rgba(0,0,0,0.35)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <highlight.icon size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{highlight.title}</h3>
                  <p className="text-sm text-(--accent-soft) leading-relaxed mt-1">{highlight.copy}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.section>
      </main>
    </div>
  );
}
