export function SkillMatchList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "success" | "warning";
}) {
  return (
    <div>
      <h3
        className={`text-sm font-semibold ${
          tone === "success" ? "text-emerald-300" : "text-amber-300"
        }`}
      >
        {title}
      </h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.length ? (
          items.map((item) => (
            <span
              key={item}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                tone === "success"
                  ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-200"
                  : "border-amber-500/25 bg-amber-500/10 text-amber-200"
              }`}
            >
              {item}
            </span>
          ))
        ) : (
          <span className="text-sm text-text2">Bu grupta beceri bulunmuyor.</span>
        )}
      </div>
    </div>
  );
}
