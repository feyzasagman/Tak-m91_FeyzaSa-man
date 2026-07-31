const fs = require("fs");
const path = require("path");

const slogan = "KAR" + String.fromCharCode(0x0130) + "YER PLATFORMU";
console.log("target slogan:", slogan);
console.log("target hex:", Buffer.from(slogan, "utf8").toString("hex"));

function build(gradientId, wordFill, tagFill) {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 72" fill="none" role="img" aria-label="InternAI Kariyer Platformu">`,
    "  <defs>",
    `    <linearGradient id="${gradientId}" x1="8" y1="8" x2="58" y2="58" gradientUnits="userSpaceOnUse">`,
    '      <stop offset="0%" stop-color="#8B5CF6"/>',
    '      <stop offset="50%" stop-color="#6366F1"/>',
    '      <stop offset="100%" stop-color="#3B82F6"/>',
    "    </linearGradient>",
    "  </defs>",
    '  <g transform="translate(0,4) scale(0.95)">',
    `    <path fill="url(#${gradientId})" d="M17 52.5a2.2 2.2 0 0 1-2-3.1L28.2 14.2A2.8 2.8 0 0 1 30.8 12.5h2.4a2.8 2.8 0 0 1 2.6 1.7l5.8 13.4a2.2 2.2 0 0 1-4.1 1.8l-5.1-11.7-12.4 32.7a2.2 2.2 0 0 1-2 1.1Z"/>`,
    `    <path fill="url(#${gradientId})" d="M36.2 52.5a2.2 2.2 0 0 1-2.1-1.6L28.8 33a2.2 2.2 0 1 1 4.2-1.2l4.6 16.2 7.4-22.8a2.2 2.2 0 0 1 4.2 1.3L41.4 51a2.2 2.2 0 0 1-2.1 1.5h-3.1Z"/>`,
    `    <rect x="22.5" y="35.2" width="18" height="4.4" rx="2.2" fill="url(#${gradientId})"/>`,
    `    <rect x="47" y="22" width="5.8" height="30.5" rx="2.4" fill="url(#${gradientId})"/>`,
    `    <path fill="url(#${gradientId})" d="M49.9 7.2 51.5 12.1 56.4 13.7 51.5 15.3 49.9 20.2 48.3 15.3 43.4 13.7 48.3 12.1Z"/>`,
    "  </g>",
    `  <text x="78" y="36" fill="${wordFill}" font-family="system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif" font-size="28" font-weight="700" letter-spacing="-0.03em">InternAI</text>`,
    `  <text x="78" y="56" fill="${tagFill}" font-family="system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif" font-size="9.5" font-weight="600" letter-spacing="0.22em">${slogan}</text>`,
    "</svg>",
    "",
  ].join("\n");
}

const dir = path.join("web-admin", "public", "brand");
const files = [
  ["internai-logo-light.svg", "aiGradLight", "#0F172A", "#7C3AED"],
  ["internai-logo-dark.svg", "aiGradDark", "#F8FAFC", "#A78BFA"],
  ["internai-logo-light-v2.svg", "aiGradLightV2", "#0F172A", "#7C3AED"],
  ["internai-logo-dark-v2.svg", "aiGradDarkV2", "#F8FAFC", "#A78BFA"],
];

for (const [name, gid, wf, tf] of files) {
  fs.writeFileSync(path.join(dir, name), build(gid, wf, tf), "utf8");
}

let allOk = true;
for (const [name] of files) {
  const t = fs.readFileSync(path.join(dir, name), "utf8");
  const m = t.match(/>([^<]*PLATFORMU)</);
  const s = m ? m[1] : null;
  const hex = s ? Buffer.from(s, "utf8").toString("hex") : "";
  const ok =
    s === slogan &&
    hex.includes("c4b0") &&
    !String(s).includes("&#") &&
    !String(s).includes("0YER") &&
    !String(s).includes("KAROYER") &&
    !String(s).includes("KARÜYER");
  console.log(name);
  console.log("  text:", JSON.stringify(s));
  console.log("  hex:", hex);
  console.log("  OK:", ok);
  if (!ok) allOk = false;
}

if (!allOk) process.exit(1);
