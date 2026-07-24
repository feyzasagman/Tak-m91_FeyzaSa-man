const PAGE_NUMBER_PATTERNS = [
  /^\s*(?:sayfa|page)\s+\d+(?:\s*\/\s*\d+|\s+(?:of|\/)\s+\d+)?\s*$/iu,
  /^\s*[-–—]?\s*\d{1,3}\s*[-–—]?\s*$/u,
  /^\s*--\s*\d+\s+(?:of|\/)\s+\d+\s*--\s*$/iu,
];

function normalizeLine(line: string) {
  return line
    .replace(/[\u00a0\u2007\u202f]/gu, " ")
    .replace(/[\u200b-\u200d\u2060\ufeff]/gu, "")
    .replace(/[ \t]+/gu, " ")
    .trim();
}

export function cleanResumeText(rawText: string) {
  const normalized = rawText
    .normalize("NFKC")
    .replace(/\r\n?/gu, "\n")
    .replace(/\u0000/gu, "");

  const output: string[] = [];
  let previousNonEmpty = "";

  for (const sourceLine of normalized.split("\n")) {
    const line = normalizeLine(sourceLine);
    if (PAGE_NUMBER_PATTERNS.some((pattern) => pattern.test(line))) continue;

    if (!line) {
      if (output.length > 0 && output.at(-1) !== "") output.push("");
      continue;
    }

    const comparison = line.toLocaleLowerCase("tr-TR");
    if (comparison === previousNonEmpty) continue;

    output.push(line);
    previousNonEmpty = comparison;
  }

  return output.join("\n").replace(/\n{3,}/gu, "\n\n").trim();
}
