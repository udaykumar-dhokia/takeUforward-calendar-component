"use client";

import { useState, useCallback } from "react";
import { isSameDay } from "@/lib/calendar-utils";

type SelectionState = "idle" | "selecting" | "selected";

export function useDateRange() {
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
  const [selectionState, setSelectionState] = useState<SelectionState>("idle");

  const handleDateClick = useCallback(
    (date: Date) => {
      if (selectionState === "idle" || selectionState === "selected") {
        setRangeStart(date);
        setRangeEnd(null);
        setSelectionState("selecting");
      } else if (selectionState === "selecting") {
        if (rangeStart && isSameDay(date, rangeStart)) {
          setSelectionState("selected");
          return;
        }
        setRangeEnd(date);
        setSelectionState("selected");
      }
    },
    [selectionState, rangeStart]
  );

  const clearRange = useCallback(() => {
    setRangeStart(null);
    setRangeEnd(null);
    setSelectionState("idle");
  }, []);

  const selectSingleDate = useCallback((date: Date) => {
    setRangeStart(date);
    setRangeEnd(null);
    setSelectionState("selected");
  }, []);

  const selectedDate = rangeStart && !rangeEnd ? rangeStart : null;

  return {
    rangeStart,
    rangeEnd,
    selectionState,
    selectedDate,
    handleDateClick,
    clearRange,
    selectSingleDate,
  };
}
