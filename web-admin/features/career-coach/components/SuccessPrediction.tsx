import type { SuccessPrediction as SuccessPredictionType } from "../types";

export function SuccessPrediction({
  prediction,
}: {
  prediction: SuccessPredictionType;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface2/40 p-4">
      <h3 className="font-semibold">Başarı tahmini</h3>
      <div className="mt-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-4xl font-semibold tracking-tight">
            %{prediction.percent}
          </p>
          <p className="mt-1 text-sm text-text2">{prediction.label}</p>
        </div>
        <div
          className="relative flex size-20 items-center justify-center rounded-full p-1.5"
          style={{
            background: `conic-gradient(var(--brand) ${prediction.percent}%, var(--surface) 0)`,
          }}
          aria-label={`Tahmini başarı yüzde ${prediction.percent}`}
        >
          <div className="flex size-full items-center justify-center rounded-full bg-surface2 text-sm font-semibold">
            {prediction.percent}
          </div>
        </div>
      </div>
      <ul className="mt-4 grid grid-cols-3 gap-2">
        {prediction.factors.map((factor) => (
          <li
            key={factor.label}
            className="rounded-xl border border-border bg-surface/50 px-2 py-2 text-center"
          >
            <p className="text-[11px] uppercase tracking-[0.12em] text-text2">
              {factor.label}
            </p>
            <p className="mt-1 text-sm font-semibold">
              {factor.value === null ? "—" : factor.value}
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs leading-5 text-text2">{prediction.detail}</p>
    </div>
  );
}
