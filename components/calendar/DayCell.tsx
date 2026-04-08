"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { CalendarDay } from "@/lib/calendar-utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DayCellProps {
  day: CalendarDay;
  isSelected: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isRangeMiddle: boolean;
  noteCount: number;
  onClick: (date: Date) => void;
  onDoubleClick: (date: Date) => void;
  index: number;
}

export function DayCell({
  day,
  isSelected,
  isRangeStart,
  isRangeEnd,
  isRangeMiddle,
  noteCount,
  onClick,
  onDoubleClick,
  index,
}: DayCellProps) {
  const lastTapRef = useRef<number>(0);

  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      onDoubleClick(day.date);
      e.preventDefault();
    } else {
      onClick(day.date);
    }
    lastTapRef.current = now;
  };

  const cellContent = (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: index * 0.008,
        type: "spring",
        stiffness: 500,
        damping: 30,
      }}
      whileHover={{ scale: 1.08, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleTap}
      className={cn(
        "relative flex flex-col items-center justify-center w-full aspect-square rounded-xl transition-all duration-200 cursor-pointer select-none group/cell touch-manipulation",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-(--cal-accent) focus-visible:ring-offset-2",
        !day.isCurrentMonth && "opacity-30",
        day.isCurrentMonth && "hover:bg-(--cal-hover)",
        day.isToday &&
        !isSelected &&
        !isRangeStart &&
        !isRangeEnd &&
        "ring-2 ring-(--cal-accent) ring-offset-2 ring-offset-(--cal-bg)",
        day.isWeekend && day.isCurrentMonth && "text-(--cal-muted)",
        isSelected &&
        !isRangeStart &&
        !isRangeEnd &&
        "bg-(--cal-accent) text-white shadow-sm shadow-(--cal-accent)/25",
        isRangeStart &&
        "bg-(--cal-accent) text-white rounded-r-none shadow-sm shadow-(--cal-accent)/25",
        isRangeEnd &&
        "bg-(--cal-accent) text-white rounded-l-none shadow-sm shadow-(--cal-accent)/25",
        isRangeMiddle &&
        "bg-(--cal-accent)/10 text-(--cal-accent) rounded-none"
      )}
    >
      <span
        className={cn(
          "text-sm font-medium leading-none",
          (isSelected || isRangeStart || isRangeEnd) && "font-semibold"
        )}
      >
        {day.day}
      </span>

      {day.holiday && (
        <span className="text-[10px] mt-0.5 leading-none">{day.holiday.emoji}</span>
      )}

      {noteCount > 0 && (
        <div className="flex gap-0.5 mt-0.5">
          {Array.from({ length: Math.min(noteCount, 3) }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={cn(
                "size-1 rounded-full",
                isSelected || isRangeStart || isRangeEnd
                  ? "bg-white/80"
                  : "bg-(--cal-accent)"
              )}
            />
          ))}
        </div>
      )}
    </motion.button>
  );

  if (day.holiday && day.isCurrentMonth) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{cellContent}</TooltipTrigger>
        <TooltipContent
          side="top"
          className="bg-(--cal-dark) text-white border-none text-xs"
        >
          {day.holiday.emoji} {day.holiday.name}
        </TooltipContent>
      </Tooltip>
    );
  }

  return cellContent;
}
