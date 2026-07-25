"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CLIENT_STORAGE_KEYS } from "@/lib/storage-keys";
import { mockResumeAnalysis } from "../data/mockResumeAnalysis";
import type {
  LegacyMockResumeAnalysisResult,
  ResumeFile,
  ResumeUploadStatus,
} from "../types";
import { validateResumeFile } from "../utils/resume-validation";

const MOCK_ANALYSIS_DELAY_MS = 1500;

export function useResumeUpload() {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [file, setFile] = useState<ResumeFile | null>(null);
  const [status, setStatus] = useState<ResumeUploadStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LegacyMockResumeAnalysisResult | null>(
    null
  );
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => clearTimer, [clearTimer]);

  const selectFile = useCallback(
    (nextFile: File | null) => {
      clearTimer();
      setResult(null);

      if (!nextFile) {
        setSourceFile(null);
        setFile(null);
        setStatus("idle");
        setError(null);
        return;
      }

      const validationError = validateResumeFile(nextFile);
      if (validationError) {
        setSourceFile(null);
        setFile(null);
        setStatus("idle");
        setError(validationError);
        return;
      }

      setSourceFile(nextFile);
      setFile({
        name: nextFile.name,
        size: nextFile.size,
        type: nextFile.type,
        lastModified: nextFile.lastModified,
      });
      setStatus("ready");
      setError(null);
    },
    [clearTimer]
  );

  const removeFile = useCallback(() => {
    clearTimer();
    setSourceFile(null);
    setFile(null);
    setResult(null);
    setStatus("idle");
    setError(null);
  }, [clearTimer]);

  const analyzeResume = useCallback(async () => {
    if (!sourceFile) {
      setError("Analizi başlatmak için önce PDF formatında bir CV seçin.");
      return;
    }

    clearTimer();
    setStatus("analyzing");
    setError(null);

    try {
      await new Promise<void>((resolve) => {
        timerRef.current = setTimeout(resolve, MOCK_ANALYSIS_DELAY_MS);
      });
      timerRef.current = null;
      window.localStorage.setItem(
        CLIENT_STORAGE_KEYS.resumeAnalysisContext,
        JSON.stringify({
          detectedSkills: mockResumeAnalysis.detectedSkills.map((skill) => skill.name),
          strengths: mockResumeAnalysis.strengths,
          summary: mockResumeAnalysis.summary,
          experienceSummary:
            "Yazılım geliştirme ve veri analizi odaklı proje deneyimi.",
          projectSummary:
            "Yapay zekâ, web geliştirme ve veri analizi projeleri.",
        })
      );
      setResult(mockResumeAnalysis);
      setStatus("complete");
    } catch {
      setStatus("ready");
      setError("CV analizi sırasında bir sorun oluştu. Lütfen tekrar deneyin.");
    }
  }, [clearTimer, sourceFile]);

  return {
    file,
    status,
    error,
    result,
    selectFile,
    removeFile,
    analyzeResume,
    reset: removeFile,
    isAnalyzing: status === "analyzing",
    canAnalyze: status === "ready" && Boolean(sourceFile),
  };
}
