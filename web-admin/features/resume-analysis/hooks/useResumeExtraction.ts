"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  extractResumeText,
  ResumeExtractionRequestError,
} from "@/features/resume-analysis/services/extractResumeText";
import type {
  ResumeExtractionProgress,
  ResumeExtractionResult,
} from "@/features/resume-analysis/types/resumeExtraction";
import type { ResumeFile } from "@/features/resume-analysis/types";
import { validateResumeFile } from "@/features/resume-analysis/utils/resume-validation";

export function useResumeExtraction() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [file, setFile] = useState<ResumeFile | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionResult, setExtractionResult] =
    useState<ResumeExtractionResult | null>(null);
  const [extractionError, setExtractionError] = useState<string | null>(null);
  const [progressState, setProgressState] =
    useState<ResumeExtractionProgress>("idle");
  const [editedText, setEditedText] = useState("");
  const controllerRef = useRef<AbortController | null>(null);

  const cancelExtraction = useCallback(() => {
    controllerRef.current?.abort();
  }, []);

  useEffect(() => () => controllerRef.current?.abort(), []);

  const resetExtraction = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    setSelectedFile(null);
    setFile(null);
    setUploadError(null);
    setIsExtracting(false);
    setExtractionResult(null);
    setExtractionError(null);
    setProgressState("idle");
    setEditedText("");
  }, []);

  const selectFile = useCallback((nextFile: File | null) => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    setExtractionResult(null);
    setExtractionError(null);
    setEditedText("");
    setIsExtracting(false);

    if (!nextFile) {
      setSelectedFile(null);
      setFile(null);
      setUploadError(null);
      setProgressState("idle");
      return;
    }

    const validationError = validateResumeFile(nextFile);
    if (validationError) {
      setSelectedFile(null);
      setFile(null);
      setUploadError(validationError);
      setProgressState("error");
      return;
    }

    setSelectedFile(nextFile);
    setFile({
      name: nextFile.name,
      size: nextFile.size,
      type: nextFile.type,
      lastModified: nextFile.lastModified,
    });
    setUploadError(null);
    setProgressState("ready");
  }, []);

  const removeFile = useCallback(() => {
    resetExtraction();
  }, [resetExtraction]);

  const extractText = useCallback(async () => {
    if (!selectedFile) {
      setUploadError("Lütfen bir PDF dosyası seçin.");
      setProgressState("error");
      return null;
    }

    const controller = new AbortController();
    controllerRef.current = controller;
    setUploadError(null);
    setExtractionError(null);
    setExtractionResult(null);
    setEditedText("");
    setIsExtracting(true);
    setProgressState("extracting");

    try {
      const result = await extractResumeText(selectedFile, controller.signal);
      setExtractionResult(result);
      setEditedText(result.cleanedText);
      setProgressState("complete");
      return result;
    } catch (error) {
      const requestError =
        error instanceof ResumeExtractionRequestError
          ? error
          : new ResumeExtractionRequestError(
              "CV işlenirken bir hata oluştu. Lütfen tekrar deneyin.",
              "EXTRACTION_FAILED"
            );
      if (requestError.code === "CANCELLED") {
        setProgressState("cancelled");
        setExtractionError(null);
      } else {
        setProgressState("error");
        setExtractionError(requestError.message);
      }
      return null;
    } finally {
      if (controllerRef.current === controller) controllerRef.current = null;
      setIsExtracting(false);
    }
  }, [selectedFile]);

  return {
    selectedFile,
    file,
    uploadError,
    isExtracting,
    extractionResult,
    extractionError,
    progressState,
    editedText,
    setEditedText,
    selectFile,
    removeFile,
    extractText,
    cancelExtraction,
    resetExtraction,
  };
}
