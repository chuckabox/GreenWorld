import React, { useState, useEffect } from "react";
import { cn } from "../lib/utils";
import { StoredUser } from "../types";

export const Leaderboard = () => {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [communityStats, setCommunityStats] = useState({ co2Kg: 0, activitiesCount: 0, members: 0 });

  useEffect(() => {
    const users: StoredUser[] = JSON.parse(localStorage.getItem("users") || "[]");
    const activities = JSON.parse(localStorage.getItem("activities") || "[]");

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
            <h3 className="text-xl mb-4">Highlights</h3>
            <div className="aspect-video rounded-xl overflow-hidden mb-4">
              <img src="https://images.unsplash.com/photo-1530584735268-5b1c58727a3a?auto=format&fit=crop&q=80&w=500" alt="highlight" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <p className="font-bold mb-1">Green Campus Initiative</p>
            <p className="text-sm text-slate-500">The Student Union successfully implemented solar charging stations across campus.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
