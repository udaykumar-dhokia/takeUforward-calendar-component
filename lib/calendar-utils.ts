import { US_HOLIDAYS, MONTH_NAMES, type Holiday } from "./constants";

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  holiday: Holiday | null;
}

export function getCalendarDays(year: number, month: number): CalendarDay[] {
  const days: CalendarDay[] = [];
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = new Date();

  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const date = new Date(prevYear, prevMonth, day);
    days.push({
      date,
      day,
      isCurrentMonth: false,
      isToday: isSameDay(date, today),
      isWeekend: isWeekend(date),
      holiday: getHoliday(prevMonth, day),
    });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    days.push({
      date,
      day,
      isCurrentMonth: true,
      isToday: isSameDay(date, today),
      isWeekend: isWeekend(date),
      holiday: getHoliday(month, day),
    });
  }

  const remaining = 42 - days.length;
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  for (let day = 1; day <= remaining; day++) {
    const date = new Date(nextYear, nextMonth, day);
    days.push({
      date,
      day,
      isCurrentMonth: false,
      isToday: isSameDay(date, today),
      isWeekend: isWeekend(date),
      holiday: getHoliday(nextMonth, day),
    });
  }

  return days;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function isInRange(date: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false;
  const time = date.getTime();
  const startTime = Math.min(start.getTime(), end.getTime());
  const endTime = Math.max(start.getTime(), end.getTime());
  return time >= startTime && time <= endTime;
}

export function isRangeStart(date: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false;
  const actualStart = start.getTime() <= end.getTime() ? start : end;
  return isSameDay(date, actualStart);
}

export function isRangeEnd(date: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false;
  const actualEnd = start.getTime() <= end.getTime() ? end : start;
  return isSameDay(date, actualEnd);
}

export function getHoliday(month: number, day: number): Holiday | null {
  return US_HOLIDAYS.find((h) => h.month === month && h.day === day) ?? null;
}

export function getMonthName(month: number): string {
  return MONTH_NAMES[month];
}

const MONTH_QUOTES = [
  "New year, new goals! Start strong and stay focused.", // Jan
  "Small daily improvements lead to massive results.", // Feb
  "Spring into action. Your potential is limitless.", // Mar
  "Keep growing, keep learning. Every day counts.", // Apr
  "Success is the sum of small efforts repeated day in and day out.", // May
  "Halfway through the year! Keep pushing forward.", // Jun
  "Rest if you must, but don't you quit.", // Jul
  "Preparation is the key to a successful semester.", // Aug
  "A new school year brings new opportunities. Embrace them!", // Sep
  "Stay focused and consistent. You're capable of amazing things.", // Oct
  "Push through the challenges. The end of the semester is near.", // Nov
  "Finish strong! Reflect on your progress and celebrate your wins." // Dec
];

export function getMonthQuote(month: number): string {
  return MONTH_QUOTES[month];
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateShort(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function dateToKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}
