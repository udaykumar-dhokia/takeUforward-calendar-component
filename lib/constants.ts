export const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

export const MONTH_SHORT_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

export interface Holiday {
  name: string;
  month: number;
  day: number;
  emoji: string;
}

export const US_HOLIDAYS: Holiday[] = [
  { name: "New Year's Day", month: 0, day: 1, emoji: "🎆" },
  { name: "Valentine's Day", month: 1, day: 14, emoji: "❤️" },
  { name: "St. Patrick's Day", month: 2, day: 17, emoji: "🍀" },
  { name: "Easter", month: 3, day: 20, emoji: "🐣" },
  { name: "Mother's Day", month: 4, day: 11, emoji: "💐" },
  { name: "Memorial Day", month: 4, day: 26, emoji: "🇺🇸" },
  { name: "Father's Day", month: 5, day: 15, emoji: "👔" },
  { name: "Independence Day", month: 6, day: 4, emoji: "🎇" },
  { name: "Labor Day", month: 8, day: 1, emoji: "⚒️" },
  { name: "Halloween", month: 9, day: 31, emoji: "🎃" },
  { name: "Veterans Day", month: 10, day: 11, emoji: "🎖️" },
  { name: "Thanksgiving", month: 10, day: 27, emoji: "🦃" },
  { name: "Christmas", month: 11, day: 25, emoji: "🎄" },
  { name: "New Year's Eve", month: 11, day: 31, emoji: "🥂" },
];

export const NOTE_COLORS = [
  { id: "terracotta", label: "Terracotta", value: "#C4775A" },
  { id: "amber", label: "Amber", value: "#D4A574" },
  { id: "sage", label: "Sage", value: "#8BA888" },
  { id: "sky", label: "Sky", value: "#7BA7BC" },
  { id: "lavender", label: "Lavender", value: "#9B8EC4" },
  { id: "rose", label: "Rose", value: "#C4848A" },
  { id: "charcoal", label: "Charcoal", value: "#6B6560" },
  { id: "sand", label: "Sand", value: "#C4B5A0" },
] as const;

export const DEFAULT_CATEGORIES = [
  { id: "personal", label: "Personal", color: "#C4775A" },
  { id: "work", label: "Work", color: "#7BA7BC" },
  { id: "reminder", label: "Reminder", color: "#D4A574" },
  { id: "health", label: "Health", color: "#8BA888" },
  { id: "event", label: "Event", color: "#9B8EC4" },
] as const;

export type NoteColorId = (typeof NOTE_COLORS)[number]["id"];
