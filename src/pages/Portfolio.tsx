import React, { useState, useEffect } from "react";
import { Lock, Sparkles } from "lucide-react";
import { cn } from "../lib/utils";
import { UserData } from "../types";
import { badgeCatalog, getLevelLabel, getNextBadge, getUnlockedBadges } from "../lib/badges";

export const Portfolio = ({ user }: { user: UserData }) => {
  const [projects, setProjects] = useState<any[]>([]);
  const unlockedBadges = getUnlockedBadges(user.impact_points);
  const nextBadge = getNextBadge(user.impact_points);
  const levelLabel = getLevelLabel(user.impact_points);

  const getLocalProjects = () => {
    const storedProjects = JSON.parse(localStorage.getItem("projects") || "[]");
    const forUser = storedProjects.filter((project: any) => project.user_id === user.id);
    if (forUser.length > 0) return forUser;

    const seeded = [
      {
        id: Date.now(),
        user_id: user.id,
        title: `${user.suburb || "Community"} Clean-Up Drive`,
        description: `Coordinated a local volunteer effort with ${user.team || "community members"} to reduce street litter and improve recycling awareness.`,
        status: "In Progress",
      },
    ];

    localStorage.setItem("projects", JSON.stringify([...storedProjects, ...seeded]));
    return seeded;
  };

  useEffect(() => {
    setProjects(getLocalProjects());
  }, [user.id]);

  return (
    <div className="p-6 space-y-8">
      {/* Profile Header */}
      <div className="card flex flex-col md:flex-row items-center gap-8">
        <div className="w-32 h-32 bg-slate-200 rounded-3xl overflow-hidden shadow-lg">
          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="avatar" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-4xl mb-2">{user.name}</h2>
          <p className="text-slate-500 mb-4">
            {levelLabel} • {user.suburb || "Brisbane"} • {user.team || "Community Team"}
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-2">
            {unlockedBadges.slice(-3).map((badge) => (
              <span key={badge.id} className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {badge.name}
              </span>
            ))}
            {nextBadge && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                Next: {nextBadge.name} at {nextBadge.minPoints} pts
              </span>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
          <div className="bg-slate-50 p-4 rounded-2xl text-center">
            <p className="text-2xl font-bold text-primary">{user.impact_points}</p>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Impact Points</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl text-center">
            <p className="text-2xl font-bold text-blue-600">{unlockedBadges.length}</p>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Badges</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Badges - same wording and order as Dashboard */}
        <div className="card">
          <p className="text-sm font-semibold text-slate-500">Badge Progress</p>
          <p className="text-xl font-bold mt-1">{unlockedBadges.length} unlocked badges</p>
          <p className="text-sm text-slate-500 mt-2 mb-6">
            {nextBadge
              ? `Next badge: ${nextBadge.name} at ${nextBadge.minPoints} points`
              : "All core badges unlocked. You are now a city-level climate champion."}
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            {unlockedBadges.map((badge) => (
              <span key={badge.id} className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {badge.name}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {badgeCatalog.map((badge) => {
              const isUnlocked = user.impact_points >= badge.minPoints;
              return (
                <div
                  key={badge.id}
                  className={cn(
                    "flex flex-col items-center text-center p-3 rounded-xl border transition-all",
                    isUnlocked
                      ? "bg-white border-slate-100 hover:shadow-md"
                      : "bg-slate-50 border-slate-200 opacity-75"
                  )}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center text-white mb-2 shadow-sm",
                      isUnlocked ? `bg-gradient-to-br ${badge.colorClass}` : "bg-slate-300"
                    )}
                  >
                    {isUnlocked ? <Sparkles size={18} /> : <Lock size={16} />}
                  </div>
                  <p className="text-xs font-bold">{badge.name}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">{badge.description}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{badge.minPoints} pts</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Impact Focus */}
        <div className="card">
          <h3 className="text-xl mb-6">Impact Focus</h3>
          <div className="space-y-6">
            {[
              { label: "Waste Management", progress: 85, color: "bg-green-500" },
              { label: "Energy Efficiency", progress: 45, color: "bg-blue-500" },
              { label: "Advocacy", progress: 60, color: "bg-purple-500" },
              { label: "Biodiversity", progress: 30, color: "bg-orange-500" },
            ].map((focus, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">{focus.label}</span>
                  <span className="text-slate-500">{focus.progress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={cn("h-full", focus.color)} style={{ width: `${focus.progress}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div className="card">
          <h3 className="text-xl mb-6">Completed Projects</h3>
          <div className="space-y-4">
            {projects.map((project, i) => (
              <div key={i} className="p-4 rounded-2xl border border-slate-100 hover:border-primary/20 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-bold">{project.title}</p>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-600 rounded uppercase">{project.status}</span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2">{project.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
