"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { CLIENT_STORAGE_KEYS } from "@/lib/storage-keys";
import type {
  ResumeAnalysis,
  ResumeAnalysisHistoryItem,
  ResumeAnalysisVerdict,
} from "../types/resumeAnalysis";

const CHANGE_EVENT = "internai:resume-analysis-history-change";
const MAX_HISTORY_ITEMS = 20;

function getSnapshot() {
  return (
    window.localStorage.getItem(CLIENT_STORAGE_KEYS.resumeAnalysisHistory) ??
    "[]"
  );
}

function subscribe(callback: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === CLIENT_STORAGE_KEYS.resumeAnalysisHistory) callback();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

function isHistoryItem(value: unknown): value is ResumeAnalysisHistoryItem {
  if (!value || typeof value !== "object") return false;
  const item = value as ResumeAnalysisHistoryItem;
  return (
    typeof item.id === "string" &&
    typeof item.createdAt === "string" &&
    typeof item.company === "string" &&
    typeof item.position === "string" &&
    typeof item.overallScore === "number" &&
    item.analysis !== undefined
  );
}

function parse(value: string): ResumeAnalysisHistoryItem[] {
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter(isHistoryItem) : [];
  } catch {
    return [];
  }
}

function persist(items: ResumeAnalysisHistoryItem[]) {
  window.localStorage.setItem(
    CLIENT_STORAGE_KEYS.resumeAnalysisHistory,
    JSON.stringify(items.slice(0, MAX_HISTORY_ITEMS))
  );
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function useResumeAnalysisHistory() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => "[]");
  const items = useMemo(
    () =>
      parse(snapshot).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [snapshot]
  );

  const add = useCallback(
    (input: {
      fileName: string;
      internshipId: string;
      company: string;
      position: string;
      analysis: ResumeAnalysis;
    }) => {
      const id = crypto.randomUUID();
      const createdAt = new Date().toISOString();
      const entry: ResumeAnalysisHistoryItem = {
        id,
        createdAt,
        fileName: input.fileName,
        internshipId: input.internshipId,
        company: input.company,
        position: input.position,
        overallScore: input.analysis.overallScore.value,
        atsScore: input.analysis.atsScore.value,
        verdict: input.analysis.verdict,
        analysis: input.analysis,
      };
      persist([entry, ...parse(getSnapshot())]);
      return id;
    },
    []
  );

  const remove = useCallback((id: string) => {
    persist(parse(getSnapshot()).filter((item) => item.id !== id));
  }, []);

  const getById = useCallback(
    (id: string) => items.find((item) => item.id === id) ?? null,
    [items]
  );

  return { items, add, remove, getById };
}

export function verdictLabel(verdict: ResumeAnalysisVerdict) {
  return verdict === "applicable"
    ? "Başvurulabilir"
    : "Önce CV geliştirilmeli";
}
