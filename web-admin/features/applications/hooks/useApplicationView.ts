"use client";

import { useCallback, useSyncExternalStore } from "react";
import { CLIENT_STORAGE_KEYS } from "@/lib/storage-keys";
import type { ApplicationView } from "../types";

const CHANGE_EVENT = "internai:applications-view-change";

function getSnapshot(): ApplicationView {
  const value = window.localStorage.getItem(CLIENT_STORAGE_KEYS.applicationsView);
  return value === "list" ? "list" : "kanban";
}

function subscribe(callback: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === CLIENT_STORAGE_KEYS.applicationsView) callback();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

export function useApplicationView() {
  const view = useSyncExternalStore<ApplicationView>(
    subscribe,
    getSnapshot,
    () => "kanban"
  );
  const setView = useCallback((next: ApplicationView) => {
    window.localStorage.setItem(CLIENT_STORAGE_KEYS.applicationsView, next);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);
  return { view, setView };
}
