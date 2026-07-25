import type {
  ApplicationRecommendation,
  ResumeAnalysisRequest,
  ResumeAnalysisResult,
} from "../types/resumeAnalysis";
import { ANALYSIS_VERSION } from "../types/resumeAnalysis";

export function createMockResumeAnalysis(
  input: ResumeAnalysisRequest
): ResumeAnalysisResult {
  const resumeLower = input.resumeText.toLocaleLowerCase("tr-TR");
  const jobSkills = input.internshipContext?.skills ?? [];
  const matchedSkills = jobSkills.filter((skill) =>
    resumeLower.includes(skill.toLocaleLowerCase("tr-TR"))
  );
  const missingSkills = jobSkills.filter(
    (skill) => !matchedSkills.includes(skill)
  );
  const detected = input.detectedSkills ?? [];
  const ratio = jobSkills.length
    ? matchedSkills.length / jobSkills.length
    : Math.min(0.85, 0.45 + detected.length * 0.04);
  const overallScore = Math.round(55 + ratio * 40);
  const atsScore = Math.round(50 + ratio * 45);

  let applicationRecommendation: ApplicationRecommendation = "improve_first";
  if (overallScore >= 78 && missingSkills.length <= 2) {
    applicationRecommendation = "apply";
  } else if (overallScore < 55 || missingSkills.length >= 5) {
    applicationRecommendation = "low_match";
  }

  const company = input.internshipContext?.company;
  const title = input.internshipContext?.title;

  return {
    overallScore,
    atsScore,
    applicationRecommendation,
    summary: company
      ? `${company} – ${title} ilanı için CV’n tahmini olarak ${overallScore}/100 genel uyum ve %${atsScore} ATS skoru gösteriyor. Bu skorlar yapay zekâ destekli tahminlerdir.`
      : `CV’n genel olarak ${overallScore}/100 kalite ve %${atsScore} ATS tahmini gösteriyor. Bu skorlar yapay zekâ destekli tahminlerdir; kesin işe alım sonucu garantisi vermez.`,
    strengths: [
      "CV’de eğitim ve teknik beceriler okunabilir biçimde yer alıyor.",
      detected.length
        ? `Algılanan beceriler arasında ${detected.slice(0, 3).join(", ")} öne çıkıyor.`
        : "Proje ve deneyim maddeleri yapılandırılmış görünüyor.",
      "Bölüm başlıkları ATS taraması için yeterince net.",
    ],
    weaknesses: [
      missingSkills.length
        ? `İlanda öne çıkan ${missingSkills.slice(0, 3).join(", ")} becerileri CV’de zayıf veya eksik.`
        : "Deneyim maddelerinde ölçülebilir sonuçlar daha belirgin hale getirilebilir.",
      "Anahtar kelime yoğunluğu bazı bölümlerde dengeli dağıtılmalı.",
      "Özet bölümü hedef role daha odaklı yazılabilir.",
    ],
    matchedSkills: matchedSkills.length
      ? matchedSkills
      : detected.slice(0, 6),
    missingSkills,
    keywordSuggestions: [
      ...(missingSkills.length
        ? missingSkills.slice(0, 3)
        : ["staj", "ekip çalışması"]),
      "problem çözme",
      "versiyon kontrolü",
    ].slice(0, 8),
    sectionScores: [
      {
        section: "education",
        label: "Eğitim",
        score: Math.min(92, overallScore + 6),
        feedback: "Eğitim bilgileri anlaşılır; ilgili ders veya not ortalaması eklenebilir.",
      },
      {
        section: "experience",
        label: "Deneyim",
        score: Math.max(40, overallScore - 4),
        feedback: "Deneyim maddelerini ölçülebilir etki ile güçlendir.",
      },
      {
        section: "skills",
        label: "Beceriler",
        score: Math.round(50 + ratio * 45),
        feedback: "Teknik becerileri ilan diline yakın anahtar kelimelerle grupla.",
      },
      {
        section: "projects",
        label: "Projeler",
        score: Math.max(45, overallScore - 8),
        feedback: "Projelerde kullanılan teknolojileri ve sonucu net yaz.",
      },
    ],
    priorityRecommendations: [
      {
        priority: "high",
        title: "İlan odaklı anahtar kelimeler",
        description:
          "Eksik görünen becerileri yalnızca gerçek deneyimin varsa ilgili bölümlere ekle.",
      },
      {
        priority: "medium",
        title: "Ölçülebilir başarılar",
        description:
          "Deneyim maddelerine sayı, süre veya etki içeren sonuçlar ekle.",
      },
      {
        priority: "low",
        title: "Özet paragrafını sadeleştir",
        description:
          "Üst özeti hedef staj rolüne göre 3–4 cümlede netleştir.",
      },
    ],
    internshipCompatibility: input.internshipContext
      ? {
          score: overallScore,
          matchedRequirements: matchedSkills,
          missingRequirements: missingSkills,
          applicationAdvice:
            applicationRecommendation === "apply"
              ? "Mevcut CV ile başvuruya geçilebilir; son bir düzenleme turu faydalı olur."
              : applicationRecommendation === "low_match"
                ? "Önce kritik eksikleri kapatman veya daha uyumlu ilanlara yönelmen önerilir."
                : "Başvuru öncesi CV’yi ilan gereksinimlerine göre güçlendirmen önerilir.",
        }
      : null,
    metadata: {
      model: "mock-development",
      createdAt: new Date().toISOString(),
      analysisVersion: ANALYSIS_VERSION,
    },
  };
}
