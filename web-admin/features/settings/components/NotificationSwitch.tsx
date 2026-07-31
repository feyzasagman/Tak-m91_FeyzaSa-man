"use client";

type NotificationSwitchProps = {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (next: boolean) => void;
};

export function NotificationSwitch({
  id,
  label,
  description,
  checked,
  disabled = false,
  onChange,
}: NotificationSwitchProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-surface2 p-4">
      <div className="min-w-0">
        <label htmlFor={id} className="block text-sm font-medium">
          {label}
        </label>
        <p className="mt-1 text-xs leading-5 text-text2">{description}</p>
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-50 ${
          checked ? "bg-brand" : "bg-border"
        }`}
      >
        <span
          aria-hidden
          className={`absolute top-1 size-4 rounded-full bg-white transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}
