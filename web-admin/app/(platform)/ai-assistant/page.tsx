import { ApplicationAssistantWorkspace } from "@/features/ai-assistant/components/ApplicationAssistantWorkspace";
import { getInternshipById } from "@/features/internships/data/internships";
import { resolveAssistantMode } from "@/features/ai-assistant/utils/assistant-utils";

export default async function AiAssistantPage({
  searchParams,
}: {
  searchParams: Promise<{
    mode?: string | string[];
    internshipId?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const modeValue = Array.isArray(params.mode) ? params.mode[0] : params.mode;
  const internshipId = Array.isArray(params.internshipId)
    ? params.internshipId[0]
    : params.internshipId;
  const source = internshipId ? getInternshipById(internshipId) : undefined;
  const internship = source
    ? {
        id: source.id,
        company: source.company,
        title: source.title,
        description: [
          source.description,
          `Sorumluluklar: ${source.responsibilities.join(", ")}`,
          `Aranan nitelikler: ${source.requirements.join(", ")}`,
          `Başvuru koşulları: ${source.applicationConditions.join(", ")}`,
        ].join("\n\n"),
        skills: source.skills,
        city: source.city,
        workModel: source.workModel,
      }
    : null;

  return (
    <ApplicationAssistantWorkspace
      initialMode={resolveAssistantMode(modeValue)}
      internship={internship}
      requestedInternshipId={internshipId}
    />
  );
}
