import type { ResumeSections } from "@/features/resume-analysis/types/resumeExtraction";

type ResumeSectionKey = keyof ResumeSections;

const SECTION_HEADINGS: Record<ResumeSectionKey, string[]> = {
  contact: ["iletişim", "contact", "kişisel bilgiler"],
  summary: ["profil", "hakkımda", "özet", "summary", "profile"],
  education: ["eğitim", "education", "akademik bilgiler"],
  experience: [
    "deneyim",
    "iş deneyimi",
    "experience",
    "work experience",
    "professional experience",
  ],
  projects: ["projeler", "projects", "portföy", "portfolio"],
  skills: [
    "teknik beceriler",
    "beceriler",
    "skills",
    "technical skills",
    "yetkinlikler",
  ],
  languages: ["yabancı dil", "diller", "languages", "language"],
};

const emptySections = (): Record<ResumeSectionKey, string[]> => ({
  contact: [],
  summary: [],
  education: [],
  experience: [],
  projects: [],
  skills: [],
  languages: [],
});

function normalizeHeading(line: string) {
  return line
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .replace(/ı/gu, "i")
    .toLowerCase()
    .replace(/[#:–—-]+$/gu, "")
    .replace(/\s+/gu, " ")
    .trim();
}

function headingFor(line: string): ResumeSectionKey | null {
  const normalized = normalizeHeading(line);
  for (const [key, headings] of Object.entries(SECTION_HEADINGS) as [
    ResumeSectionKey,
    string[],
  ][]) {
    if (headings.some((heading) => normalizeHeading(heading) === normalized)) {
      return key;
    }
  }
  return null;
}

function looksLikeContact(line: string) {
  return (
    /\b[\w.+-]+@[\w.-]+\.[a-z]{2,}\b/iu.test(line) ||
    /(?:\+?90\s*)?(?:\(?0?\d{3}\)?[\s.-]*)?\d{3}[\s.-]*\d{2}[\s.-]*\d{2}/u.test(
      line
    ) ||
    /\b(?:linkedin\.com|github\.com)\//iu.test(line)
  );
}

export function detectResumeSections(cleanedText: string): ResumeSections {
  const sections = emptySections();
  const preamble: string[] = [];
  let activeSection: ResumeSectionKey | null = null;

  for (const line of cleanedText.split("\n")) {
    const heading = headingFor(line);
    if (heading) {
      activeSection = heading;
      continue;
    }

    if (activeSection) {
      sections[activeSection].push(line);
    } else {
      preamble.push(line);
    }
  }

  if (preamble.length) {
    const contactLines = preamble.filter(looksLikeContact);
    const summaryLines = preamble.filter(
      (line) => line && !contactLines.includes(line)
    );
    sections.contact.unshift(...contactLines);
    sections.summary.unshift(...summaryLines);
  }

  return Object.fromEntries(
    Object.entries(sections).map(([key, lines]) => [
      key,
      lines.join("\n").replace(/\n{3,}/gu, "\n\n").trim(),
    ])
  ) as unknown as ResumeSections;
}

export const resumeSectionLabels: Record<ResumeSectionKey, string> = {
  contact: "İletişim",
  summary: "Özet",
  education: "Eğitim",
  experience: "Deneyim",
  projects: "Projeler",
  skills: "Beceriler",
  languages: "Diller",
};
