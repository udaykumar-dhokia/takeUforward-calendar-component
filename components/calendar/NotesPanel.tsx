"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, NoteBlank } from "@phosphor-icons/react";
import { formatDateShort, formatDate } from "@/lib/calendar-utils";
import type { Note, NoteCategory } from "@/hooks/useNotes";
import { NoteItem } from "./NoteItem";
import { NoteEditor } from "./NoteEditor";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface NotesPanelProps {
  selectedDate: Date | null;
  rangeStart: Date | null;
  rangeEnd: Date | null;
  notes: Note[];
  categories: NoteCategory[];
  onAddNote: (date: Date, title: string, content: string, categoryId: string) => void;
  onUpdateNote: (id: string, updates: Partial<Pick<Note, "title" | "content" | "categoryId">>) => void;
  onDeleteNote: (id: string) => void;
  onAddCategory: (label: string, color: string) => void;
}

export function NotesPanel({
  selectedDate,
  rangeStart,
  rangeEnd,
  notes,
  categories,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onAddCategory,
}: NotesPanelProps) {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [viewingNote, setViewingNote] = useState<Note | null>(null);

  const activeDate = selectedDate ?? rangeStart;

  const handleSave = (title: string, content: string, categoryId: string) => {
    if (editingNote) {
      onUpdateNote(editingNote.id, { title, content, categoryId });
    } else if (activeDate) {
      onAddNote(activeDate, title, content, categoryId);
    }
    setEditingNote(null);
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setIsEditorOpen(true);
  };

  const dateLabel = activeDate
    ? formatDate(activeDate)
    : rangeStart && rangeEnd
      ? `${formatDateShort(rangeStart)} — ${formatDateShort(rangeEnd)}`
      : "Select a date";

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex items-center justify-between px-1 mb-3">
        <div>
          <h3 className="text-sm font-heading font-semibold text-(--cal-dark)">
            Notes
          </h3>
          <p className="text-xs text-(--cal-muted) mt-0.5">
            {notes.length} {notes.length === 1 ? "note" : "notes"}
          </p>
        </div>

        {activeDate && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setEditingNote(null);
              setIsEditorOpen(true);
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-(--cal-accent) text-white shadow-sm shadow-(--cal-accent)/25 hover:shadow-md transition-shadow"
          >
            <Plus className="size-3.5" weight="bold" />
            Add
          </motion.button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto -mx-1 px-1 no-scrollbar">
        {notes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className="size-12 rounded-2xl bg-(--cal-surface) flex items-center justify-center mb-3">
              <NoteBlank className="size-6 text-(--cal-muted)" />
            </div>
            <p className="text-sm font-medium text-(--cal-dark)">
              {activeDate ? "No notes yet" : "Select a date"}
            </p>
            <p className="text-xs text-(--cal-muted) mt-1 max-w-[200px]">
              {activeDate
                ? "Tap the + button to add your first note"
                : "Click on a date to view and add notes"}
            </p>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-2">
            <AnimatePresence mode="popLayout">
              {notes.map((note, i) => (
                <NoteItem
                  key={note.id}
                  note={note}
                  category={categories.find((c) => c.id === note.categoryId)}
                  onEdit={handleEdit}
                  onDelete={onDeleteNote}
                  onView={(n) => setViewingNote(n)}
                  index={i}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
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
    </div>
  );
}
