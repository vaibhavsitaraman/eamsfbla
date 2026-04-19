"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  to: string;
  icon: LucideIcon;
}

interface NavBarProps {
  items: NavItem[];
  className?: string;
  defaultActive?: string;
  visible?: boolean;
}

export function AnimeNavBar({
  items,
  className,
  defaultActive = "Home",
  visible = true,
}: NavBarProps) {
  const location = useLocation();
  const [mounted, setMounted] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>(defaultActive);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update active tab based on current route
  useEffect(() => {
    const current = items.find((item) => item.to === location.pathname);
    if (current) {
      setActiveTab(current.name);
    }
  }, [location.pathname, items]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!mounted || !visible) return null;

  return (
    <div className={cn("fixed top-5 left-0 right-0 z-[9999]", className)}>
      <div className="flex justify-center pt-6">
        <AnimatePresence>
          <motion.div
            key="anime-navbar"
            className="flex items-center gap-3 bg-black/50 border border-white/10 backdrop-blur-lg py-1.5 px-2 rounded-full shadow-lg relative"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
          >
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.name;
              const isHovered = hoveredTab === item.name;

              return (
                <NavLink
                  key={item.name}
                  to={item.to}
                  onClick={() => setActiveTab(item.name)}
                  onMouseEnter={() => setHoveredTab(item.name)}
                  onMouseLeave={() => setHoveredTab(null)}
                  className={cn(
                    "relative cursor-pointer text-sm font-semibold px-5 py-2 rounded-full transition-all duration-300",
                    "text-white/70 hover:text-white",
                    isActive && "text-white"
                  )}
                >
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-full -z-10 overflow-hidden"
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: [0.3, 0.5, 0.3],
                        scale: [1, 1.03, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <div className="absolute inset-0 bg-primary/25 rounded-full blur-md" />
                      <div className="absolute inset-[-4px] bg-primary/20 rounded-full blur-xl" />
                      <div className="absolute inset-[-8px] bg-primary/15 rounded-full blur-2xl" />
                      <div className="absolute inset-[-12px] bg-primary/5 rounded-full blur-3xl" />

                      <div
                        className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0"
                        style={{
                          animation: "shine 3s ease-in-out infinite",
                        }}
                      />
                    </motion.div>
                  )}

                  <motion.span
                    className="hidden md:inline relative z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.name}
                  </motion.span>
                  <motion.span
                    className="md:hidden relative z-10"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Icon size={18} strokeWidth={2.5} />
                  </motion.span>

                  <AnimatePresence>
                    {isHovered && !isActive && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute inset-0 bg-white/10 rounded-full -z-10"
                      />
                    )}
                  </AnimatePresence>
                </NavLink>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

