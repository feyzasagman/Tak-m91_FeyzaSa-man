import { ResumeAnalysisWorkspace } from "@/features/resume-analysis/components/ResumeAnalysisWorkspace";
import { getInternshipById } from "@/features/internships/data/internships";

export default async function ResumeAnalysisPage({
  searchParams,
}: {
  searchParams: Promise<{ internshipId?: string | string[] }>;
}) {
  const params = await searchParams;
  const internshipId = Array.isArray(params.internshipId)
    ? params.internshipId[0]
    : params.internshipId;
  const internship = internshipId ? getInternshipById(internshipId) : undefined;
  const targetInternship = internship
    ? {
        id: internship.id,
        company: internship.company,
        title: internship.title,
        skills: internship.skills,
        description: [
          internship.description,
          ...internship.responsibilities.map((item) => `• ${item}`),
          ...internship.requirements.map((item) => `• ${item}`),
        ].join("\n"),
        city: internship.city,
        workModel: internship.workModel,
        internshipType: internship.internshipType,
        deadline: internship.deadline,
        compatibilityScore: internship.compatibilityScore,
      }
    : null;

  return (
    <ResumeAnalysisWorkspace
      targetInternship={targetInternship}
      requestedInternshipId={internshipId}
    />
  );
}
