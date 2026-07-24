import { Input } from "@/app/components/ui/input";

export function InternshipSearch({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative">
      <span
        aria-hidden
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text2"
      >
        ⌕
      </span>
      <Input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Pozisyon, şirket, teknoloji veya yetkinlik ara"
        aria-label="Staj ilanlarında ara"
        className="pl-11"
      />
    </div>
  );
}
