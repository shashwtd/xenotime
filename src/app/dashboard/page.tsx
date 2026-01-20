"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Flame, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/auth-context";
import { Subject, DEFAULT_SUBJECTS } from "@/components/dashboard/types";
import { SubjectCard } from "@/components/dashboard/subject-card";
import { CreateSubjectModal } from "@/components/dashboard/create-subject-modal";
import { FocusTimer } from "@/components/dashboard/focus-timer";
import { SUBJECT_ICONS, DEFAULT_ICON } from "@/components/dashboard/icons/icon-picker";

export default function DashboardPage() {
  const { user, loading } = useAuth();
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
    <div className="mx-auto max-w-6xl px-6 py-8 lg:px-12 lg:py-10">
      {/* Header */}
      <header className="mb-8 flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Good morning, {userName}
        </h1>
        <div className="flex items-center gap-2 text-sm text-(--accent-soft)">
          <Flame size={16} className="text-orange-500 fill-orange-500" />
          <span className="font-medium text-foreground">12 Day Streak</span>
          <span>•</span>
          <span>Ready to focus?</span>
        </div>
      </header>

      <div className="mb-12">
        <FocusTimer 
          key={activeSubject?.id || 'empty'}
          subject={activeSubject} 
          onStop={handleStopTimer} 
          onStart={() => setIsStartModalOpen(true)}
        />
      </div>

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
                className="w-full max-w-lg overflow-hidden rounded-3xl bg-white p-6 shadow-2xl pointer-events-auto ring-1 ring-black/5"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Select Subject</h3>
                    <p className="text-sm text-(--accent-soft)">What are we working on?</p>
                  </div>
                  <button 
                    onClick={() => setIsStartModalOpen(false)}
                    className="p-2 rounded-full hover:bg-black/5 text-(--accent-soft) transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
                  {subjects.map((subject) => {
                    const Icon = SUBJECT_ICONS[subject.icon || DEFAULT_ICON] || SUBJECT_ICONS[DEFAULT_ICON];
                    return (
                      <button
                        key={subject.id}
                        onClick={() => {
                          setActiveSubject(subject);
                          setIsStartModalOpen(false);
                        }}
                        className="flex items-center gap-4 rounded-2xl border border-black/5 p-4 text-left transition-all hover:border-(--accent)/30 hover:bg-(--accent)/5 hover:shadow-sm group active:scale-[0.98]"
                      >
                        <div 
                          className="h-12 w-12 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0 transition-transform group-hover:scale-110"
                          style={{ background: subject.color }}
                        >
                          <Icon size={22} strokeWidth={2} />
                        </div>
                        <div className="min-w-0">
                          <span className="block font-semibold text-foreground group-hover:text-(--accent) truncate text-base">{subject.name}</span>
                          <span className="text-xs text-(--accent-soft) font-medium uppercase tracking-wide">Start Session</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
