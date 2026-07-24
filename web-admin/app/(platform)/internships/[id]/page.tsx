import { notFound } from "next/navigation";
import { InternshipDetails } from "@/features/internships/components/InternshipDetails";
import { getInternshipById } from "@/features/internships/data/internships";

export default async function InternshipDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const internship = getInternshipById(id);
  if (!internship) notFound();

  return <InternshipDetails internship={internship} />;
}
