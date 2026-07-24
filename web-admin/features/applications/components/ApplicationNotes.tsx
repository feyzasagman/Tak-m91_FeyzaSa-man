"use client";

import { useEffect, useRef, useState } from "react";
import type { ApplicationNote } from "../types";
import { formatApplicationDateTime } from "../utils/application-utils";

export function ApplicationNotes({
  notes,
  autoFocus = false,
  onAdd,
  onUpdate,
  onRemove,
  onMessage,
}: {
  notes: ApplicationNote[];
  autoFocus?: boolean;
  onAdd: (content: string) => boolean;
  onUpdate: (noteId: string, content: string) => boolean;
  onRemove: (noteId: string) => boolean;
  onMessage: (message: string) => void;
}) {
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const add = () => {
    if (!content.trim()) {
      onMessage("Boş not eklenemez.");
      return;
    }
    if (onAdd(content)) {
      setContent("");
      onMessage("Not eklendi.");
    } else {
      onMessage("İşlem sırasında bir hata oluştu.");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <textarea
          ref={inputRef}
          value={content}
          onChange={(event) => setContent(event.target.value.slice(0, 1000))}
          placeholder="Başvuruyla ilgili bir not ekle..."
          className="min-h-24 w-full rounded-2xl border border-border bg-bg p-3 text-sm outline-none focus:border-brand"
        />
        <div className="mt-2 flex items-center justify-between gap-3">
          <span className="text-xs text-text2">{content.length}/1000</span>
          <button type="button" onClick={add} className="ui-button ui-button-brand">Not Ekle</button>
        </div>
      </div>

      <div className="space-y-3">
        {[...notes].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).map((note) => (
          <article key={note.id} className="rounded-2xl border border-border bg-bg p-4">
            {editingId === note.id ? (
              <>
                <textarea
                  value={editingContent}
                  onChange={(event) => setEditingContent(event.target.value.slice(0, 1000))}
                  className="min-h-24 w-full rounded-xl border border-border bg-surface2 p-3 text-sm outline-none focus:border-brand"
                />
                <div className="mt-2 flex justify-end gap-2">
                  <button type="button" onClick={() => setEditingId(null)} className="ui-button ui-button-secondary">Vazgeç</button>
                  <button
                    type="button"
                    onClick={() => {
                      if (onUpdate(note.id, editingContent)) {
                        setEditingId(null);
                        onMessage("Not güncellendi.");
                      } else onMessage("Not güncellenemedi.");
                    }}
                    className="ui-button ui-button-brand"
                  >
                    Kaydet
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="whitespace-pre-wrap text-sm leading-6 text-text2">{note.content}</p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <time className="text-xs text-text2">{formatApplicationDateTime(note.updatedAt)}</time>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(note.id);
                        setEditingContent(note.content);
                      }}
                      className="text-xs font-semibold text-brand"
                    >
                      Düzenle
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!window.confirm("Bu notu silmek istediğine emin misin?")) return;
                        onMessage(onRemove(note.id) ? "Not silindi." : "Not silinemedi.");
                      }}
                      className="text-xs font-semibold text-danger"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              </>
            )}
          </article>
        ))}
        {notes.length === 0 && <p className="text-sm text-text2">Henüz not eklenmedi.</p>}
      </div>
    </div>
  );
}
