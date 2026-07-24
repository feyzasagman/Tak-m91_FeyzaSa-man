"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { CLIENT_STORAGE_KEYS } from "@/lib/storage-keys";
import type { GeneratedApplication } from "../types";

const CHANGE_EVENT = "internai:generated-applications-change";

function getSnapshot() {
  return (
    window.localStorage.getItem(CLIENT_STORAGE_KEYS.generatedApplications) ??
    "[]"
  );
}

function subscribe(callback: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === CLIENT_STORAGE_KEYS.generatedApplications) callback();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

function parse(value: string): GeneratedApplication[] {
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter(
          (item): item is GeneratedApplication =>
            typeof item === "object" &&
            item !== null &&
            typeof (item as GeneratedApplication).id === "string" &&
            typeof (item as GeneratedApplication).content === "string"
        )
      : [];
  } catch {
    return [];
  }
}

function persist(items: GeneratedApplication[]) {
  window.localStorage.setItem(
    CLIENT_STORAGE_KEYS.generatedApplications,
    JSON.stringify(items)
  );
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function useGeneratedApplications() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => "[]");
  const items = useMemo(
    () =>
      parse(snapshot).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [snapshot]
  );

  const save = useCallback(
    (
      draft: Omit<GeneratedApplication, "id" | "createdAt" | "updatedAt">,
      existingId?: string
    ) => {
      const current = parse(getSnapshot());
      const now = new Date().toISOString();
      if (existingId) {
        const existing = current.find((item) => item.id === existingId);
        if (existing) {
          persist(
            current.map((item) =>
              item.id === existingId ? { ...item, ...draft, updatedAt: now } : item
            )
          );
          return existingId;
        }
      }
      const id = crypto.randomUUID();
      persist([
        {
          ...draft,
          id,
          createdAt: now,
          updatedAt: now,
        },
        ...current,
      ]);
      return id;
    },
    []
  );

  const remove = useCallback((id: string) => {
    persist(parse(getSnapshot()).filter((item) => item.id !== id));
  }, []);

  const update = useCallback((id: string, content: string) => {
    const now = new Date().toISOString();
    persist(
      parse(getSnapshot()).map((item) =>
        item.id === id ? { ...item, content, updatedAt: now } : item
      )
    );
  }, []);

  return { items, save, remove, update };
}
