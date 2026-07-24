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
      }
    : null;

  return (
    <ResumeAnalysisWorkspace
      targetInternship={targetInternship}
      requestedInternshipId={internshipId}
    />
  );
}
