import { assistantModes } from "../data/assistant-config";
import type { AssistantMode } from "../types";

export function AssistantModeSelector({
  mode,
  onChange,
}: {
  mode: AssistantMode;
  onChange: (mode: AssistantMode) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {assistantModes.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
          aria-pressed={mode === item.id}
          className={`rounded-2xl border p-4 text-left transition ${
            mode === item.id
              ? "border-brand bg-brand/15 shadow-lg shadow-brand/10"
              : "border-border bg-surface hover:border-brand/40"
          }`}
        >
          <span className="text-xl" aria-hidden>{item.icon}</span>
          <span className="mt-3 block text-sm font-semibold">{item.title}</span>
          <span className="mt-1 block text-xs leading-5 text-text2">{item.description}</span>
        </button>
      ))}
    </div>
  );
}
