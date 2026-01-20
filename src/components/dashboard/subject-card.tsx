"use client";

import { Play } from "lucide-react";
import { Subject } from "./types";
import { motion } from "framer-motion";
import { SUBJECT_ICONS, DEFAULT_ICON } from "./icons/icon-picker";

interface SubjectCardProps {
  subject: Subject;
  onStart: (subject: Subject) => void;
}

export function SubjectCard({ subject, onStart }: SubjectCardProps) {
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  };

  const Icon = SUBJECT_ICONS[subject.icon || DEFAULT_ICON] || SUBJECT_ICONS[DEFAULT_ICON];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] transition-all hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.15)]"
    >
      <div className="flex items-start justify-between mb-6">
        <div 
          className="h-14 w-14 rounded-2xl flex items-center justify-center text-white shadow-md"
          style={{ background: subject.color }}
        >
          <Icon size={26} strokeWidth={2} />
        </div>
        
        <div className="text-right">
          <p className="text-xs font-medium text-(--accent-soft) uppercase tracking-wider">Total Time</p>
          <p className="font-variant-numeric text-lg font-semibold text-foreground">
            {formatTime(subject.totalTime)}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-foreground leading-tight">{subject.name}</h3>
      </div>

      <button
        onClick={() => onStart(subject)}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-black/5 py-3 text-sm font-semibold text-foreground transition-all group-hover:bg-black group-hover:text-white group-hover:shadow-lg"
      >
        <Play size={16} fill="currentColor" className="transition-transform group-hover:scale-110" />
        Start Session
      </button>
    </motion.div>
  );
}
