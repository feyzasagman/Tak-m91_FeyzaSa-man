export function ResumeTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label htmlFor="resume-extracted-text" className="text-sm font-semibold">
        Çıkarılan metni düzenle
      </label>
      <p className="mt-1 text-xs leading-5 text-text2">
        PDF düzeninden kaynaklanan hataları düzeltebilirsin. Değişiklikler yalnızca
        tarayıcındaki CV bağlamına kaydedilir.
      </p>
      <textarea
        id="resume-extracted-text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={18}
        className="mt-3 w-full resize-y rounded-2xl border border-border bg-surface2 px-4 py-3 text-sm leading-6 outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/15"
      />
    </div>
  );
}
