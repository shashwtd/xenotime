"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 shadow-2xl pointer-events-auto max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between mb-6 shrink-0">
                <h3 className="font-serif text-2xl font-medium text-foreground">New Subject</h3>
                <button
                  onClick={onClose}
                  className="rounded-full p-2 text-(--accent-soft) hover:bg-black/5 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto pr-2">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-(--accent-soft)">
                    Subject Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Mathematics, Design..."
                    className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-foreground placeholder:text-(--accent-soft)/50 focus:border-(--accent) focus:outline-none focus:ring-1 focus:ring-(--accent)"
                    autoFocus
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-(--accent-soft)">
                    Icon
                  </label>
                  <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto p-1">
                    {Object.keys(SUBJECT_ICONS).map((iconKey) => {
                      const Icon = SUBJECT_ICONS[iconKey];
                      return (
                        <button
                          key={iconKey}
                          type="button"
                          onClick={() => setSelectedIcon(iconKey)}
                          className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all hover:bg-black/5 ${
                            selectedIcon === iconKey 
                              ? "bg-(--accent)/10 text-(--accent) ring-2 ring-(--accent)" 
                              : "text-(--accent-soft)"
                          }`}
                          title={iconKey}
                        >
                          <Icon size={20} strokeWidth={2} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-(--accent-soft)">
                    Color Theme
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {GRADIENTS.map((gradient) => (
                      <button
                        key={gradient}
                        type="button"
                        onClick={() => setSelectedColor(gradient)}
                        className="relative h-12 w-12 rounded-xl transition-transform hover:scale-110 focus:outline-none shadow-sm border border-black/5"
                        style={{ background: gradient }}
                      >
                        {selectedColor === gradient && (
                          <div className="absolute inset-0 flex items-center justify-center text-white">
                            <Check size={20} strokeWidth={3} className="drop-shadow-md" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={!name.trim()}
                    className="w-full rounded-xl bg-(--accent) py-3.5 font-semibold text-white shadow-md transition-all hover:bg-(--accent)/90 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Subject
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
