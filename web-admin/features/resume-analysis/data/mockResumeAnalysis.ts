import type { ResumeAnalysisResult } from "../types";

export const mockResumeAnalysis: ResumeAnalysisResult = {
  score: 78,
  summary:
    "CV’n güçlü bir teknik altyapı sunuyor ancak deneyimlerin ve başarıların daha ölçülebilir biçimde ifade edilebilir.",
  strengths: [
    "Python, SQL ve veri analizi becerileri açık şekilde belirtilmiş.",
    "Yapay zekâ ve makine öğrenmesi projeleri bulunuyor.",
    "GitHub ve teknik proje deneyimi mevcut.",
    "Eğitim bilgileri düzenli sunulmuş.",
    "Birden fazla teknoloji alanında çalışma deneyimi var.",
  ],
  improvementAreas: [
    "Proje sonuçlarında ölçülebilir başarı oranları eksik.",
    "İngilizce seviyesi belirtilmemiş.",
    "Teknik beceriler önem sırasına göre düzenlenmemiş.",
    "Deneyim açıklamaları uzun ve genel kalmış.",
    "İletişim bilgileri daha görünür hale getirilebilir.",
  ],
  detectedSkills: [
    "Python",
    "SQL",
    "JavaScript",
    "React",
    "Firebase",
    "Flutter",
    "Git",
    "Veri Analizi",
    "Makine Öğrenmesi",
  ].map((name) => ({ name, kind: "detected" as const })),
  suggestedSkills: [
    "Docker",
    "REST API",
    "Cloud Deployment",
    "Test Yazımı",
    "CI/CD",
  ].map((name) => ({ name, kind: "suggested" as const })),
  sectionScores: [
    {
      title: "İletişim Bilgileri",
      score: 90,
      description: "Temel iletişim alanları mevcut ve kolay okunuyor.",
    },
    {
      title: "Eğitim",
      score: 85,
      description: "Eğitim geçmişi düzenli ve kronolojik biçimde sunulmuş.",
    },
    {
      title: "Teknik Beceriler",
      score: 88,
      description: "Teknoloji çeşitliliği güçlü; kategorilendirme geliştirilebilir.",
    },
    {
      title: "Deneyimler",
      score: 65,
      description: "Görevler açık ancak ölçülebilir sonuçlar eksik.",
    },
    {
      title: "Projeler",
      score: 82,
      description: "Teknik projeler role uygun ve güçlü bir temel sağlıyor.",
    },
    {
      title: "Dil Bilgisi",
      score: 40,
      description: "Yabancı dil seviyesi ve sertifikalar belirtilmemiş.",
    },
    {
      title: "Genel Düzen",
      score: 80,
      description: "Sayfa yapısı okunaklı; bazı bölümlerde yoğunluk azaltılabilir.",
    },
  ],
  recommendations: [
    { id: "high-language", priority: "Yüksek", text: "İngilizce seviyeni ekle." },
    {
      id: "high-metrics",
      priority: "Yüksek",
      text: "Projelerde sayısal sonuçlar belirt.",
    },
    {
      id: "high-experience",
      priority: "Yüksek",
      text: "Her deneyimi 3–4 güçlü maddeyle özetle.",
    },
    {
      id: "medium-skills",
      priority: "Orta",
      text: "Teknik becerileri kategorilere ayır.",
    },
    {
      id: "medium-links",
      priority: "Orta",
      text: "GitHub ve LinkedIn bağlantılarını daha görünür yap.",
    },
    {
      id: "low-spacing",
      priority: "Düşük",
      text: "Tasarımda boşlukları daha dengeli kullan.",
    },
    {
      id: "low-summary",
      priority: "Düşük",
      text: "Profil özetini kısalt.",
    },
  ],
  internshipCompatibility: {
    score: 84,
    matchingSkills: ["Python", "SQL", "Makine Öğrenmesi", "Git"],
    missingSkills: ["Docker", "FastAPI", "AWS"],
    suggestion:
      "Bu ilana başvurmadan önce Docker ve REST API deneyimini CV’de görünür hale getirmen önerilir.",
  },
};
