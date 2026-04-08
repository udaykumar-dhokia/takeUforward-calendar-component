"use client";

import { motion } from "framer-motion";
import { Trash, PencilSimple, Image as ImageIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import type { Note, NoteCategory } from "@/hooks/useNotes";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface NoteItemProps {
  note: Note;
  category: NoteCategory | undefined;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onView: (note: Note) => void;
  index: number;
}

export function NoteItem({ note, category, onEdit, onDelete, onView, index }: NoteItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      transition={{
        delay: index * 0.05,
        type: "spring",
        stiffness: 500,
        damping: 30,
      }}
      onClick={() => onView(note)}
      className="group relative p-3.5 rounded-xl bg-(--cal-surface) border border-(--cal-border) hover:border-(--cal-accent)/30 transition-all duration-200 hover:shadow-sm cursor-pointer"
    >
      <div className="flex items-start gap-3">
        <div
          className="mt-1 w-1 h-8 rounded-full shrink-0"
          style={{ backgroundColor: category?.color ?? "var(--cal-muted)" }}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-semibold text-(--cal-dark) truncate">
              {note.title}
            </h4>
            {category && (
              <span
                className="shrink-0 text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                style={{
                  backgroundColor: `${category.color}15`,
                  color: category.color,
                }}
              >
                {category.label}
              </span>
            )}
          </div>

          {note.content && (
            <p className="text-xs text-(--cal-muted) line-clamp-2 leading-relaxed mb-1.5">
              {note.content}
            </p>
          )}

          {note.imageUrl && (
            <div className="flex items-center gap-1.5 text-[10px] font-medium text-(--cal-accent) bg-(--cal-accent)/10 w-fit px-1.5 py-0.5 rounded-md mt-1.5">
              <ImageIcon weight="bold" className="size-3" />
              Attached Image
            </div>
          )}
        </div>

        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); onEdit(note); }}
            className="cursor-pointer p-1.5 rounded-lg text-(--cal-muted) hover:text-(--cal-accent) hover:bg-(--cal-accent)/10 transition-colors"
          >
            <PencilSimple className="size-3.5" weight="bold" />
          </motion.button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="cursor-pointer p-1.5 rounded-lg text-(--cal-muted) hover:text-red-500 hover:bg-red-500/10 transition-colors"
              >
                <Trash className="size-3.5" weight="bold" />
              </motion.button>
            </AlertDialogTrigger>
            <AlertDialogContent onClick={(e) => e.stopPropagation()} className="bg-(--cal-bg) border-(--cal-border)">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-(--cal-dark)">Delete Note</AlertDialogTitle>
                <AlertDialogDescription className="text-(--cal-muted)">
                  Are you sure you want to delete "{note.title}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer border-(--cal-border) text-(--cal-dark) hover:bg-(--cal-hover) hover:text-(--cal-dark)">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={(e) => { e.stopPropagation(); onDelete(note.id); }} className="cursor-pointer bg-red-500 text-white hover:bg-red-600 border-transparent">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </motion.div>
  );
}
