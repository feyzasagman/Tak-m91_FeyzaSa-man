import { assistantTones, getModeMeta } from "../data/assistant-config";
import type {
  ApplicationAssistantInput,
  AssistantMode,
} from "../types";

const wait = (milliseconds: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, milliseconds));

export async function generateApplicationMock(
  mode: AssistantMode,
  input: ApplicationAssistantInput
) {
  await wait(1400);
  const company = input.company || input.programName || "şirketiniz";
  const position = input.position || input.targetJob || "staj pozisyonu";
  const tone =
    assistantTones.find((item) => item.id === input.tone)?.label ??
    "Profesyonel";
  let content = "";

  if (mode === "cover-letter") {
    content = `Sayın Yetkili,

${company} bünyesinde açılan ${position} ilanına başvurmak istiyorum. ${input.userSummary}

${input.technicalSkills ? `${input.technicalSkills} alanlarında paylaştığım bilgi ve proje deneyimimin` : "Paylaştığım eğitim ve proje bilgilerinin"} bu pozisyonla uyum gösterdiğine inanıyorum. ${input.companyReason || `${company} bünyesinde öğrenerek sorumluluk almak istiyorum.`}

${input.highlightedSkills ? `Özellikle ${input.highlightedSkills} becerilerimi bu görevde etkin biçimde kullanabileceğime inanıyorum.` : "Öğrenme isteğim, sorumluluk bilincim ve ekip çalışmasına yatkınlığımla değer üretebileceğime inanıyorum."}

Değerlendirmeniz için teşekkür ederim.

Saygılarımla,
[Ad Soyad]`;
  } else if (mode === "application-email") {
    content = `Konu: ${input.subjectLine || `${position} Staj Başvurusu – [Ad Soyad]`}

${input.recipientName ? `Merhaba ${input.recipientName},` : "Merhaba,"}

${company} tarafından yayınlanan ${position} ilanına başvurumu iletmek istiyorum.

Pozisyonla ilgili deneyim ve yetkinliklerimi içeren ${input.attachmentInfo || "CV’m"} ekte yer almaktadır. Uygun görmeniz halinde detayları görüşmekten memnuniyet duyarım.

İyi çalışmalar dilerim.
[Ad Soyad]`;
  } else if (mode === "resume") {
    content = `CV İyileştirme Önerileri

• Teknik becerileri kategori bazlı sırala.
• ${position} ilanıyla en uyumlu projeleri üst bölüme taşı.
• Deneyimlerde ölçülebilir sonuçlar ve güçlü eylem fiilleri kullan.
• ${input.highlightedSections || "Deneyim ve projeler"} bölümlerini daha görünür hale getir.
• İlanda gereken ancak CV özetinde yer almayan becerileri yalnızca gerçek deneyimin varsa ekle.
• Profil özetini hedef role göre 3–4 cümleyle yeniden yaz.

Mevcut özet değerlendirmesi: ${input.currentResumeSummary}`;
  } else if (mode === "interview") {
    const count = Math.max(1, Math.min(input.questionCount, 12));
    const questions = Array.from({ length: count }, (_, index) => {
      const technical = input.questionType !== "Davranışsal" && index % 2 === 0;
      return `${index + 1}. ${
        technical
          ? `${position} rolünde kullanacağın bir teknik yaklaşımı örnekle açıkla.`
          : "Zor bir ekip çalışması deneyimini ve nasıl çözdüğünü anlat."
      }\n   İpucu: ${technical ? "Problem, yaklaşım ve teknik tercihini yapılandır." : "STAR metoduyla somut bir sonuç paylaş."}`;
    });
    content = `${company} – ${position} Mülakat Hazırlığı

Seviye: ${input.technicalLevel}
Soru tipi: ${input.questionType}

${questions.join("\n\n")}

Hazırlık önerisi: İlan açıklamasındaki temel teknolojileri tekrar et, eksik becerilerin için küçük bir uygulama örneği hazırla ve projelerini ölçülebilir sonuçlarla anlat.`;
  } else {
    content = `${input.programName} bünyesindeki bu fırsata katılarak ${input.participationGoal.toLocaleLowerCase("tr-TR")} istiyorum. Paylaştığım hedefler doğrultusunda programa katkı sunarken kendimi gerçek çalışmalar üzerinde geliştirmeyi amaçlıyorum.`;
    content = content.slice(0, Math.max(50, input.characterLimit));
  }

  if (mode === "cover-letter" && input.maxLength > 0) {
    content = content.slice(0, Math.max(200, input.maxLength));
  }

  return {
    title: getModeMeta(mode).resultTitle,
    content: mode === "motivation" ? content : `${content}\n\nTon: ${tone}`,
  };
}
