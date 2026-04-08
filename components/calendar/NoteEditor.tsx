"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, X, Image as ImageIcon, Trash } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Note, NoteCategory } from "@/hooks/useNotes";
import { NOTE_COLORS } from "@/lib/constants";

interface NoteEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, content: string, categoryId: string, imageUrl?: string) => void;
  categories: NoteCategory[];
  onAddCategory: (label: string, color: string) => void;
  editingNote?: Note | null;
  dateLabel: string;
}

export function NoteEditor({
  isOpen,
  onClose,
  onSave,
  categories,
  onAddCategory,
  editingNote,
  dateLabel,
}: NoteEditorProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCatLabel, setNewCatLabel] = useState("");
  const [newCatColor, setNewCatColor] = useState<string>(NOTE_COLORS[0].value);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title);
      setContent(editingNote.content);
      setCategoryId(editingNote.categoryId);
      setImageUrl(editingNote.imageUrl || "");
    } else {
      setTitle("");
      setContent("");
      setCategoryId(categories[0]?.id ?? "");
      setImageUrl("");
    }
  }, [editingNote, isOpen, categories]);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave(title.trim(), content.trim(), categoryId, imageUrl);
    setTitle("");
    setContent("");
    setImageUrl("");
    onClose();
  };

  const handleAddCategory = () => {
    if (!newCatLabel.trim()) return;
    onAddCategory(newCatLabel.trim(), newCatColor);
    setNewCatLabel("");
    setShowNewCategory(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.6);
        setImageUrl(dataUrl);
      };
      if (typeof event.target?.result === "string") {
        img.src = event.target.result;
      }
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="fixed inset-x-4 top-[10%] md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md z-50"
      >
        <div className="bg-(--cal-bg) rounded-2xl shadow-2xl border border-(--cal-border) overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-(--cal-border)">
            <div>
              <h3 className="text-base font-heading font-semibold text-(--cal-dark)">
                {editingNote ? "Edit Note" : "New Note"}
              </h3>
              <p className="text-xs text-(--cal-muted) mt-0.5">{dateLabel}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="cursor-pointer p-1.5 rounded-lg text-(--cal-muted) hover:bg-(--cal-hover) transition-colors"
            >
              <X className="size-4" weight="bold" />
            </motion.button>
          </div>

          <div className="p-5 flex flex-col gap-4">
            <div>
              <label className="text-xs font-medium text-(--cal-muted) mb-1.5 block">
                Title
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What's on your mind?"
                className="bg-(--cal-surface) border-(--cal-border) focus-visible:ring-(--cal-accent)"
                autoFocus
              />
            </div>

            <div>
              <label className="text-xs font-medium text-(--cal-muted) mb-1.5 block">
                Details
              </label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Add some details..."
                rows={3}
                className="bg-(--cal-surface) border-(--cal-border) focus-visible:ring-(--cal-accent) resize-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-(--cal-muted)">Image Attachment</label>
                {imageUrl && (
                  <button
                    onClick={() => setImageUrl("")}
                    className="cursor-pointer text-[10px] text-red-500 font-medium hover:underline flex items-center gap-0.5"
                  >
                    <Trash className="size-3" weight="bold" />
                    Remove
                  </button>
                )}
              </div>
              {imageUrl ? (
                <div className="relative w-full h-32 rounded-lg overflow-hidden border border-(--cal-border)">
                  <img src={imageUrl} alt="Attachment" className="w-full h-full object-cover" />
                </div>
              ) : (
                <label className="flex items-center justify-center gap-2 p-3 border border-dashed border-(--cal-border) rounded-lg cursor-pointer hover:bg-(--cal-hover) transition-colors text-xs font-medium text-(--cal-muted)">
                  <ImageIcon className="size-4" />
                  <span>Click to add an image</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-(--cal-muted)">
                  Category
                </label>
                <button
                  onClick={() => setShowNewCategory(!showNewCategory)}
                  className="cursor-pointer text-[10px] text-(--cal-accent) font-medium hover:underline flex items-center gap-0.5"
                >
                  <Plus className="size-3" weight="bold" />
                  New
                </button>
              </div>

              {showNewCategory && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mb-3 p-3 rounded-xl bg-(--cal-surface) border border-(--cal-border)"
                >
                  <Input
                    value={newCatLabel}
                    onChange={(e) => setNewCatLabel(e.target.value)}
                    placeholder="Category name"
                    className="mb-2 bg-(--cal-bg) border-(--cal-border) text-xs h-8"
                  />
                  <div className="flex items-center gap-1.5 mb-2">
                    {NOTE_COLORS.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setNewCatColor(c.value)}
                        className={cn(
                          "size-5 rounded-full transition-all cursor-pointer",
                          newCatColor === c.value && "ring-2 ring-offset-2 ring-(--cal-dark)"
                        )}
                        style={{ backgroundColor: c.value }}
                      />
                    ))}
                  </div>
                  <button
                    onClick={handleAddCategory}
                    className="cursor-pointer text-xs font-medium text-(--cal-accent) hover:underline"
                  >
                    Add Category
                  </button>
                </motion.div>
              )}

              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <motion.button
                    key={cat.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCategoryId(cat.id)}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer",
                      categoryId === cat.id
                        ? "ring-2 ring-offset-1 shadow-sm"
                        : "opacity-60 hover:opacity-100"
                    )}
                    style={{
                      backgroundColor: `${cat.color}20`,
                      color: cat.color,
                      ...(categoryId === cat.id ? { ringColor: cat.color } : {}),
                    }}
                  >
                    {cat.label}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-5 py-4 border-t border-(--cal-border)">
            <button
              onClick={onClose}
              className="cursor-pointer flex-1 py-2 text-sm font-medium text-(--cal-muted) rounded-xl hover:bg-(--cal-hover) transition-colors"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={!title.trim()}
              className={cn(
                "cursor-pointer flex-1 py-2 text-sm font-medium rounded-xl transition-all",
                title.trim()
                  ? "bg-(--cal-accent) text-white shadow-md shadow-(--cal-accent)/25 hover:shadow-lg"
                  : "bg-(--cal-muted)/20 text-(--cal-muted) cursor-not-allowed"
              )}
            >
              {editingNote ? "Save Changes" : "Add Note"}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
