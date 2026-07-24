"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  analyzeResume,
  ResumeAnalysisRequestError,
} from "../services/analyzeResume";
import type {
  ResumeAnalysis,
  ResumeAnalysisMetadata,
  ResumeAnalysisRequest,
  ResumeAnalysisStatus,
} from "../types/resumeAnalysis";

export function useResumeAnalysis() {
  const [status, setStatus] = useState<ResumeAnalysisStatus>("idle");
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [metadata, setMetadata] = useState<ResumeAnalysisMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const cancel = useCallback(() => {
    controllerRef.current?.abort();
  }, []);

  useEffect(() => () => controllerRef.current?.abort(), []);

  const reset = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    setStatus("idle");
    setAnalysis(null);
    setMetadata(null);
    setError(null);
  }, []);

  const runAnalysis = useCallback(async (input: ResumeAnalysisRequest) => {
    const controller = new AbortController();
    controllerRef.current = controller;
    setStatus("analyzing");
    setError(null);

    try {
      const result = await analyzeResume(input, controller.signal);
      setAnalysis(result.analysis);
      setMetadata(result.metadata);
      setStatus("complete");
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
        setStatus("cancelled");
        setError(null);
      } else {
        setStatus("error");
        setError(requestError.message);
      }
      return null;
    } finally {
      if (controllerRef.current === controller) controllerRef.current = null;
    }
  }, []);

  const loadAnalysis = useCallback(
    (next: ResumeAnalysis, nextMetadata?: ResumeAnalysisMetadata | null) => {
      controllerRef.current?.abort();
      controllerRef.current = null;
      setAnalysis(next);
      setMetadata(nextMetadata ?? null);
      setError(null);
      setStatus("complete");
    },
    []
  );

  return {
    status,
    analysis,
    metadata,
    error,
    isAnalyzing: status === "analyzing",
    runAnalysis,
    cancel,
    reset,
    setAnalysis,
    loadAnalysis,
  };
}
