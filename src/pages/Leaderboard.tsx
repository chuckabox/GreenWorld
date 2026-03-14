import React, { useState, useEffect } from "react";
import { cn } from "../lib/utils";
import { Activity, StoredUser } from "../types";

export const Leaderboard = () => {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [communityStats, setCommunityStats] = useState({
    co2Kg: 0,
    activitiesCount: 0,
    members: 0,
  });
  const [highlight, setHighlight] = useState({
    topCategory: "No actions yet",
    topCategoryCount: 0,
    recentAction: "No verified actions yet",
    topTeam: "No team data",
  });

  useEffect(() => {
    const users: StoredUser[] = JSON.parse(
      localStorage.getItem("users") || "[]",
    );
    const activities: Activity[] = JSON.parse(
      localStorage.getItem("activities") || "[]",
    );

    const ranked = users
      .filter((user) => user.role !== "admin")
      .sort((a, b) => (b.impact_points || 0) - (a.impact_points || 0))
      .slice(0, 10)
      .map((user, index) => ({
        name: user.name,
        impact_points: user.impact_points || 0,
        rank: index + 1,
      }));
    setLeaders(ranked);

    const totalCo2 = activities.reduce(
      (sum: number, a: any) => sum + (a.estimatedCo2Kg || 0),
      0,
    );
    setCommunityStats({
      co2Kg: Math.round(totalCo2 * 10) / 10,
      activitiesCount: activities.length,
      members: users.filter((u) => u.role !== "admin").length,
    });

    const approvedActivities = activities.filter(
      (activity) => activity.status === "approved",
    );
    const categoryCount = approvedActivities.reduce<Record<string, number>>(
      (acc, activity) => {
        const key = activity.activity_type || "Other";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      },
      {},
    );

    const topCategoryEntry = Object.entries(categoryCount).sort(
      (a, b) => b[1] - a[1],
    )[0];

    const teamCount = users
      .filter((u) => u.role !== "admin" && u.team)
      .reduce<Record<string, number>>((acc, user) => {
        const key = user.team as string;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});

    const topTeamEntry = Object.entries(teamCount).sort(
      (a, b) => b[1] - a[1],
    )[0];
    const recentApproved = approvedActivities[approvedActivities.length - 1];

    setHighlight({
      topCategory: topCategoryEntry?.[0] ?? "No actions yet",
      topCategoryCount: topCategoryEntry?.[1] ?? 0,
      recentAction: recentApproved
        ? `${recentApproved.activity_type} (${Math.round((recentApproved.estimatedCo2Kg || 0) * 100) / 100} kg CO2)`
        : "No verified actions yet",
      topTeam: topTeamEntry?.[0] ?? "No team data",
    });
  }, []);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold">
          Community Leaderboard
        </h2>
        <p className="text-slate-500 text-sm sm:text-base mt-1">
          Real-time ranking based on AI-verified sustainability actions.
        </p>
      </div>

      {/* Community Impact stats — horizontal scroll strip on mobile */}
      <div className="grid grid-cols-3 gap-3 sm:hidden">
        {[
          { label: "CO₂ Saved", value: `${communityStats.co2Kg} kg` },
          { label: "Actions", value: communityStats.activitiesCount },
          { label: "Members", value: communityStats.members },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-emerald-700 text-white rounded-2xl p-3 text-center"
          >
            <p className="text-lg font-bold leading-tight">{stat.value}</p>
            <p className="text-xs text-emerald-200 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* ── Leaderboard table ── */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-5 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-bold">Top Contributors</h3>
            <span className="px-3 py-1 bg-primary-light text-primary rounded-lg text-xs font-bold whitespace-nowrap">
              AI Verified
            </span>
          </div>

          <div className="space-y-1 sm:space-y-2">
            {leaders.length === 0 ? (
              <div className="p-4 rounded-2xl bg-slate-50 text-sm text-slate-500">
                No contributors yet. Log and verify an activity to appear on the
                leaderboard.
              </div>
            ) : null}

            {leaders.map((leader, i) => (
              <div
                key={i}
                className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl hover:bg-slate-50 transition-colors"
              >
                {/* Rank */}
                <span
                  className={cn(
                    "w-7 sm:w-8 text-center font-bold text-sm sm:text-base shrink-0",
                    i === 0
                      ? "text-yellow-500"
                      : i === 1
                        ? "text-slate-400"
                        : i === 2
                          ? "text-orange-400"
                          : "text-slate-300",
                  )}
                >
                  {i + 1}
                </span>

                {/* Avatar */}
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-slate-200 rounded-full overflow-hidden shrink-0">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${leader.name}`}
                    alt="avatar"
                    className="w-full h-full"
                  />
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm sm:text-base truncate">
                    {leader.name}
                  </p>
                  <p className="text-xs text-slate-500">Rank #{leader.rank}</p>
                </div>

                {/* Points */}
                <div className="text-right shrink-0">
                  <p className="font-bold text-primary text-sm sm:text-base">
                    {leader.impact_points}
                  </p>
                  <p className="text-xs text-slate-400">Points</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right column ── */}
        <div className="space-y-4 sm:space-y-6">
          {/* Community Impact card — hidden on mobile (shown as strip above) */}
          <div className="hidden sm:block card bg-gradient-to-br from-emerald-700 via-green-700 to-emerald-800 text-white border-emerald-600 shadow-xl shadow-emerald-900/20">
            <h3 className="text-lg sm:text-xl font-bold mb-4">
              Community Impact
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-emerald-100">
                  Total Estimated CO₂ Saved
                </p>
                <p className="text-2xl sm:text-3xl font-bold">
                  {communityStats.co2Kg} kg
                </p>
              </div>
              <div>
                <p className="text-sm text-emerald-100">Verified Actions</p>
                <p className="text-2xl sm:text-3xl font-bold">
                  {communityStats.activitiesCount}
                </p>
              </div>
              <div>
                <p className="text-sm text-emerald-100">Active Members</p>
                <p className="text-2xl sm:text-3xl font-bold">
                  {communityStats.members}
                </p>
              </div>
            </div>
          </div>

          {/* Proof of Impact */}
          <div className="card">
            <h3 className="text-lg sm:text-xl font-bold mb-4">
              Proof of Impact
            </h3>
            <div className="space-y-3 text-sm">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-slate-500 text-xs sm:text-sm">
                  Top Action Category
                </p>
                <p className="font-bold mt-0.5">
                  {highlight.topCategory}{" "}
                  {highlight.topCategoryCount > 0
                    ? `(${highlight.topCategoryCount})`
                    : ""}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-slate-500 text-xs sm:text-sm">
                  Latest Verified Action
                </p>
                <p className="font-bold mt-0.5 break-words">
                  {highlight.recentAction}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-slate-500 text-xs sm:text-sm">
                  Most Active Team
                </p>
                <p className="font-bold mt-0.5">{highlight.topTeam}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
