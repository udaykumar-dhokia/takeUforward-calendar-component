"use client";

import { motion } from "framer-motion";
import { Sun, Moon } from "@phosphor-icons/react";

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onToggle}
      className="cursor-pointer relative flex items-center justify-center size-9 rounded-xl bg-(--cal-surface) border border-(--cal-border) text-(--cal-dark) hover:bg-(--cal-hover) transition-colors"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0, scale: isDark ? 0 : 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute"
      >
        <Sun className="size-4" weight="bold" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 0 : -180, scale: isDark ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute"
      >
        <Moon className="size-4" weight="bold" />
      </motion.div>
    </motion.button>
  );
}
