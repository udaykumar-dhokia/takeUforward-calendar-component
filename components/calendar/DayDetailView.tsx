"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  CaretLeft,
  CaretRight,
  Plus,
  NoteBlank,
} from "@phosphor-icons/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  getMonthName,
  getOrdinalSuffix,
  addDays,
  isSameDay,
} from "@/lib/calendar-utils";
import { getMonthMeta } from "@/lib/month-images";
import type { Note, NoteCategory } from "@/hooks/useNotes";
import { NoteItem } from "./NoteItem";
import { NoteEditor } from "./NoteEditor";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface DayDetailViewProps {
  date: Date;
  notes: Note[];
  categories: NoteCategory[];
  onClose: () => void;
  onAddNote: (date: Date, title: string, content: string, categoryId: string, imageUrl?: string) => void;
  onUpdateNote: (id: string, updates: Partial<Pick<Note, "title" | "content" | "categoryId" | "imageUrl">>) => void;
  onDeleteNote: (id: string) => void;
  onAddCategory: (label: string, color: string) => void;
  onNavigateDate: (date: Date) => void;
}

export function DayDetailView({
  date,
  notes,
  categories,
  onClose,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onAddCategory,
  onNavigateDate,
}: DayDetailViewProps) {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [viewingNote, setViewingNote] = useState<Note | null>(null);

  const meta = getMonthMeta(date.getMonth());
  const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
  const dayNum = date.getDate();
  const suffix = getOrdinalSuffix(dayNum);
  const isToday = isSameDay(date, new Date());

  const handlePrevDay = useCallback(() => {
    onNavigateDate(addDays(date, -1));
  }, [date, onNavigateDate]);

  const handleNextDay = useCallback(() => {
    onNavigateDate(addDays(date, 1));
  }, [date, onNavigateDate]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (isEditorOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrevDay();
      if (e.key === "ArrowRight") handleNextDay();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, handlePrevDay, handleNextDay, isEditorOpen]);

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setIsEditorOpen(true);
  };

  const handleSave = (title: string, content: string, categoryId: string, imageUrl?: string) => {
    if (editingNote) {
      onUpdateNote(editingNote.id, { title, content, categoryId, imageUrl });
      toast.success("Note updated!");
    } else {
      onAddNote(date, title, content, categoryId, imageUrl);
      toast.success("Note added!");
    }
    setEditingNote(null);
  };

  const handleDelete = (id: string) => {
    onDeleteNote(id);
    toast.success("Note deleted");
  };

  const dateLabel = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 bg-(--cal-bg)"
    >
      <div className="h-full flex flex-col lg:flex-row">
        {/* Left Panel — Hero Image */}
        <motion.div
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.1 }}
          className="relative lg:w-1/2 h-56 sm:h-64 lg:h-full shrink-0 overflow-hidden"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={date.getTime()}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0"
            >
              <div
                className="absolute inset-0 bg-linear-to-br from-(--cal-accent)/70 via-(--cal-accent)/30 to-(--cal-dark)/50"
                style={{
                  backgroundImage: `url(${meta.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-black/10" />
              <div className="absolute inset-0 bg-linear-to-r from-black/20 to-transparent" />
            </motion.div>
          </AnimatePresence>

          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="cursor-pointer absolute top-6 mt-safe md:top-6 left-4 md:left-6 flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 backdrop-blur-md text-white text-sm font-medium hover:bg-white/20 transition-colors z-50 touch-manipulation"
          >
            <ArrowLeft className="size-4" weight="bold" />
            Back
          </motion.button>

          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 lg:p-12 z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={date.getTime()}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -30, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                <p className="text-white/50 text-xs font-medium tracking-[0.2em] uppercase mb-2">
                  {meta.season} · {date.getFullYear()}
                </p>
                <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[0.85] tracking-tight">
                  {dayNum}
                  <sup className="text-lg md:text-xl lg:text-2xl font-normal text-white/60 ml-1">
                    {suffix}
                  </sup>
                </h1>
                <div className="flex items-center gap-3 mt-3">
                  <p className="text-white/80 text-lg md:text-xl font-medium">
                    {dayName}
                  </p>
                  {isToday && (
                    <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-xs font-medium backdrop-blur-sm">
                      Today
                    </span>
                  )}
                </div>
                <p className="text-white/50 text-sm mt-1">
                  {getMonthName(date.getMonth())} {date.getFullYear()}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center gap-2 mt-6">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePrevDay}
                className="cursor-pointer flex items-center gap-1 px-3 py-2 rounded-xl bg-white/10 backdrop-blur-md text-white text-sm hover:bg-white/20 transition-colors"
              >
                <CaretLeft className="size-4" weight="bold" />
                Prev
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleNextDay}
                className="cursor-pointer flex items-center gap-1 px-3 py-2 rounded-xl bg-white/10 backdrop-blur-md text-white text-sm hover:bg-white/20 transition-colors"
              >
                Next
                <CaretRight className="size-4" weight="bold" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.2 }}
          className="flex-1 flex flex-col min-h-0 overflow-hidden"
        >
          <div className="p-6 md:p-8 lg:p-10 flex flex-col flex-1 min-h-0">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-heading font-bold text-(--cal-dark)">
                  Notes
                </h2>
                <p className="text-sm text-(--cal-muted) mt-0.5">
                  {notes.length} {notes.length === 1 ? "note" : "notes"} for this day
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setEditingNote(null);
                  setIsEditorOpen(true);
                }}
                className="flex cursor-pointer items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-(--cal-accent) text-white shadow-md shadow-(--cal-accent)/25 hover:shadow-lg transition-shadow"
              >
                <Plus className="size-4" weight="bold" />
                Add Note
              </motion.button>
            </div>

            <Separator className="mb-6 bg-(--cal-border)" shrink-0 />

            <div className="flex-1 overflow-y-auto -mx-1 px-1 pb-4 no-scrollbar">
              {notes.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <div className="size-16 rounded-2xl bg-(--cal-surface) flex items-center justify-center mb-4">
                    <NoteBlank className="size-8 text-(--cal-muted)" />
                  </div>
                  <p className="text-base font-heading font-semibold text-(--cal-dark)">
                    No notes for this day
                  </p>
                  <p className="text-sm text-(--cal-muted) mt-1 max-w-[240px]">
                    Click &quot;Add Note&quot; to start capturing your thoughts
                  </p>
                </motion.div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  <AnimatePresence mode="popLayout">
                    {notes.map((note, i) => (
                      <NoteItem
                        key={note.id}
                        note={note}
                        category={categories.find((c) => c.id === note.categoryId)}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onView={(n) => setViewingNote(n)}
                        index={i}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {isEditorOpen && (
          <NoteEditor
            isOpen={isEditorOpen}
            onClose={() => {
              setIsEditorOpen(false);
              setEditingNote(null);
            }}
            onSave={handleSave}
            categories={categories}
            onAddCategory={onAddCategory}
            editingNote={editingNote}
            dateLabel={dateLabel}
          />
        )}
      </AnimatePresence>

      <Dialog open={!!viewingNote} onOpenChange={(open) => !open && setViewingNote(null)}>
        <DialogContent className="bg-(--cal-bg) border-(--cal-border) max-w-lg p-0 overflow-hidden sm:rounded-2xl">
          {viewingNote && (
            <>
              {viewingNote.imageUrl && (
                <div className="w-full h-48 sm:h-64 overflow-hidden bg-(--cal-surface) shrink-0 border-b border-(--cal-border)">
                  <img src={viewingNote.imageUrl} alt="Note Attachment" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-6">
                <DialogHeader className="mb-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <DialogTitle className="text-xl font-heading text-(--cal-dark)">
                      {viewingNote.title}
                    </DialogTitle>
                    {categories.find(c => c.id === viewingNote.categoryId) && (
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                        style={{
                          backgroundColor: `${categories.find(c => c.id === viewingNote.categoryId)?.color}15`,
                          color: categories.find(c => c.id === viewingNote.categoryId)?.color,
                        }}
                      >
                        {categories.find(c => c.id === viewingNote.categoryId)?.label}
                      </span>
                    )}
                  </div>
                  <DialogDescription className="text-xs text-(--cal-muted)">
                    Created on {new Date(viewingNote.createdAt).toLocaleDateString()}
                  </DialogDescription>
                </DialogHeader>
                <div className="text-sm text-(--cal-dark) leading-relaxed whitespace-pre-wrap">
                  {viewingNote.content || <span className="italic text-(--cal-muted)">No additional details.</span>}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
