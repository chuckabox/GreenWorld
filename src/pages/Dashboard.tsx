import React from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Zap, Globe, Clock, AlertCircle, ChevronRight } from "lucide-react";
import { cn } from "../lib/utils";
import { UserData, Activity } from "../types";
import { getLevelLabel, getNextBadge, getUnlockedBadges } from "../lib/badges";

export const Dashboard = ({ user, activities }: { user: UserData, activities: Activity[] }) => {
  const unlockedBadges = getUnlockedBadges(user.impact_points);
  const nextBadge = getNextBadge(user.impact_points);
  const totalEstimatedCo2 = activities.reduce((sum, activity) => sum + (activity.estimatedCo2Kg ?? 0), 0);
  const previewActivities = [...activities]
    .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime())
    .slice(0, 3);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl">Welcome back, {user.name.split(' ')[0]}! 👋</h2>
          <p className="text-slate-500">
            {user.suburb ? `${user.suburb} ` : ""}
            {user.team ? `• ${user.team} • ` : ""}
            Level: {getLevelLabel(user.impact_points)}
          </p>
        </div>
        <Link to="/log" className="btn-primary flex items-center gap-2">
          <PlusCircle size={20} />
          Log New Activity
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-light text-primary rounded-xl flex items-center justify-center">
            <Zap size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Impact Points</p>
            <p className="text-2xl font-bold">{user.impact_points}</p>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-500 font-medium">Award Progress</p>
            <span className="text-sm font-bold text-primary">{user.award_progress}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-primary" style={{ width: `${user.award_progress}%` }}></div>
          </div>
          <p className="text-xs text-slate-400 mt-2">Next: Silver Award (500 pts)</p>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Globe size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Verified CO2 Saved</p>
            <p className="text-2xl font-bold">{totalEstimatedCo2.toFixed(2)} kg</p>
          </div>
        </div>
      </div>

      <div className="card flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">Badge Progress</p>
          <p className="text-xl font-bold">{unlockedBadges.length} unlocked badges</p>
          <p className="text-sm text-slate-500">
            {nextBadge
              ? `Next badge: ${nextBadge.name} at ${nextBadge.minPoints} points`
              : "All core badges unlocked. You are now a city-level climate champion."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {unlockedBadges.slice(-3).map((badge) => (
            <span key={badge.id} className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {badge.name}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl">Recent Activities</h3>
            <Link to="/activities" className="inline-flex items-center gap-2 text-primary text-sm font-semibold hover:underline">
              Open Activity History
              <ChevronRight size={14} />
            </Link>
          </div>
          <div className="space-y-4">
            {previewActivities.length > 0 ? previewActivities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-50 hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
                  <Clock size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{activity.category}</p>
                  <p className="text-xs text-slate-500">{activity.date} • {activity.hours} hours</p>
                </div>
                <div className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold capitalize",
                  activity.status === 'approved' ? "bg-green-100 text-green-700" :
                    activity.status === 'pending' ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"
                )}>
                  {activity.status}
                </div>
              </div>
            )) : (
              <div className="text-center py-12 text-slate-400">
                <AlertCircle className="mx-auto mb-2" size={32} />
                <p>No activities logged yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Green Events */}
        <div className="card">
          <h3 className="text-xl mb-6">Upcoming Green Events</h3>
          <div className="space-y-4">
            {[
              { title: "Tree Planting Day", date: "Mar 20", location: "Central Park" },
              { title: "Eco-Tech Workshop", date: "Mar 25", location: "Innovation Hub" },
              { title: "Zero Waste Seminar", date: "Apr 02", location: "Online" },
            ].map((event, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">{event.date}</span>
                  <ChevronRight size={16} className="text-slate-300" />
                </div>
                <p className="font-bold">{event.title}</p>
                <p className="text-xs text-slate-500">{event.location}</p>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 border-2 border-slate-100 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors">
            Explore All Events
          </button>
        </div>
      </div>
    </div>
  );
};
