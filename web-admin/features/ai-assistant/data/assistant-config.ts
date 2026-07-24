import type {
  ApplicationAssistantInput,
  AssistantMode,
  AssistantTone,
} from "../types";

export const assistantModes: Array<{
  id: AssistantMode;
  title: string;
  description: string;
  icon: string;
  resultTitle: string;
}> = [
  { id: "cover-letter", title: "Ön Yazı Oluştur", description: "İlana özel profesyonel ön yazı", icon: "✉", resultTitle: "Ön Yazı" },
  { id: "application-email", title: "Başvuru E-postası", description: "Kısa ve etkili başvuru e-postası", icon: "@", resultTitle: "Başvuru E-postası" },
  { id: "resume", title: "CV İyileştirme", description: "İlana göre CV geliştirme önerileri", icon: "📄", resultTitle: "CV İyileştirme Önerileri" },
  { id: "interview", title: "Mülakat Hazırlığı", description: "Teknik ve davranışsal sorular", icon: "🎤", resultTitle: "Mülakat Hazırlık Planı" },
  { id: "motivation", title: "Kısa Motivasyon", description: "Karakter limitine uygun metin", icon: "✨", resultTitle: "Motivasyon Metni" },
];

export const assistantTones: Array<{ id: AssistantTone; label: string }> = [
  { id: "professional", label: "Profesyonel" },
  { id: "friendly", label: "Samimi" },
  { id: "technical", label: "Teknik" },
  { id: "concise", label: "Kısa ve doğrudan" },
  { id: "motivational", label: "Motive edici" },
];

export const defaultAssistantInput: ApplicationAssistantInput = {
  company: "",
  position: "",
  city: "",
  workModel: "",
  jobDescription: "",
  userSummary: "",
  technicalSkills: "",
  experiences: "",
  projects: "",
  careerGoal: "",
  tone: "professional",
  companyReason: "",
  highlightedSkills: "",
  maxLength: 500,
  recipientName: "",
  subjectLine: "",
  attachmentInfo: "CV",
  currentResumeSummary: "",
  targetJob: "",
  highlightedSections: "",
  technicalLevel: "Orta",
  questionCount: 8,
  questionType: "Karma",
  characterLimit: 500,
  programName: "",
  participationGoal: "",
};

export function getModeMeta(mode: AssistantMode) {
  return assistantModes.find((item) => item.id === mode) ?? assistantModes[0];
}
