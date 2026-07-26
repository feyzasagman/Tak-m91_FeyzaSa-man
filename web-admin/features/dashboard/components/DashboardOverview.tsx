"use client";

import { CareerCoachCard } from "@/features/career-coach/components/CareerCoachCard";
import { useDashboardData } from "../hooks/useDashboardData";
import { ActivityFeed } from "./ActivityFeed";
import { ApplicationStatusSummary } from "./ApplicationStatusSummary";
import { DashboardEmptyState } from "./DashboardEmptyState";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardRecommendations } from "./DashboardRecommendations";
import { DashboardSkeleton } from "./DashboardSkeleton";
import { DashboardStatGrid } from "./DashboardStatGrid";
import { GeneratedContentPreview } from "./GeneratedContentPreview";
import { LatestResumeAnalysis } from "./LatestResumeAnalysis";
import { QuickActions } from "./QuickActions";
import { RecentApplications } from "./RecentApplications";
import { UpcomingDeadlineList } from "./UpcomingDeadlineList";

export function DashboardOverview() {
  const data = useDashboardData();

  if (!data.isHydrated) {
    return <DashboardSkeleton />;
  }

  return (
    <section className="space-y-7">
      <DashboardHeader displayName={data.displayName} />

      {data.isEmpty ? (
        <>
          <DashboardEmptyState />
          <CareerCoachCard />
          <QuickActions items={data.quickActions} />
        </>
      ) : (
        <>
          <DashboardStatGrid stats={data.stats} />

          <CareerCoachCard />

          <QuickActions items={data.quickActions} />

          <div className="grid gap-5 xl:grid-cols-2">
            <ApplicationStatusSummary
              statusCounts={data.stats.statusCounts}
              total={data.stats.totalApplications}
            />
            <UpcomingDeadlineList items={data.upcomingDeadlines} />
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            <RecentApplications items={data.recentApplications} />
            <LatestResumeAnalysis analysis={data.latestAnalysis} />
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            <DashboardRecommendations items={data.recommendations} />
            <GeneratedContentPreview items={data.generatedContent} />
          </div>

          <ActivityFeed items={data.activities} />
        </>
      )}
    </section>
  );
}
