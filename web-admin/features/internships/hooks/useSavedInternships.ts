"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { CLIENT_STORAGE_KEYS } from "@/lib/storage-keys";

const CHANGE_EVENT = "internai:saved-internships-change";

function getSnapshot() {
  return window.localStorage.getItem(CLIENT_STORAGE_KEYS.savedInternships) ?? "[]";
}

function getServerSnapshot() {
  return "[]";
}

function parseSavedIds(value: string) {
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}

function subscribe(callback: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === CLIENT_STORAGE_KEYS.savedInternships) callback();
  };
  window.addEventListener("storage", handleStorage);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

export function useSavedInternships() {
  const serializedIds = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
  const savedIds = useMemo(() => parseSavedIds(serializedIds), [serializedIds]);

  const toggleSaved = useCallback((internshipId: string) => {
    try {
      const current = parseSavedIds(getSnapshot());
      const removing = current.includes(internshipId);
      const next = removing
        ? current.filter((id) => id !== internshipId)
        : [...current, internshipId];
      window.localStorage.setItem(
        CLIENT_STORAGE_KEYS.savedInternships,
        JSON.stringify(next)
      );
      window.dispatchEvent(new Event(CHANGE_EVENT));
      return removing ? "removed" : "saved";
    } catch {
      return "storage-error";
    }
  }, []);

  const isSaved = useCallback(
    (internshipId: string) => savedIds.includes(internshipId),
    [savedIds]
  );

  return { savedIds, isSaved, toggleSaved };
}
