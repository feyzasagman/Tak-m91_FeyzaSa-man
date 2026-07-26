"use client";

import { CareerCoachCard } from "@/features/career-coach/components/CareerCoachCard";
import { useDashboardData } from "../hooks/useDashboardData";
import { ActivityFeed } from "./ActivityFeed";
import { ApplicationStatusSummary } from "./ApplicationStatusSummary";
import { DashboardEmptyState } from "./DashboardEmptyState";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardSkeleton } from "./DashboardSkeleton";
import { DashboardStatGrid } from "./DashboardStatGrid";
import { LatestResumeAnalysis } from "./LatestResumeAnalysis";
import { QuickActions } from "./QuickActions";
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
          <QuickActions items={data.quickActions} />
          <CareerCoachCard />
        </>
      ) : (
        <>
          <DashboardStatGrid stats={data.stats} />
          <QuickActions items={data.quickActions} />
          <LatestResumeAnalysis analysis={data.latestAnalysis} />
          <div className="grid gap-5 xl:grid-cols-2">
            <ApplicationStatusSummary
              statusCounts={data.stats.statusCounts}
              total={data.stats.totalApplications}
            />
            <UpcomingDeadlineList items={data.upcomingDeadlines} />
          </div>
          <CareerCoachCard />
          <ActivityFeed items={data.activities} />
        </>
      )}
    </section>
  );
}
