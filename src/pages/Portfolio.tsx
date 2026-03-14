import React, { useState, useEffect } from "react";
import { Lock, Sparkles } from "lucide-react";
import { cn } from "../lib/utils";
import { UserData } from "../types";
import {
  badgeCatalog,
  getLevelLabel,
  getNextBadge,
  getUnlockedBadges,
} from "../lib/badges";

export const Portfolio = ({ user }: { user: UserData }) => {
  const [projects, setProjects] = useState<any[]>([]);
  const unlockedBadges = getUnlockedBadges(user.impact_points);
  const nextBadge = getNextBadge(user.impact_points);
  const latestUnlockedBadge = unlockedBadges[unlockedBadges.length - 1];

  const getLocalProjects = () => {
    const storedProjects = JSON.parse(localStorage.getItem("projects") || "[]");
    const forUser = storedProjects.filter(
      (project: any) => project.user_id === user.id,
    );
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

    localStorage.setItem(
      "projects",
      JSON.stringify([...storedProjects, ...seeded]),
    );
    return seeded;
  };

  useEffect(() => {
    setProjects(getLocalProjects());
  }, [user.id]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Profile Header */}
      <div className="card flex flex-col md:flex-row items-center gap-6 md:gap-12">
        {/* Avatar */}
        <div className="w-28 h-28 sm:w-32 sm:h-32 bg-slate-200 rounded-3xl overflow-hidden shadow-lg flex-shrink-0">
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
            alt="avatar"
            className="w-full h-full object-cover"
          />
        </div>

        {/* User Info */}
        <div className="flex-1 text-center md:text-left space-y-2 sm:space-y-3">
          <h2 className="text-2xl sm:text-4xl font-bold">{user.name}</h2>
          <p className="text-sm sm:text-base text-slate-500">
            {getLevelLabel(user.impact_points)} • {user.suburb || "Brisbane"} •{" "}
            {user.team || "Community Team"}
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-2 sm:gap-3 mt-2 sm:mt-4">
            <span className="px-3 sm:px-4 py-1.5 bg-primary-light text-primary rounded-full text-xs sm:text-sm font-bold">
              {latestUnlockedBadge
                ? `${latestUnlockedBadge.name} Unlocked`
                : "Eco Beginner Unlocked"}
            </span>
            <span className="px-3 sm:px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs sm:text-sm font-bold">
              {nextBadge
                ? `Next: ${nextBadge.name} (${Math.max(0, nextBadge.minPoints - user.impact_points)} pts left)`
                : "All Milestone Badges Completed"}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 w-full md:w-auto mt-4 md:mt-0">
          <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl text-center">
            <p className="text-xl sm:text-2xl font-bold text-primary">
              {user.impact_points}
            </p>
            <p className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider font-bold">
              Impact Points
            </p>
          </div>
          <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl text-center">
            <p className="text-xl sm:text-2xl font-bold text-blue-600">
              {unlockedBadges.length}
            </p>
            <p className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider font-bold">
              Badges
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Badges */}
        <div className="card p-4 sm:p-6 flex flex-col">
          <h3 className="text-lg sm:text-xl font-semibold mb-2">
            Awards and Badges
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mb-4">
            {nextBadge
              ? `Earn ${nextBadge.minPoints - user.impact_points} more points to unlock ${nextBadge.name}.`
              : "All milestone badges unlocked."}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {badgeCatalog.map((badge) => {
              const isUnlocked = user.impact_points >= badge.minPoints;
              return (
                <div
                  key={badge.id}
                  className={cn(
                    "flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl border transition-all",
                    isUnlocked
                      ? "bg-white border-slate-100 hover:shadow-md"
                      : "bg-slate-50 border-slate-200 opacity-80",
                  )}
                >
                  <div
                    className={cn(
                      "w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white mb-2 sm:mb-3 shadow-sm",
                      isUnlocked
                        ? `bg-gradient-to-br ${badge.colorClass}`
                        : "bg-slate-300",
                    )}
                  >
                    {isUnlocked ? <Sparkles size={18} /> : <Lock size={16} />}
                  </div>
                  <p className="text-xs sm:text-sm font-bold">{badge.name}</p>
                  <p className="text-[9px] sm:text-[10px] text-slate-500 mt-1">
                    {badge.description}
                  </p>
                  <p className="text-[9px] sm:text-[10px] text-slate-400 mt-1">
                    {badge.minPoints} pts
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Impact Focus */}
        <div className="card p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-4">
            Impact Focus
          </h3>
          <div className="space-y-4">
            {[
              {
                label: "Waste Management",
                progress: 85,
                color: "bg-green-500",
              },
              {
                label: "Energy Efficiency",
                progress: 45,
                color: "bg-blue-500",
              },
              { label: "Advocacy", progress: 60, color: "bg-purple-500" },
              { label: "Biodiversity", progress: 30, color: "bg-orange-500" },
            ].map((focus, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1 sm:mb-2">
                  <span className="font-medium">{focus.label}</span>
                  <span className="text-slate-500 text-xs sm:text-sm">
                    {focus.progress}%
                  </span>
                </div>
                <div className="w-full h-2 sm:h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={cn("h-full", focus.color)}
                    style={{ width: `${focus.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div className="card p-4 sm:p-6 flex flex-col">
          <h3 className="text-lg sm:text-xl font-semibold mb-4">
            Completed Projects
          </h3>
          <div className="space-y-3 sm:space-y-4">
            {projects.map((project, i) => (
              <div
                key={i}
                className="p-3 sm:p-4 rounded-2xl border border-slate-100 hover:border-primary/20 transition-colors"
              >
                <div className="flex justify-between items-start mb-1 sm:mb-2">
                  <p className="font-bold text-sm sm:text-base">
                    {project.title}
                  </p>
                  <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-600 rounded uppercase">
                    {project.status}
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs text-slate-500 line-clamp-3">
                  {project.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
