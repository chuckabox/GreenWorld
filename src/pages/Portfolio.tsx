import React, { useState, useEffect } from "react";
import { Lock, Sparkles } from "lucide-react";
import { cn } from "../lib/utils";
import { UserData } from "../types";
import { getLevelLabel, toRoman } from "../lib/badges";

export const Portfolio = ({ user }: { user: UserData }) => {
  const [projects, setProjects] = useState<any[]>([]);
  const currentLevel = Math.floor(user.impact_points / 500) + 1;
  const nextLevelThreshold = currentLevel * 500;
  const progressInLevel = user.impact_points % 500;
  const progressPercentage = (progressInLevel / 500) * 100;

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
            {getLevelLabel(user.impact_points)} • {user.suburb || "Brisbane"} • {user.team || "Community Team"}
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            <span className="px-4 py-1.5 bg-primary-light text-primary rounded-full text-sm font-bold">
              Level {toRoman(currentLevel)}
            </span>
            <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-bold">
              {nextLevelThreshold - user.impact_points} pts to Badge {toRoman(currentLevel + 1)}
            </span>
          </div>
        </div>
        <div className="w-full md:w-auto">
          <div className="bg-slate-50 p-6 rounded-2xl text-center min-w-[160px]">
            <p className="text-3xl font-bold text-primary">{user.impact_points}</p>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mt-1">Green Points</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progression Bar */}
        <div className="lg:col-span-2 card flex flex-col justify-center">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold">Badge Progression</h3>
              <p className="text-sm text-slate-500">Every 500 points unlocks the next Roman milestone.</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-display font-black text-primary">
                {toRoman(currentLevel)}
              </span>
              <p className="text-[10px] uppercase font-bold text-slate-400">Current Level</p>
            </div>
          </div>

          <div className="relative pt-2">
            <div className="flex mb-2 items-center justify-between text-xs">
              <div className="font-bold text-primary bg-primary-light px-2 py-1 rounded-lg">
                {user.impact_points} / {nextLevelThreshold} PTS
              </div>
              <div className="text-slate-400 font-bold uppercase tracking-widest">
                {Math.round(progressPercentage)}% to Badge {toRoman(currentLevel + 1)}
              </div>
            </div>
            <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-slate-100 border border-slate-200">
              <div
                style={{ width: `${progressPercentage}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-1000 ease-out"
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2 mt-4">
            {[1, 2, 3, 4, 5].map((i) => {
              const milestoneLevel = currentLevel + i - 1;
              const isCurrent = i === 1;
              return (
                <div key={i} className={cn(
                  "p-3 rounded-xl border text-center transition-all",
                  isCurrent ? "bg-primary-light border-primary shadow-sm" : "bg-slate-50 border-slate-100 opacity-60"
                )}>
                  <p className={cn("text-xs font-bold", isCurrent ? "text-primary" : "text-slate-400")}>
                    {toRoman(milestoneLevel)}
                  </p>
                  <p className="text-[8px] text-slate-400 mt-0.5">{(milestoneLevel - 1) * 500} pts</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Projects */}
        <div className="card">
          <h3 className="text-xl mb-6">Completed Projects</h3>
          <div className="space-y-4">
            {projects.length === 0 ? (
              <p className="text-sm text-slate-500 italic">No projects recorded yet.</p>
            ) : null}
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
