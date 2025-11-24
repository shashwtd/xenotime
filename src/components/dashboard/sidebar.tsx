"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BarChart2, Settings, LogOut, User, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/auth-context";
import { Logo } from "@/components/logo";

export function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Scholar";

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart2,
    },
  ];

  return (
    <aside className="fixed left-0 top-0 z-20 hidden h-screen w-64 flex-col border-r border-black/5 bg-white px-6 py-8 lg:flex shadow-[1px_0_20px_0_rgba(0,0,0,0.02)]">
      <div className="mb-10">
        <Logo />
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-(--accent)/10 text-(--accent)"
                  : "text-(--accent-soft) hover:bg-black/5 hover:text-foreground"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-black/5 pt-6">
        <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-(--accent-soft) transition-colors hover:bg-black/5 hover:text-foreground">
          <Settings size={18} />
          Settings
        </button>

        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={`flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-black/5 ${
              isProfileOpen ? "bg-black/5" : ""
            }`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-(--accent-warm-soft) text-(--accent) font-serif font-bold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-foreground">{userName}</p>
              <p className="truncate text-xs text-(--accent-soft)">Free Plan</p>
            </div>
            <ChevronUp 
              size={16} 
              className={`text-(--accent-soft) transition-transform ${isProfileOpen ? "rotate-180" : ""}`} 
            />
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-full left-0 mb-2 w-full overflow-hidden rounded-xl border border-black/5 bg-white shadow-xl"
              >
                <div className="p-1">
                  <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-(--accent-soft) hover:bg-black/5 hover:text-foreground transition-colors">
                    <User size={16} />
                    Profile
                  </button>
                  <button 
                    onClick={() => signOut()}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} />
                    Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </aside>
  );
}
