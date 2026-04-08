"use client";

import { motion } from "framer-motion";
import { CaretLeft, CaretRight, CalendarBlank } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface MonthNavigationProps {
  month: number;
  year: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  direction: number;
}

export function MonthNavigation({
  onPrevMonth,
  onNextMonth,
  onToday,
}: MonthNavigationProps) {
  return (
    <div className="flex items-center justify-center gap-2 mb-4">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onPrevMonth}
        className={cn(
          "flex items-center justify-center size-8 rounded-lg cursor-pointer",
          "text-(--cal-dark) hover:bg-(--cal-hover)",
          "transition-colors"
        )}
        aria-label="Previous month"
      >
        <CaretLeft className="size-4" weight="bold" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToday}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer",
          "bg-(--cal-accent)/10 text-(--cal-accent) hover:bg-(--cal-accent)/20",
          "transition-colors"
        )}
      >
        <CalendarBlank className="size-3.5" weight="bold" />
        Today
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onNextMonth}
        className={cn(
          "flex items-center justify-center size-8 rounded-lg cursor-pointer",
          "text-(--cal-dark) hover:bg-(--cal-hover)",
          "transition-colors"
        )}
        aria-label="Next month"
      >
        <CaretRight className="size-4" weight="bold" />
      </motion.button>
    </div>
  );
}
