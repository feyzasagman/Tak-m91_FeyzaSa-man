import { assistantTones } from "../data/assistant-config";
import type { AssistantTone } from "../types";

export function ToneSelector({
  value,
  onChange,
}: {
  value: AssistantTone;
  onChange: (tone: AssistantTone) => void;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-medium">Metin tonu</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {assistantTones.map((tone) => (
          <button
            key={tone.id}
            type="button"
            onClick={() => onChange(tone.id)}
            aria-pressed={value === tone.id}
            className={`rounded-full border px-3 py-2 text-xs font-medium transition ${
              value === tone.id
                ? "border-brand bg-brand/15 text-brand"
                : "border-border bg-surface2 text-text2 hover:text-text"
            }`}
          >
            {tone.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
