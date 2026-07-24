export function MissingSkills({ skills }: { skills: string[] }) {
  return (
    <div className="ui-card p-5">
      <h3 className="font-semibold">Eksik beceriler</h3>
      <div className="mt-4 flex flex-wrap gap-2">
        {skills.length ? (
          skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1 text-xs text-amber-200"
            >
              {skill}
            </span>
          ))
        ) : (
          <p className="text-sm text-text2">Kritik eksik beceri görünmüyor.</p>
        )}
      </div>
    </div>
  );
}
