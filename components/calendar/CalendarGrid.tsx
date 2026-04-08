"use client";

import { useMemo } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WEEKDAY_LABELS } from "@/lib/constants";
import {
  isInRange,
  isRangeStart as checkRangeStart,
  isRangeEnd as checkRangeEnd,
  isSameDay,
  type CalendarDay,
} from "@/lib/calendar-utils";
import { DayCell } from "./DayCell";

interface CalendarGridProps {
  days: CalendarDay[];
  rangeStart: Date | null;
  rangeEnd: Date | null;
  selectedDate: Date | null;
  onDateClick: (date: Date) => void;
  onDateDoubleClick: (date: Date) => void;
  getNotesCount: (date: Date) => number;
}

export function CalendarGrid({
  days,
  rangeStart,
  rangeEnd,
  selectedDate,
  onDateClick,
  onDateDoubleClick,
  getNotesCount,
}: CalendarGridProps) {
  const weeks = useMemo(() => {
    const result: CalendarDay[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      result.push(days.slice(i, i + 7));
    }
    return result;
  }, [days]);

  return (
    <TooltipProvider delayDuration={300}>
      <div className="select-none">
        <div className="grid grid-cols-7 mb-2">
          {WEEKDAY_LABELS.map((label) => (
            <div
              key={label}
              className="text-center text-xs font-medium text-(--cal-muted) py-2 uppercase tracking-wider"
            >
              {label}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const isStart = checkRangeStart(day.date, rangeStart, rangeEnd);
            const isEnd = checkRangeEnd(day.date, rangeStart, rangeEnd);
            const isMiddle =
              isInRange(day.date, rangeStart, rangeEnd) && !isStart && !isEnd;
            const isSelected =
              (selectedDate && isSameDay(day.date, selectedDate)) || false;

            return (
              <DayCell
                key={`${day.date.getTime()}`}
                day={day}
                isSelected={isSelected}
                isRangeStart={isStart}
                isRangeEnd={isEnd}
                isRangeMiddle={isMiddle}
                noteCount={getNotesCount(day.date)}
                onClick={onDateClick}
                onDoubleClick={onDateDoubleClick}
                index={index}
              />
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
}
