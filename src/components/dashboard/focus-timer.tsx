"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play, Square, Maximize2, Minimize2, Flame } from "lucide-react";
import { Subject } from "./types";
import { SUBJECT_ICONS, DEFAULT_ICON } from "./icons/icon-picker";

interface FocusTimerProps {
  subject: Subject | null;
  onStop: (elapsedSeconds: number) => void;
  onStart?: () => void;
}

type TimerMode = "focus" | "pomodoro";
type PomodoroPhase = "focus" | "break";

export function FocusTimer({ subject, onStop, onStart }: FocusTimerProps) {
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<TimerMode>("focus");
  const [pomodoroPhase, setPomodoroPhase] = useState<PomodoroPhase>("focus");
  const [pomodoroDurations, setPomodoroDurations] = useState({ focus: 25, break: 5 });
  const [phaseRemaining, setPhaseRemaining] = useState(25 * 60);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSetup, setIsSetup] = useState(true);

  useEffect(() => {
    if (!subject || !isRunning) return;
    const interval = setInterval(() => {
      setSessionSeconds((prev) => prev + 1);
      if (mode === "pomodoro") {
        setPhaseRemaining((prev) => {
          if (prev <= 1) {
            if (pomodoroPhase === "focus") {
              setPomodoroPhase("break");
              setCompletedPomodoros((count) => count + 1);
              return pomodoroDurations.break * 60;
            }
            setPomodoroPhase("focus");
            return pomodoroDurations.focus * 60;
          }
          return prev - 1;
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [subject, isRunning, mode, pomodoroPhase, pomodoroDurations.break, pomodoroDurations.focus]);

  if (!subject) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-4xl border border-black/5 bg-linear-to-br from-white to-orange-50/30 p-8 shadow-sm lg:p-10"
      >
        <div className="absolute top-0 right-0 -mt-16 -mr-16 h-64 w-64 rounded-full bg-orange-100/20 blur-3xl pointer-events-none" />
        
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-orange-100 text-orange-500 shadow-sm">
              <Flame size={32} fill="currentColor" className="animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">Ready to focus?</h2>
              <p className="text-sm text-(--accent-soft) mt-1">Start a session to keep your streak alive.</p>
            </div>
          </div>
          <button
            onClick={onStart}
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-black px-8 py-4 text-sm font-medium text-white shadow-lg transition-all hover:bg-black/80 hover:scale-105 active:scale-95"
          >
            <Play size={18} fill="currentColor" />
            Start Session
          </button>
        </div>
      </motion.div>
    );
  }

  const formatClock = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const formatCountdown = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const timerValue = mode === "pomodoro" ? formatCountdown(phaseRemaining) : formatClock(sessionSeconds);
  const timerSubLabel = mode === "pomodoro"
    ? `${pomodoroPhase === "focus" ? "Focus" : "Break"} phase`
    : isRunning ? "Focusing..." : "Paused";

  const phaseTotal = (pomodoroPhase === "focus" ? pomodoroDurations.focus : pomodoroDurations.break) * 60;
  const safePhaseTotal = Math.max(phaseTotal, 1);
  const phaseProgress = mode === "pomodoro" ? 1 - phaseRemaining / safePhaseTotal : 0;

  const handleModeChange = (nextMode: TimerMode) => {
    setMode(nextMode);
    if (nextMode === "pomodoro") {
      setPomodoroPhase("focus");
      setPhaseRemaining(pomodoroDurations.focus * 60);
    } else {
      setPomodoroPhase("focus");
    }
  };

  const handleStop = () => {
    onStop(sessionSeconds);
    setIsExpanded(false);
  };

  const handleStart = () => {
    setIsSetup(false);
    setIsRunning(true);
  };

  const renderTimerFace = (size: "standard" | "large" = "standard") => (
    <div className="relative flex flex-col items-center justify-center py-8">
      {isRunning && (
        <motion.div
          animate={{ scale: [1, 1.06, 1], opacity: [0.15, 0.35, 0.15] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className={`absolute inset-0 -z-10 rounded-full bg-(--accent)/10 blur-3xl ${size === "large" ? "scale-150" : "scale-125"}`}
        />
      )}
      <h1 className={`${size === "large" ? "text-8xl sm:text-9xl" : "text-6xl sm:text-7xl"} tabular-nums font-medium text-foreground tracking-tight`}>
        {timerValue}
      </h1>
      <p className="mt-4 text-center text-sm font-medium text-(--accent-soft) uppercase tracking-widest">{timerSubLabel}</p>
      {mode === "pomodoro" && (
        <div className="mt-8 h-1.5 w-48 rounded-full bg-black/5 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-orange-400"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, Math.max(0, phaseProgress * 100))}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      )}
    </div>
  );

  if (isSetup) {
    const Icon = SUBJECT_ICONS[subject.icon || DEFAULT_ICON] || SUBJECT_ICONS[DEFAULT_ICON];
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        className="rounded-4xl border border-black/5 bg-white p-8 shadow-xl lg:p-10"
      >
        <div className="flex items-center gap-4 mb-8">
          <div
            className="h-14 w-14 rounded-2xl shadow-inner flex items-center justify-center text-white"
            style={{ backgroundColor: subject.color }}
          >
             <Icon size={28} strokeWidth={2} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-(--accent-soft) font-semibold">Session Setup</p>
            <h2 className="text-2xl font-medium text-foreground">{subject.name}</h2>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-(--accent-soft) mb-3 block">Timer Mode</label>
              <div className="flex gap-2 p-1 bg-black/5 rounded-2xl w-fit">
                {(["focus", "pomodoro"] as TimerMode[]).map((value) => (
                  <button
                    key={value}
                    onClick={() => handleModeChange(value)}
                    className={`rounded-xl px-6 py-2.5 text-sm font-medium capitalize transition-all ${
                      mode === value 
                        ? "bg-white text-foreground shadow-sm" 
                        : "text-(--accent-soft) hover:text-foreground"
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>

            {mode === "pomodoro" && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-(--accent-soft) mb-2 block">Focus Interval</label>
                    <select
                      value={pomodoroDurations.focus}
                      onChange={(e) => {
                        const next = Number(e.target.value);
                        setPomodoroDurations((prev) => ({ ...prev, focus: next }));
                        if (mode === "pomodoro" && pomodoroPhase === "focus") {
                          setPhaseRemaining(next * 60);
                        }
                      }}
                      className="w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm focus:border-black/30 focus:outline-none"
                    >
                      {[20, 25, 30, 45, 60].map((option) => (
                        <option key={option} value={option}>{option} min</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-(--accent-soft) mb-2 block">Break Interval</label>
                    <select
                      value={pomodoroDurations.break}
                      onChange={(e) => {
                        const next = Number(e.target.value);
                        setPomodoroDurations((prev) => ({ ...prev, break: next }));
                        if (mode === "pomodoro" && pomodoroPhase === "break") {
                          setPhaseRemaining(next * 60);
                        }
                      }}
                      className="w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm focus:border-black/30 focus:outline-none"
                    >
                      {[5, 10, 15, 20].map((option) => (
                        <option key={option} value={option}>{option} min</option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div className="flex flex-col justify-center items-center bg-orange-50/50 rounded-3xl p-6 border border-orange-100/50">
             <div className="text-center mb-6">
                <span className="text-sm text-(--accent-soft) uppercase tracking-widest">Total Duration</span>
                <div className="text-5xl font-medium text-foreground mt-2">
                  {mode === "pomodoro" ? `${pomodoroDurations.focus}m` : "∞"}
                </div>
                <p className="text-sm text-(--accent-soft) mt-2">
                  {mode === "pomodoro" ? "per cycle" : "Open ended session"}
                </p>
             </div>
             
             <button
              onClick={handleStart}
              className="w-full group flex items-center justify-center gap-3 rounded-2xl bg-black px-6 py-4 text-white shadow-lg transition-all hover:bg-black/90 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Play size={20} fill="currentColor" />
              <span className="font-semibold">Start Focus</span>
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  const Icon = SUBJECT_ICONS[subject.icon || DEFAULT_ICON] || SUBJECT_ICONS[DEFAULT_ICON];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.3 }}
        className="rounded-4xl border border-black/5 bg-linear-to-br from-white via-white to-orange-50/40 p-6 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.45)] lg:p-8"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div
              className="h-12 w-12 rounded-2xl shadow-inner flex items-center justify-center text-white"
              style={{ backgroundColor: subject.color }}
            >
               <Icon size={24} strokeWidth={2} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-(--accent-soft)">Now focusing</p>
              <p className="text-lg font-semibold text-foreground">{subject.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-black/5 px-4 py-1.5 text-xs font-medium text-(--accent-soft) capitalize">
              {mode} Mode
            </div>
            <button
              onClick={() => setIsExpanded(true)}
              className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-(--accent-soft) transition-colors hover:border-black/30"
            >
              <Maximize2 size={16} /> Expand
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[2fr_1fr]">
          {renderTimerFace()}

          <div className="flex flex-col gap-6 rounded-3xl bg-white/80 p-6 backdrop-blur-sm border border-white/20 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-(--accent-soft)">Session length</span>
              <span className="text-2xl font-semibold text-foreground tabular-nums">{formatClock(sessionSeconds)}</span>
            </div>
            
            {mode === "pomodoro" && (
              <div className="rounded-2xl bg-orange-50/80 p-4 border border-orange-100">
                <p className="text-xs uppercase tracking-wide text-orange-600 font-semibold">Completed blocks</p>
                <p className="text-3xl font-semibold text-foreground mt-1">{completedPomodoros}</p>
              </div>
            )}

            <div className="mt-auto flex items-center gap-3">
              <button
                onClick={() => setIsRunning((prev) => !prev)}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-black/10 px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:border-black/30 hover:bg-black/5"
              >
                {isRunning ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                {isRunning ? "Pause" : "Resume"}
              </button>
              <button
                onClick={handleStop}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-black/90"
              >
                <Square size={18} /> Stop
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-md p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-4xl flex flex-col items-center"
            >
              <button
                onClick={() => setIsExpanded(false)}
                className="absolute right-0 top-0 rounded-full border border-black/10 p-3 text-(--accent-soft) hover:border-black/30 hover:bg-black/5 transition-all"
              >
                <Minimize2 size={20} />
              </button>
              
              <div className="mb-12 text-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-black/5 px-4 py-1.5 mb-4">
                   <div className="w-2 h-2 rounded-full" style={{ background: subject.color }} />
                   <span className="text-xs font-medium uppercase tracking-wider text-(--accent-soft)">{subject.name}</span>
                </div>
                <h2 className="text-4xl font-medium tracking-tight text-foreground">Deep Focus Session</h2>
              </div>

              {renderTimerFace("large")}
              
              <div className="mt-16 flex flex-col items-center gap-8 w-full max-w-md">
                <div className="grid grid-cols-2 gap-12 w-full text-center">
                    <div>
                        <p className="text-sm text-(--accent-soft) uppercase tracking-widest mb-2">Total Time</p>
                        <p className="text-3xl font-semibold text-foreground tabular-nums">{formatClock(sessionSeconds)}</p>
                    </div>
                    {mode === "pomodoro" && (
                    <div>
                        <p className="text-sm text-(--accent-soft) uppercase tracking-widest mb-2">Blocks</p>
                        <p className="text-3xl font-semibold text-foreground tabular-nums">{completedPomodoros}</p>
                    </div>
                    )}
                </div>

                <div className="flex gap-4 w-full">
                  <button
                    onClick={() => setIsRunning((prev) => !prev)}
                    className="flex-1 rounded-2xl border border-black/10 px-8 py-4 text-base font-semibold text-foreground hover:border-black/30 hover:bg-black/5 transition-all"
                  >
                    {isRunning ? "Pause Session" : "Resume Session"}
                  </button>
                  <button
                    onClick={handleStop}
                    className="flex-1 rounded-2xl bg-black px-8 py-4 text-base font-semibold text-white shadow-xl hover:bg-black/90 transition-all"
                  >
                    End Session
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
