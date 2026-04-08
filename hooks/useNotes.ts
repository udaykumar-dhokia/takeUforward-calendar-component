"use client";

import { useState, useEffect, useCallback } from "react";
import { dateToKey } from "@/lib/calendar-utils";
import { DEFAULT_CATEGORIES } from "@/lib/constants";

export interface NoteCategory {
  id: string;
  label: string;
  color: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  dateKey: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

const NOTES_STORAGE_KEY = "calendar-notes";
const CATEGORIES_STORAGE_KEY = "calendar-categories";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<NoteCategory[]>([...DEFAULT_CATEGORIES]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(NOTES_STORAGE_KEY);
      if (stored) setNotes(JSON.parse(stored));

      const storedCats = localStorage.getItem(CATEGORIES_STORAGE_KEY);
      if (storedCats) setCategories(JSON.parse(storedCats));
    } catch {
      // ignore
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
  }, [notes, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
  }, [categories, isLoaded]);

  const addNote = useCallback(
    (date: Date, title: string, content: string, categoryId: string) => {
      const now = new Date().toISOString();
      const note: Note = {
        id: generateId(),
        title,
        content,
        dateKey: dateToKey(date),
        categoryId,
        createdAt: now,
        updatedAt: now,
      };
      setNotes((prev) => [note, ...prev]);
      return note;
    },
    []
  );

  const updateNote = useCallback(
    (id: string, updates: Partial<Pick<Note, "title" | "content" | "categoryId">>) => {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === id
            ? { ...n, ...updates, updatedAt: new Date().toISOString() }
            : n
        )
      );
    },
    []
  );

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const getNotesForDate = useCallback(
    (date: Date): Note[] => {
      const key = dateToKey(date);
      return notes.filter((n) => n.dateKey === key);
    },
    [notes]
  );

  const getNotesForMonth = useCallback(
    (year: number, month: number): Note[] => {
      const prefix = `${year}-${String(month + 1).padStart(2, "0")}`;
      return notes.filter((n) => n.dateKey.startsWith(prefix));
    },
    [notes]
  );

  const getNotesCountForDate = useCallback(
    (date: Date): number => {
      const key = dateToKey(date);
      return notes.filter((n) => n.dateKey === key).length;
    },
    [notes]
  );

  const addCategory = useCallback((label: string, color: string) => {
    const cat: NoteCategory = {
      id: `custom-${generateId()}`,
      label,
      color,
    };
    setCategories((prev) => [...prev, cat]);
    return cat;
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return {
    notes,
    categories,
    isLoaded,
    addNote,
    updateNote,
    deleteNote,
    getNotesForDate,
    getNotesForMonth,
    getNotesCountForDate,
    addCategory,
    deleteCategory,
  };
}
