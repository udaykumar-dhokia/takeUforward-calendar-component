"use client";

import { motion } from "framer-motion";
import { X } from "@phosphor-icons/react";
import { formatDateShort } from "@/lib/calendar-utils";

interface DateRangeIndicatorProps {
  start: Date;
  end: Date;
  onClear: () => void;
}

export function DateRangeIndicator({
  start,
  end,
  onClear,
}: DateRangeIndicatorProps) {
  const actualStart = start.getTime() <= end.getTime() ? start : end;
  const actualEnd = start.getTime() <= end.getTime() ? end : start;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-(--cal-accent)/10 border border-(--cal-accent)/20 text-sm"
    >
      <span className="text-(--cal-accent) font-medium">
        {formatDateShort(actualStart)}
      </span>
      <span className="text-(--cal-muted)">→</span>
      <span className="text-(--cal-accent) font-medium">
        {formatDateShort(actualEnd)}
      </span>
      <motion.button
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClear}
        className="ml-1 text-(--cal-muted) hover:text-(--cal-accent) transition-colors"
      >
        <X className="size-3.5" weight="bold" />
      </motion.button>
    </motion.div>
  );
}
