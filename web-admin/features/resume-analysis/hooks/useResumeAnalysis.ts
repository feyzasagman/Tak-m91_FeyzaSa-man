"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  analyzeResume,
  ResumeAnalysisRequestError,
} from "../services/analyzeResume";
import type {
  ResumeAnalysisProgress,
  ResumeAnalysisRequest,
  ResumeAnalysisResult,
} from "../types/resumeAnalysis";
import { useResumeAnalysisHistory } from "./useResumeAnalysisHistory";

export function useResumeAnalysis() {
  const {
    items: analysisHistory,
    add: addHistoryItem,
    remove: removeHistoryItem,
    load: loadHistory,
  } = useResumeAnalysisHistory();
  const [analysisProgress, setAnalysisProgress] =
    useState<ResumeAnalysisProgress>("idle");
  const [analysisResult, setAnalysisResult] =
    useState<ResumeAnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const cancelAnalysis = useCallback(() => {
    controllerRef.current?.abort();
  }, []);

  useEffect(() => () => controllerRef.current?.abort(), []);

  const clearAnalysis = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    setAnalysisProgress("idle");
    setAnalysisResult(null);
    setAnalysisError(null);
  }, []);

  const analyze = useCallback(
    async (
      input: ResumeAnalysisRequest,
      historyMeta?: {
        fileName: string;
        company: string;
        position: string;
      }
    ) => {
      const controller = new AbortController();
      controllerRef.current = controller;
      setAnalysisProgress("analyzing");
      setAnalysisError(null);

      try {
        const result = await analyzeResume(input, controller.signal);
        setAnalysisResult(result);
        setAnalysisProgress("complete");
        addHistoryItem({
          fileName: historyMeta?.fileName ?? input.fileName ?? "CV",
          internshipId: input.internshipId ?? input.internshipContext?.id ?? null,
          company:
            historyMeta?.company ??
            input.internshipContext?.company ??
            "Genel CV analizi",
          position:
            historyMeta?.position ??
            input.internshipContext?.title ??
            "İlan seçilmedi",
          fullResult: result,
        });
        return result;
      } catch (err) {
        const requestError =
          err instanceof ResumeAnalysisRequestError
            ? err
            : new ResumeAnalysisRequestError(
                "CV analizi sırasında bir hata oluştu.",
                "AI_ERROR"
              );
        if (requestError.code === "CANCELLED") {
          setAnalysisProgress("cancelled");
          setAnalysisError(null);
        } else {
          setAnalysisProgress("error");
          setAnalysisError(requestError.message);
        }
        return null;
      } finally {
        if (controllerRef.current === controller) controllerRef.current = null;
      }
    },
    [addHistoryItem]
  );

  const loadResult = useCallback((result: ResumeAnalysisResult) => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    setAnalysisResult(result);
    setAnalysisError(null);
    setAnalysisProgress("complete");
  }, []);

  return {
    isAnalyzing: analysisProgress === "analyzing",
    analysisResult,
    analysisError,
    analysisProgress,
    analysisHistory,
    analyzeResume: analyze,
    cancelAnalysis,
    clearAnalysis,
    loadHistory,
    removeHistoryItem,
    loadResult,
  };
}
