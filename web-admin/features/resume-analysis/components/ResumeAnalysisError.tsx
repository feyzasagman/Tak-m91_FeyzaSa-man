import { ResumeExtractionError } from "./ResumeExtractionError";

export function ResumeAnalysisError({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return <ResumeExtractionError message={message} onRetry={onRetry} />;
}
