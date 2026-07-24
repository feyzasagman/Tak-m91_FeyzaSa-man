import { SectionCard } from "@/app/components/ui/section-card";

export function ResumeAnalysisSection({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <SectionCard title={title} description={description} className={className}>
      {children}
    </SectionCard>
  );
}

export function ResumeBulletList({
  items,
  tone = "brand",
}: {
  items: string[];
  tone?: "brand" | "success" | "warning";
}) {
  const dotClass = {
    brand: "bg-brand",
    success: "bg-emerald-400",
    warning: "bg-amber-400",
  }[tone];

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-6 text-text2">
          <span className={`mt-2 size-1.5 shrink-0 rounded-full ${dotClass}`} />
          {item}
        </li>
      ))}
    </ul>
  );
}
