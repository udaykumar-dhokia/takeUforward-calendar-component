"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCalendar } from "@/hooks/useCalendar";
import { useDateRange } from "@/hooks/useDateRange";
import { useNotes } from "@/hooks/useNotes";
import { useTheme } from "@/hooks/useTheme";
import { addDays, getMonthName, getMonthQuote } from "@/lib/calendar-utils";
import { getMonthMeta } from "@/lib/month-images";
import { MonthNavigation } from "./MonthNavigation";
import { CalendarGrid } from "./CalendarGrid";
import { DayDetailView } from "./DayDetailView";
import { DateRangeIndicator } from "./DateRangeIndicator";
import { ThemeToggle } from "./ThemeToggle";

export function CalendarShell() {
  const { currentMonth, currentYear, days, goToNextMonth, goToPrevMonth, goToToday } =
    useCalendar();
  const {
    rangeStart,
    rangeEnd,
    selectedDate,
    handleDateClick,
    clearRange,
    selectSingleDate,
  } = useDateRange();
  const {
    categories,
    addNote,
    updateNote,
    deleteNote,
    getNotesForDate,
    getNotesCountForDate,
    getNotesCountForRange,
    addCategory,
  } = useNotes();
  const { resolvedTheme, toggleTheme } = useTheme();

  const [dayDetailDate, setDayDetailDate] = useState<Date | null>(null);
  const [direction, setDirection] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const prevMonthRef = useRef(currentMonth);

  const meta = getMonthMeta(currentMonth);

  useEffect(() => {
    if (currentMonth !== prevMonthRef.current) {
      setDirection(
        currentMonth > prevMonthRef.current ||
          (prevMonthRef.current === 11 && currentMonth === 0)
          ? 1
          : -1
      );
      prevMonthRef.current = currentMonth;
    }
  }, [currentMonth]);

  const handleNextMonth = useCallback(() => {
    setDirection(1);
    setIsFlipping(true);
    goToNextMonth();
  }, [goToNextMonth]);

  const handlePrevMonth = useCallback(() => {
    setDirection(-1);
    setIsFlipping(true);
    goToPrevMonth();
  }, [goToPrevMonth]);

  const onDateClick = useCallback(
    (date: Date) => {
      handleDateClick(date);
    },
    [handleDateClick]
  );

  const onDateDoubleClick = useCallback((date: Date) => {
    setDayDetailDate(date);
  }, []);

  const handleDayDetailNavigate = useCallback((date: Date) => {
    setDayDetailDate(date);
  }, []);

  const activeDate = selectedDate ?? rangeStart;

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (dayDetailDate) return;
      if (e.key === "ArrowLeft") {
        if (e.shiftKey) {
          handlePrevMonth();
        } else if (activeDate) {
          selectSingleDate(addDays(activeDate, -1));
        }
      }
      if (e.key === "ArrowRight") {
        if (e.shiftKey) {
          handleNextMonth();
        } else if (activeDate) {
          selectSingleDate(addDays(activeDate, 1));
        }
      }
      if (e.key === "ArrowUp" && activeDate) {
        selectSingleDate(addDays(activeDate, -7));
      }
      if (e.key === "ArrowDown" && activeDate) {
        selectSingleDate(addDays(activeDate, 7));
      }
      if (e.key === "Enter" && activeDate) {
        setDayDetailDate(activeDate);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dayDetailDate, activeDate, handlePrevMonth, handleNextMonth, selectSingleDate]);

  const flipVariants = {
    enter: (dir: number) => ({
      rotateX: dir > 0 ? -8 : 8,
      y: dir > 0 ? -6 : 6,
      opacity: 0,
      scale: 0.99,
    }),
    center: {
      rotateX: 0,
      y: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      rotateX: dir > 0 ? 12 : -12,
      y: dir > 0 ? 8 : -8,
      opacity: 0,
      scale: 0.98,
    }),
  };

  return (
    <div
      className="relative min-h-screen flex items-start justify-center py-12 md:py-16 lg:py-20 px-4 overflow-hidden"
    >
      <div className="wall-bg-solid" />

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-4 right-4 z-40"
      >
        <ThemeToggle isDark={resolvedTheme === "dark"} onToggle={toggleTheme} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="relative w-full max-w-lg"
      >
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-50">
          <div className="w-3 h-3 rounded-full bg-zinc-500 dark:bg-zinc-400 shadow-md relative">
            <div className="absolute inset-0.5 rounded-full bg-linear-to-br from-zinc-300 to-zinc-600 dark:from-zinc-300 dark:to-zinc-500" />
          </div>
          <div className="w-px h-8 bg-linear-to-b from-zinc-400 to-zinc-500/50 dark:from-zinc-500 dark:to-zinc-600/50" />
        </div>

        <div
          className="mt-4 relative bg-(--cal-card) rounded-xl overflow-hidden shadow-[0_8px_40px_-8px_rgba(0,0,0,0.15),0_2px_10px_-2px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_40px_-8px_rgba(0,0,0,0.5)]"
          style={{ perspective: "2000px" }}
        >
          <div className="relative z-30 flex items-center justify-center gap-2.5 sm:gap-3 py-2 bg-linear-to-b from-zinc-100 to-zinc-50 dark:from-zinc-800 dark:to-zinc-900 border-b border-zinc-200 dark:border-zinc-700">
            {Array.from({ length: 13 }).map((_, i) => (
              <div key={i} className="relative">
                <div className="w-3.5 h-3.5 rounded-full border-[2.5px] border-zinc-400 dark:border-zinc-500 bg-linear-to-b from-zinc-50 to-zinc-200 dark:from-zinc-700 dark:to-zinc-800 shadow-inner" />
                <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-px h-1.5 bg-zinc-300 dark:bg-zinc-600" />
              </div>
            ))}
          </div>

          <AnimatePresence
            mode="wait"
            custom={direction}
            onExitComplete={() => setIsFlipping(false)}
          >
            <motion.div
              key={`page-${currentMonth}-${currentYear}`}
              custom={direction}
              variants={flipVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: 0.35,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              style={{
                transformOrigin: "top center",
                transformStyle: "preserve-3d",
              }}
              className="relative"
            >
              <div className="relative w-full aspect-4/3 overflow-hidden">
                <div
                  className="absolute inset-0 bg-linear-to-br from-(--cal-accent)/60 via-(--cal-accent)/20 to-(--cal-dark)/40"
                  style={{
                    backgroundImage: `url(${meta.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />

                <div className="absolute top-4 right-5 z-10">
                  <span className="text-white/80 text-4xl font-heading font-bold drop-shadow-lg">
                    {currentYear}
                  </span>
                </div>
              </div>

              <div className="relative -mt-8 z-10">
                <svg
                  viewBox="0 0 500 50"
                  preserveAspectRatio="none"
                  className="w-full h-8 md:h-10"
                >
                  <path
                    d="M0,50 L0,25 Q250,-15 500,25 L500,50 Z"
                    className="fill-(--cal-card)"
                  />
                </svg>
              </div>

              <div className="px-6 md:px-8 -mt-2">
                <div className="flex flex-col items-center justify-center">
                  <h1 className="text-3xl md:text-4xl font-heading font-bold text-(--cal-dark) text-center tracking-tight">
                    {getMonthName(currentMonth)}
                  </h1>
                  <p className="text-xs md:text-sm font-medium text-(--cal-muted) mt-1.5 text-center max-w-[85%] italic">
                    &quot;{getMonthQuote(currentMonth)}&quot;
                  </p>
                </div>
              </div>

              <div className="px-4 md:px-6 mt-3">
                <MonthNavigation
                  month={currentMonth}
                  year={currentYear}
                  onPrevMonth={handlePrevMonth}
                  onNextMonth={handleNextMonth}
                  onToday={goToToday}
                  direction={direction}
                />
              </div>

              <AnimatePresence>
                {rangeStart && rangeEnd && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-6 md:px-8 mb-2"
                  >
                    <DateRangeIndicator
                      start={rangeStart}
                      end={rangeEnd}
                      onClear={clearRange}
                      totalNotes={getNotesCountForRange(rangeStart, rangeEnd)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="px-4 md:px-6 pb-2">
                <CalendarGrid
                  days={days}
                  rangeStart={rangeStart}
                  rangeEnd={rangeEnd}
                  selectedDate={selectedDate}
                  onDateClick={onDateClick}
                  onDateDoubleClick={onDateDoubleClick}
                  getNotesCount={getNotesCountForDate}
                />
              </div>

              <div className="px-6 py-3 border-t border-(--cal-border)">
                <p className="text-[10px] text-(--cal-muted) text-center tracking-wide">
                  Double-click to open day · Arrow keys to navigate · ⇧+←/→ months
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="absolute -bottom-3 left-4 right-4 h-6 bg-black/5 dark:bg-black/20 rounded-[50%] blur-md -z-10" />
      </motion.div>

      <AnimatePresence>
        {dayDetailDate && (
          <DayDetailView
            date={dayDetailDate}
            notes={getNotesForDate(dayDetailDate)}
            categories={categories}
            onClose={() => setDayDetailDate(null)}
            onAddNote={addNote}
            onUpdateNote={updateNote}
            onDeleteNote={deleteNote}
            onAddCategory={addCategory}
            onNavigateDate={handleDayDetailNavigate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
