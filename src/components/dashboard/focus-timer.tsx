"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Pause, Play, Square, Maximize2, Minimize2 } from "lucide-react";
import { Subject } from "./types";

interface FocusTimerProps {
  subject: Subject | null;
  onStop: (elapsedSeconds: number) => void;
}

export function FocusTimer({ subject, onStop }: FocusTimerProps) {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && subject) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, subject]);

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  if (!subject) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-40 flex flex-col bg-background"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-3">
          <div 
            className="h-3 w-3 rounded-full" 
            style={{ backgroundColor: subject.color }} 
          />
          <span className="font-medium text-(--accent-soft)">{subject.name}</span>
        </div>
        <button 
          onClick={toggleFullscreen}
          className="rounded-full p-2 text-(--accent-soft) hover:bg-black/5 transition-colors"
        >
          {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </button>
      </div>

      {/* Main Timer */}
      <div className="flex flex-1 flex-col items-center justify-center gap-8">
        <div className="relative">
          {/* Pulse effect behind timer */}
          {isRunning && (
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.3, 0.1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 -z-10 rounded-full bg-(--accent)/20 blur-3xl"
            />
          )}
          <h1 className="font-variant-numeric tabular-nums text-8xl font-bold tracking-tighter text-foreground sm:text-9xl">
            {formatTime(seconds)}
          </h1>
        </div>
        
        <p className="text-lg font-medium text-(--accent-soft)">
          {isRunning ? "Focusing..." : "Paused"}
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6 pb-20">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-black/5 text-foreground transition-all hover:scale-105 hover:bg-black/10 active:scale-95"
        >
          {isRunning ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
        </button>
        
        <button
          onClick={() => onStop(seconds)}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-(--accent) text-white shadow-lg transition-all hover:scale-105 hover:bg-(--accent)/90 hover:shadow-xl active:scale-95"
        >
          <Square size={24} fill="currentColor" />
        </button>
      </div>
    </motion.div>
  );
}
