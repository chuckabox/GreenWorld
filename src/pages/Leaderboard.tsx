import React, { useState, useEffect } from "react";
import { cn } from "../lib/utils";
import { Activity, StoredUser } from "../types";

export const Leaderboard = () => {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [communityStats, setCommunityStats] = useState({ co2Kg: 0, activitiesCount: 0, members: 0 });
  const [highlight, setHighlight] = useState({
    topCategory: "No actions yet",
    topCategoryCount: 0,
    recentAction: "No verified actions yet",
    topTeam: "No team data",
  });

  useEffect(() => {
    const users: StoredUser[] = JSON.parse(localStorage.getItem("users") || "[]");
    const activities: Activity[] = JSON.parse(localStorage.getItem("activities") || "[]");

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

    const totalCo2 = activities.reduce((sum: number, a: any) => sum + (a.estimatedCo2Kg || 0), 0);
    setCommunityStats({
      co2Kg: Math.round(totalCo2 * 10) / 10,
      activitiesCount: activities.length,
      members: users.filter((u) => u.role !== "admin").length,
    });

    const approvedActivities = activities.filter((activity) => activity.status === "approved");
    const categoryCount = approvedActivities.reduce<Record<string, number>>((acc, activity) => {
      const key = activity.activity_type || "Other";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const topCategoryEntry = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0];

    const teamCount = users
      .filter((u) => u.role !== "admin" && u.team)
      .reduce<Record<string, number>>((acc, user) => {
        const key = user.team as string;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});

    const topTeamEntry = Object.entries(teamCount).sort((a, b) => b[1] - a[1])[0];
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
    <div className="p-6 space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl">Community Leaderboard</h2>
        <p className="text-slate-500">Celebrating the top sustainability champions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl">Top Individuals</h3>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-primary-light text-primary rounded-lg text-xs font-bold">Weekly</button>
              <button className="px-3 py-1 text-slate-400 rounded-lg text-xs font-bold hover:bg-slate-50">All Time</button>
            </div>
          </div>
          <div className="space-y-2">
            {leaders.map((leader, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                <span className={cn(
                  "w-8 text-center font-bold",
                  i === 0 ? "text-yellow-500" : i === 1 ? "text-slate-400" : i === 2 ? "text-orange-400" : "text-slate-300"
                )}>
                  {i + 1}
                </span>
                <div className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${leader.name}`} alt="avatar" />
                </div>
                <div className="flex-1">
                  <p className="font-bold">{leader.name}</p>
                  <p className="text-xs text-slate-500">Rank #{leader.rank}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">{leader.impact_points}</p>
                  <p className="text-xs text-slate-400">Points</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card bg-primary text-white">
            <h3 className="text-xl mb-4">Community Impact</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm opacity-80">Total CO₂ Saved</p>
                <p className="text-3xl font-bold">{communityStats.co2Kg} kg</p>
              </div>
              <div>
                <p className="text-sm opacity-80">Verified Actions</p>
                <p className="text-3xl font-bold">{communityStats.activitiesCount}</p>
              </div>
              <div>
                <p className="text-sm opacity-80">Active Members</p>
                <p className="text-3xl font-bold">{communityStats.members}</p>
              </div>
            </div>
          </div>
          <div className="card">
            <h3 className="text-xl mb-4">Local Highlights</h3>
            <div className="space-y-4 text-sm">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-slate-500">Top Action Category</p>
                <p className="font-bold">{highlight.topCategory} {highlight.topCategoryCount > 0 ? `(${highlight.topCategoryCount})` : ""}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-slate-500">Most Recent Verified Action</p>
                <p className="font-bold">{highlight.recentAction}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-slate-500">Most Active Team</p>
                <p className="font-bold">{highlight.topTeam}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
