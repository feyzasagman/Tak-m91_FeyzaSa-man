"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const STORAGE_KEY = "internai.saved-internships";
const CHANGE_EVENT = "internai:saved-internships-change";

function getSnapshot() {
  return window.localStorage.getItem(STORAGE_KEY) ?? "[]";
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
    if (event.key === STORAGE_KEY) callback();
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
    const current = parseSavedIds(getSnapshot());
    const next = current.includes(internshipId)
      ? current.filter((id) => id !== internshipId)
      : [...current, internshipId];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  const isSaved = useCallback(
    (internshipId: string) => savedIds.includes(internshipId),
    [savedIds]
  );

  return { savedIds, isSaved, toggleSaved };
}
