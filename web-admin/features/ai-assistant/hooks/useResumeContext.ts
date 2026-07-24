"use client";

import { useMemo, useSyncExternalStore } from "react";
import { CLIENT_STORAGE_KEYS } from "@/lib/storage-keys";
import {
  parseStoredResumeContext,
  RESUME_CONTEXT_UPDATED_EVENT,
} from "@/features/resume-analysis/utils/resumeContextStorage";

function subscribe(callback: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === CLIENT_STORAGE_KEYS.resumeAnalysisContext) callback();
  };
  const onContextUpdated = () => callback();
  window.addEventListener("storage", onStorage);
  window.addEventListener(RESUME_CONTEXT_UPDATED_EVENT, onContextUpdated);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(RESUME_CONTEXT_UPDATED_EVENT, onContextUpdated);
  };
}

function getSnapshot() {
  return (
    window.localStorage.getItem(CLIENT_STORAGE_KEYS.resumeAnalysisContext) ??
    "null"
  );
}

export function useResumeContext() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => "null");
  return useMemo(() => parseStoredResumeContext(snapshot), [snapshot]);
}
