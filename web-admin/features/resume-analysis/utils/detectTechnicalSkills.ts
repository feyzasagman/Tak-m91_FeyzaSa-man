const SKILL_ALIASES: Record<string, string[]> = {
  Python: ["Python"],
  Java: ["Java"],
  "C#": ["C#", "C Sharp"],
  JavaScript: ["JavaScript"],
  TypeScript: ["TypeScript"],
  React: ["React", "React.js", "ReactJS"],
  "Next.js": ["Next.js", "NextJS"],
  Flutter: ["Flutter"],
  Firebase: ["Firebase"],
  SQL: ["SQL"],
  PostgreSQL: ["PostgreSQL", "Postgres"],
  MySQL: ["MySQL"],
  MongoDB: ["MongoDB"],
  Git: ["Git"],
  GitHub: ["GitHub"],
  Docker: ["Docker"],
  "REST API": ["REST API", "RESTful API"],
  FastAPI: ["FastAPI"],
  "Node.js": ["Node.js", "NodeJS"],
  "Machine Learning": ["Machine Learning", "Makine Öğrenmesi"],
  "Veri Analizi": ["Veri Analizi", "Data Analysis", "Data Analytics"],
  "Yapay Zekâ": ["Yapay Zekâ", "Yapay Zeka", "Artificial Intelligence"],
  TensorFlow: ["TensorFlow"],
  PyTorch: ["PyTorch"],
  Pandas: ["Pandas"],
  NumPy: ["NumPy"],
};

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}

function aliasPattern(alias: string) {
  const flexibleWhitespace = escapeRegExp(alias).replace(/\\ /gu, "\\s+");
  return new RegExp(
    `(?<![\\p{L}\\p{N}_])${flexibleWhitespace}(?![\\p{L}\\p{N}_])`,
    "iu"
  );
}

export function detectTechnicalSkills(text: string) {
  return Object.entries(SKILL_ALIASES)
    .filter(([, aliases]) => aliases.some((alias) => aliasPattern(alias).test(text)))
    .map(([skill]) => skill);
}
