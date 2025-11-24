"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Sparkles } from "lucide-react";
import { GRADIENTS, Subject } from "./types";
import { SUBJECT_ICONS, DEFAULT_ICON } from "./icons/icon-picker";

interface CreateSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (subject: Omit<Subject, "id" | "totalTime">) => void;
}

export function CreateSubjectModal({ isOpen, onClose, onCreate }: CreateSubjectModalProps) {
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState(GRADIENTS[0]);
  const [selectedIcon, setSelectedIcon] = useState(DEFAULT_ICON);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    onCreate({
      name: name.trim(),
      color: selectedColor,
      icon: selectedIcon,
    });
    
    setName("");
    setSelectedColor(GRADIENTS[0]);
    setSelectedIcon(DEFAULT_ICON);
    onClose();
  };

  const SelectedIconComponent = SUBJECT_ICONS[selectedIcon] || SUBJECT_ICONS[DEFAULT_ICON];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl overflow-hidden rounded-4xl bg-white shadow-2xl pointer-events-auto max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-black/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-orange-50 text-orange-500">
                    <Sparkles size={20} />
                  </div>
                  <h3 className="text-xl font-medium text-foreground">Create New Subject</h3>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-full p-2 text-(--accent-soft) hover:bg-black/5 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col md:flex-row h-full overflow-hidden">
                {/* Form Section */}
                <div className="flex-1 overflow-y-auto p-6">
                  <form id="create-subject-form" onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-3">
                      <label htmlFor="name" className="text-sm font-medium text-(--accent-soft) uppercase tracking-wide">
                        Subject Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Advanced Mathematics"
                        className="w-full rounded-2xl border border-black/10 bg-stone-50 px-4 py-4 text-lg font-medium text-foreground placeholder:text-(--accent-soft)/40 focus:border-black/20 focus:bg-white focus:outline-none focus:ring-4 focus:ring-black/5 transition-all"
                        autoFocus
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-medium text-(--accent-soft) uppercase tracking-wide">
                        Choose Icon
                      </label>
                      <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto p-1 custom-scrollbar">
                        {Object.keys(SUBJECT_ICONS).map((iconKey) => {
                          const Icon = SUBJECT_ICONS[iconKey];
                          const isSelected = selectedIcon === iconKey;
                          return (
                            <button
                              key={iconKey}
                              type="button"
                              onClick={() => setSelectedIcon(iconKey)}
                              className={`group relative flex h-12 w-12 items-center justify-center rounded-xl transition-all ${
                                isSelected
                                  ? "bg-black text-white shadow-md scale-110 z-10" 
                                  : "text-(--accent-soft) hover:bg-black/5 hover:scale-105"
                              }`}
                              title={iconKey}
                            >
                              <Icon size={20} strokeWidth={isSelected ? 2.5 : 2} />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-medium text-(--accent-soft) uppercase tracking-wide">
                        Color Theme
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {GRADIENTS.map((gradient) => (
                          <button
                            key={gradient}
                            type="button"
                            onClick={() => setSelectedColor(gradient)}
                            className={`relative h-10 w-10 rounded-full transition-transform hover:scale-110 focus:outline-none shadow-sm border border-black/5 ${selectedColor === gradient ? 'ring-2 ring-offset-2 ring-black/10 scale-110' : ''}`}
                            style={{ background: gradient }}
                          >
                            {selectedColor === gradient && (
                              <div className="absolute inset-0 flex items-center justify-center text-white">
                                <Check size={16} strokeWidth={3} className="drop-shadow-md" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </form>
                </div>

                {/* Preview Section */}
                <div className="w-full md:w-72 bg-stone-50/50 border-l border-black/5 p-6 flex flex-col items-center justify-center">
                  <p className="text-xs font-medium text-(--accent-soft) uppercase tracking-widest mb-8">Preview</p>
                  
                  <div className="w-full aspect-[4/5] max-w-60 rounded-3xl bg-white p-6 shadow-xl flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                       <SelectedIconComponent size={120} />
                    </div>
                    
                    <div 
                      className="h-14 w-14 rounded-2xl flex items-center justify-center text-white shadow-md mb-auto relative z-10"
                      style={{ background: selectedColor }}
                    >
                      <SelectedIconComponent size={26} strokeWidth={2} />
                    </div>

                    <div className="mt-8 relative z-10">
                      <div className="h-2 w-12 rounded-full bg-black/5 mb-4" />
                      <h3 className="font-serif text-2xl font-medium text-foreground leading-tight">
                        {name || "Subject Name"}
                      </h3>
                      <p className="text-sm text-(--accent-soft) mt-2">0h 0m focused</p>
                    </div>

                    <div className="mt-6 pt-6 border-t border-black/5 relative z-10">
                       <div className="w-full h-10 rounded-xl bg-black/5 flex items-center justify-center text-xs font-semibold text-(--accent-soft)">
                          Start Session
                       </div>
                    </div>
                  </div>

                  <div className="mt-auto w-full pt-8">
                    <button
                      type="submit"
                      form="create-subject-form"
                      disabled={!name.trim()}
                      className="w-full rounded-xl bg-black py-4 font-semibold text-white shadow-lg transition-all hover:bg-black/90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      Create Subject
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
