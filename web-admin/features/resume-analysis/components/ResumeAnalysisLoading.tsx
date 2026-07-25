import { ResumeExtractionLoading } from "./ResumeExtractionLoading";

export function ResumeAnalysisLoading({
  onCancel,
}: {
  onCancel: () => void;
}) {
  return (
    <ResumeExtractionLoading
      onCancel={onCancel}
      title="AI CV analizi hazırlanıyor"
      description="Gemini, CV metnini güvenli biçimde değerlendiriyor. Bu işlem birkaç saniye sürebilir."
    />
  );
}
