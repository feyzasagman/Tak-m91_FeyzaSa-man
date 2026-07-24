export function SkillMatch({ skills }: { skills: string[] }) {
  return (
    <div className="ui-card p-5">
      <h3 className="font-semibold">İlanla eşleşen beceriler</h3>
      <div className="mt-4 flex flex-wrap gap-2">
        {skills.length ? (
          skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200"
            >
              {skill}
            </span>
          ))
        ) : (
          <p className="text-sm text-text2">Eşleşen beceri bulunamadı.</p>
        )}
      </div>
    </div>
  );
}
