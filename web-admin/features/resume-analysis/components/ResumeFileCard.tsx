import { Card } from "@/app/components/ui/card";
import type { ResumeFile } from "../types";
import { formatResumeFileSize } from "../utils/resume-validation";

export function ResumeFileCard({
  file,
  onRemove,
  disabled = false,
}: {
  file: ResumeFile;
  onRemove: () => void;
  disabled?: boolean;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-red-500/10 text-sm font-bold text-red-300">
          PDF
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{file.name}</p>
          <p className="mt-1 text-sm text-text2">{formatResumeFileSize(file.size)}</p>
        </div>
        <button
          type="button"
          onClick={onRemove}
          disabled={disabled}
          className="ui-button ui-button-secondary px-3"
          aria-label={`${file.name} dosyasını kaldır`}
        >
          Kaldır
        </button>
      </div>
    </Card>
  );
}
