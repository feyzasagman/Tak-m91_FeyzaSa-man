import type {
  ResumeAnalysis,
  ResumeAnalysisRequest,
} from "../types/resumeAnalysis";

export function createMockResumeAnalysis(
  input: ResumeAnalysisRequest
): ResumeAnalysis {
  const resumeLower = input.resumeText.toLocaleLowerCase("tr-TR");
  const matchingSkills = input.internship.skills.filter((skill) =>
    resumeLower.includes(skill.toLocaleLowerCase("tr-TR"))
  );
  const missingSkills = input.internship.skills.filter(
    (skill) => !matchingSkills.includes(skill)
  );
  const ratio = input.internship.skills.length
    ? matchingSkills.length / input.internship.skills.length
    : 0.5;
  const overall = Math.round(55 + ratio * 40);
  const ats = Math.round(50 + ratio * 45);
  const verdict = overall >= 75 && missingSkills.length <= 2
    ? "applicable"
    : "improve-first";

  return {
    overallScore: {
      value: overall,
      label: `${input.internship.company} ilanı ile genel uyum`,
    },
    atsScore: {
      value: ats,
      label: "ATS geçme tahmini",
    },
    strengths: [
      "CV'de teknik beceriler ve proje deneyimi görünür biçimde yer alıyor.",
      `${input.internship.title} ilanıyla örtüşen anahtar kelimeler tespit edildi.`,
      "Eğitim ve deneyim bölümleri okunabilir bir yapıda.",
    ],
    gaps: [
      missingSkills.length
        ? `İlanda öne çıkan ${missingSkills.slice(0, 3).join(", ")} becerileri CV'de zayıf veya eksik.`
        : "İlanla kritik beceri boşluğu sınırlı görünüyor.",
      "Deneyim maddelerinde ölçülebilir sonuçlar daha belirgin hale getirilebilir.",
      "ATS uyumu için anahtar kelime yoğunluğu dengeli dağıtılmalı.",
    ],
    matchingSkills,
    missingSkills,
    oversizedAreas: [
      "Genel özet veya uzun paragraf blokları",
      "İlanla düşük ilişkili yan beceriler",
    ],
    sectionsToStrengthen: ["Deneyimler", "Teknik Beceriler", "Projeler"],
    suggestedKeywords: [
      {
        keyword: input.internship.skills[0] ?? "staj",
        reason: "İlan başlığındaki temel yetkinlikle doğrudan ilişkili.",
      },
      {
        keyword: "ekip çalışması",
        reason: "Staj ilanlarında sık aranan davranışsal anahtar kelime.",
      },
      {
        keyword: "problem çözme",
        reason: "Teknik staj başvurularında ATS taramasında sık geçer.",
      },
    ],
    technologiesToAdd: missingSkills.slice(0, 5),
    commentary: `${input.internship.company} bünyesindeki ${input.internship.title} ilanı için CV'n genel olarak ${overall}/100 uyum gösteriyor. Mevcut güçlü yönlerin başvuru sürecinde avantaj sağlarken, eksik görünen becerilerin yalnızca gerçek deneyimin varsa CV'de daha görünür hale getirilmesi önerilir.\n\nATS açısından skor yaklaşık %${ats}. Anahtar kelime yerleşimi ve bölüm düzeni iyileştirilirse tarama aşamasında daha tutarlı bir görünürlük elde edilebilir.\n\nSonuç olarak ${
      verdict === "applicable"
        ? "mevcut CV ile başvuruya geçilebilir; yine de son bir düzenleme turu faydalı olur."
        : "önce CV'ni ilan odaklı güçlendirmen daha doğru bir adım olur."
    }`,
    verdict,
    comparison: {
      cvHighlights: [
        input.fileName ? `${input.fileName} üzerinden çıkarılan CV metni` : "CV metni",
        "Tespit edilen teknik ve proje vurguları",
      ],
      jobHighlights: [
        `${input.internship.company} – ${input.internship.title}`,
        input.internship.skills.slice(0, 5).join(", ") || "İlan becerileri",
      ],
      matching: matchingSkills,
      missing: missingSkills,
      extra: ["Genel akademik bilgiler", "İlan dışı yan beceriler"].filter(Boolean),
    },
    skillMatch: {
      matching: matchingSkills,
      missing: missingSkills,
      extra: ["Genel akademik bilgiler"],
    },
  };
}
