"use client";

import { useState, useCallback, useMemo } from "react";
import { getCalendarDays, type CalendarDay } from "@/lib/calendar-utils";

export function useCalendar() {
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());

  const days: CalendarDay[] = useMemo(
    () => getCalendarDays(currentYear, currentMonth),
    [currentYear, currentMonth]
  );

  const goToNextMonth = useCallback(() => {
    if (currentMonth === 11) {
      setCurrentYear((y) => y + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  }, [currentMonth]);

  const goToPrevMonth = useCallback(() => {
    if (currentMonth === 0) {
      setCurrentYear((y) => y - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  }, [currentMonth]);

  const goToToday = useCallback(() => {
    const today = new Date();
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  }, []);

  const goToDate = useCallback((date: Date) => {
    setCurrentMonth(date.getMonth());
    setCurrentYear(date.getFullYear());
  }, []);

  return {
    currentMonth,
    currentYear,
    days,
    goToNextMonth,
    goToPrevMonth,
    goToToday,
    goToDate,
  };
}
