export const MAX_RESUME_SIZE_BYTES = 5 * 1024 * 1024;

export type ResumeValidationFile = {
  name: string;
  type: string;
  size: number;
};

export function validateResumeFile(file: ResumeValidationFile): string | null {
  const hasPdfExtension = file.name.toLocaleLowerCase("tr-TR").endsWith(".pdf");
  const hasPdfMimeType =
    file.type === "application/pdf" || file.type === "application/x-pdf";

  if (!hasPdfExtension || !hasPdfMimeType) {
    return "Yalnızca PDF formatındaki CV dosyaları desteklenmektedir.";
  }

  if (file.size > MAX_RESUME_SIZE_BYTES) {
    return "CV dosyası en fazla 5 MB olabilir.";
  }

  if (file.size === 0) {
    return "Seçtiğiniz PDF dosyası boş görünüyor.";
  }

  return null;
}

export function formatResumeFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
