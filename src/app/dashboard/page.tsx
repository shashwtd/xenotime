"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Flame, LayoutDashboard, BarChart2, Settings, LogOut, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/auth-context";
import { Subject, DEFAULT_SUBJECTS } from "@/components/dashboard/types";
import { SubjectCard } from "@/components/dashboard/subject-card";
import { CreateSubjectModal } from "@/components/dashboard/create-subject-modal";
import { ActivityGraph } from "@/components/dashboard/activity-graph";
import { FocusTimer } from "@/components/dashboard/focus-timer";
import { Logo } from "@/components/logo";

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  
  const [subjects, setSubjects] = useState<Subject[]>(DEFAULT_SUBJECTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [activeSubject, setActiveSubject] = useState<Subject | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  const handleCreateSubject = (newSubject: Omit<Subject, "id" | "totalTime">) => {
    const subject: Subject = {
      ...newSubject,
      id: Math.random().toString(36).substr(2, 9),
      totalTime: 0,
    };
    setSubjects([...subjects, subject]);
  };

  const handleStopTimer = (elapsedSeconds: number) => {
    if (activeSubject) {
      setSubjects(subjects.map(s => 
        s.id === activeSubject.id 
          ? { ...s, totalTime: s.totalTime + elapsedSeconds }
          : s
      ));
    }
    setActiveSubject(null);
  };

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Scholar";

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-(--accent-soft)">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading your workspace...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#FAFAFA] text-foreground">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-20 hidden h-screen w-64 flex-col border-r border-black/5 bg-white px-6 py-8 lg:flex shadow-[1px_0_20px_0_rgba(0,0,0,0.02)]">
        <div className="mb-10">
          <Logo />
        </div>

        <nav className="flex-1 space-y-1">
          <button className="flex w-full items-center gap-3 rounded-xl bg-(--accent)/10 px-4 py-3 text-sm font-medium text-(--accent) transition-colors">
            <LayoutDashboard size={18} />
            Dashboard
          </button>
          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-(--accent-soft) transition-colors hover:bg-black/5 hover:text-foreground">
            <BarChart2 size={18} />
            Analytics
          </button>
          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-(--accent-soft) transition-colors hover:bg-black/5 hover:text-foreground">
            <Settings size={18} />
            Settings
          </button>
        </nav>

        <div className="border-t border-black/5 pt-6">
          <div className="flex items-center gap-3 mb-4 p-2 rounded-xl hover:bg-black/5 transition-colors cursor-pointer">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-(--accent-warm-soft) text-(--accent) font-serif font-bold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-foreground">{userName}</p>
              <p className="truncate text-xs text-(--accent-soft)">Free Plan</p>
            </div>
          </div>
          <button 
            onClick={() => signOut()}
            className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium text-(--accent-soft) hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        <div className="mx-auto max-w-6xl px-6 py-8 lg:px-12 lg:py-10">
          {/* Header */}
          <header className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-serif text-3xl font-medium tracking-tight text-foreground">
                Good morning, {userName}
              </h1>
              <div className="mt-2 flex items-center gap-2 text-sm text-(--accent-soft)">
                <Flame size={16} className="text-orange-500 fill-orange-500" />
                <span className="font-medium text-foreground">12 Day Streak</span>
                <span>•</span>
                <span>Ready to focus?</span>
              </div>
            </div>
            <button
              onClick={() => setIsStartModalOpen(true)}
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-black text-white px-6 py-3.5 text-sm font-medium shadow-lg shadow-black/20 transition-all hover:bg-black/80 hover:shadow-xl hover:-translate-y-0.5"
            >
              <Play size={18} fill="currentColor" />
              Start Focus
            </button>
          </header>

          {/* Stats Overview */}
          <section className="mb-12 grid gap-6 md:grid-cols-3">
            <div className="col-span-2">
              <ActivityGraph />
            </div>
            
            <div className="relative flex flex-col justify-center rounded-3xl bg-linear-to-br from-[#1a1a1a] to-[#000000] p-8 text-white shadow-xl h-full overflow-hidden group">
              <div className="absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 rounded-full bg-white/5 blur-3xl transition-all group-hover:bg-white/10"></div>
              <div className="absolute bottom-0 left-0 -mb-8 -ml-8 h-32 w-32 rounded-full bg-(--accent)/20 blur-3xl transition-all group-hover:bg-(--accent)/30"></div>
              
              <div className="relative z-10">
                <div className="mb-3 flex items-center gap-2 text-white/60">
                  <Flame size={18} className="text-(--accent)" />
                  <span className="text-sm font-medium uppercase tracking-wider">Total Focus</span>
                </div>
                <div className="font-variant-numeric text-6xl font-bold tracking-tight text-white">
                  {Math.floor(subjects.reduce((acc, s) => acc + s.totalTime, 0) / 60)}
                  <span className="text-2xl text-white/40 ml-1 font-medium">m</span>
                </div>
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 w-fit backdrop-blur-sm">
                  <span className="text-xs font-medium text-(--accent)">+12%</span>
                  <span className="text-xs text-white/60">vs yesterday</span>
                </div>
              </div>
            </div>
          </section>

          {/* Subjects Grid */}
          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Your Subjects</h2>
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-sm font-medium text-(--accent) hover:text-(--accent)/80 transition-colors"
              >
                + New Subject
              </button>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <AnimatePresence mode="popLayout">
                {subjects.map((subject) => (
                  <SubjectCard
                    key={subject.id}
                    subject={subject}
                    onStart={setActiveSubject}
                  />
                ))}
                
                {/* Add New Subject Card */}
                <motion.button
                  layout
                  onClick={() => setIsModalOpen(true)}
                  className="group relative flex flex-col items-center justify-center gap-3 overflow-hidden rounded-3xl border-2 border-dashed border-black/5 bg-transparent p-6 transition-all hover:border-(--accent)/30 hover:bg-(--accent)/5"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/5 text-(--accent-soft) transition-colors group-hover:bg-(--accent)/10 group-hover:text-(--accent)">
                    <Plus size={24} />
                  </div>
                  <span className="font-medium text-(--accent-soft) group-hover:text-(--accent)">Create New</span>
                </motion.button>
              </AnimatePresence>
            </div>
          </section>
        </div>
      </main>

      {/* Modals & Overlays */}
      <CreateSubjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateSubject}
      />

      {/* Start Session Modal */}
      <AnimatePresence>
        {isStartModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsStartModalOpen(false)}
              className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-lg overflow-hidden rounded-3xl bg-white p-8 shadow-2xl pointer-events-auto"
              >
                <h3 className="font-serif text-2xl font-medium text-foreground mb-2">Select a Subject</h3>
                <p className="text-sm text-(--accent-soft) mb-6">Choose what you want to focus on right now.</p>
                
                <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-2">
                  {subjects.map((subject) => (
                    <button
                      key={subject.id}
                      onClick={() => {
                        setActiveSubject(subject);
                        setIsStartModalOpen(false);
                      }}
                      className="flex items-center gap-3 rounded-xl border border-black/5 p-3 text-left transition-all hover:border-(--accent) hover:bg-(--accent)/5 hover:shadow-md group"
                    >
                      <div 
                        className="h-10 w-10 rounded-lg flex items-center justify-center text-white shadow-sm shrink-0"
                        style={{ background: subject.color }}
                      >
                        <div className="h-2 w-2 rounded-full bg-white/50" />
                      </div>
                      <span className="font-medium text-foreground group-hover:text-(--accent) truncate">{subject.name}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeSubject && (
          <FocusTimer
            subject={activeSubject}
            onStop={handleStopTimer}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
