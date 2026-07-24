import type { ResumeSkill } from "../types";

export function SkillBadgeList({ skills }: { skills: ResumeSkill[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill) => (
        <span
          key={skill.name}
          className={`inline-flex min-h-8 items-center rounded-full border px-3 text-xs font-medium ${
            skill.kind === "detected"
              ? "border-brand/30 bg-brand/10 text-brand"
              : "border-amber-500/30 bg-amber-500/10 text-amber-200"
          }`}
        >
          {skill.kind === "detected" ? "✓ " : "+ "}
          {skill.name}
        </span>
      ))}
    </div>
  );
}
