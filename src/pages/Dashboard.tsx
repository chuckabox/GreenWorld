import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Zap, Globe, Clock, AlertCircle, ChevronDown, ChevronLeft, ChevronRight, Target, Calendar, ShieldCheck, Info, History, X as CloseIcon } from "lucide-react";
import { cn } from "../lib/utils";
import { UserData, Activity } from "../types";
import { getLevelLabel, toRoman } from "../lib/badges";
import tasksAndEventsData from "../data/tasksAndEvents.json";
import { LogActivityDialog } from "../components/LogActivityDialog";
import { GreenPassInfoDialog } from "../components/GreenPassInfoDialog";
import { EventHistoryDialog } from "../components/EventHistoryDialog";

type FilterDropdownOption = {
  value: string;
  label: string;
};

const FilterDropdown = ({
  value,
  options,
  onChange,
}: {
  value: string;
  options: FilterDropdownOption[];
  onChange: (value: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const selected = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  return (
    <div ref={rootRef} className="relative min-w-[140px]">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-900 flex items-center justify-between hover:border-primary/30 hover:bg-white transition-colors"
      >
        <span>{selected?.label ?? "Select"}</span>
        <ChevronDown size={16} className={cn("text-slate-400 transition-transform", open && "rotate-180")} />
      </button>
      {open ? (
        <div className="absolute right-0 mt-2 w-full rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70 p-2 z-20">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={cn(
                "w-full text-left px-3 py-2 rounded-xl text-sm transition-colors",
                option.value === value
                  ? "bg-primary-light text-primary font-semibold"
                  : "text-slate-700 hover:bg-slate-50"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

type TaskItem = { id: string; type: string; title: string; description?: string; pointsReward?: number };
type EventItem = { id: string; type: string; title: string; date?: string; location?: string };

export const Dashboard = ({ user, activities, onActivityLogged }: { user: UserData; activities: Activity[]; onActivityLogged: () => void }) => {
  const safeActivities = activities ?? [];
  const [statusFilter, setStatusFilter] = useState<"all" | "approved" | "pending" | "rejected">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [activityPage, setActivityPage] = useState(1);
  const [isLogDialogOpen, setIsLogDialogOpen] = useState(false);
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  
  const currentLevel = Math.floor(user.impact_points / 500) + 1;
  const nextLevelThreshold = currentLevel * 500;
  const progressInLevel = user.impact_points % 500;
  const progressPercentage = (progressInLevel / 500) * 100;

  const totalEstimatedCo2 = safeActivities.reduce((sum, activity) => sum + (activity.estimatedCo2Kg ?? 0), 0);
  const totalEventsCompleted = safeActivities.filter(a => a.status === 'approved').length;
  
  const today = new Date().toISOString().split('T')[0];
  const tasks = useMemo(() => (tasksAndEventsData as (TaskItem | EventItem)[]).filter((t) => t.type === "task") as TaskItem[], []);
  const allEvents = useMemo(() => (tasksAndEventsData as (TaskItem | EventItem)[]).filter((t) => t.type === "event") as EventItem[], []);
  const upcomingEvents = allEvents.filter(e => e.date && e.date >= today).sort((a, b) => (a.date ?? "").localeCompare(b.date ?? ""));
  const pastEvents = allEvents.filter(e => e.date && e.date < today).sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
  const activityCategories = useMemo(
    () => Array.from(new Set(activities.map((activity) => activity.category).filter(Boolean))).sort(),
    [activities],
  );
  const filteredActivities = useMemo(
    () => [...activities]
      .filter((activity) => statusFilter === "all" || activity.status === statusFilter)
      .filter((activity) => categoryFilter === "all" || activity.category === categoryFilter)
      .sort((left, right) => {
        const dateDiff = new Date(right.date).getTime() - new Date(left.date).getTime();
        if (dateDiff !== 0) return dateDiff;
        return right.id - left.id;
      }),
    [safeActivities, categoryFilter, statusFilter],
  );
  const activitiesPerPage = 5;
  const totalActivityPages = Math.max(1, Math.ceil(filteredActivities.length / activitiesPerPage));
  const safeActivityPage = Math.min(activityPage, totalActivityPages);
  const pagedActivities = filteredActivities.slice(
    (safeActivityPage - 1) * activitiesPerPage,
    safeActivityPage * activitiesPerPage,
  );
  const statusOptions: FilterDropdownOption[] = [
    { value: "all", label: "All statuses" },
    { value: "approved", label: "Approved" },
    { value: "pending", label: "Pending" },
    { value: "rejected", label: "Rejected" },
  ];
  const categoryOptions: FilterDropdownOption[] = [
    { value: "all", label: "All categories" },
    ...activityCategories.map((category) => ({ value: category, label: category })),
  ];

  if (!user) return null;

  const firstName = (user.name || "there").trim().split(/\s+/)[0] || "there";

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl">Welcome back, {firstName}! 👋</h2>
          <p className="text-slate-500">
            {user.suburb ? `${user.suburb} ` : ""}
            {user.team ? `• ${user.team} • ` : ""}
            Level: {getLevelLabel(user.impact_points)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsLogDialogOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <PlusCircle size={20} />
          Log New Activity
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card flex items-center gap-4 relative overflow-hidden">
          <div className="w-12 h-12 bg-primary-light text-primary rounded-xl flex items-center justify-center shrink-0">
            <Zap size={24} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <p className="text-sm text-slate-500 font-medium">Green Pass</p>
              </div>
              <button 
                onClick={() => setIsInfoDialogOpen(true)}
                className="text-slate-300 hover:text-primary transition-colors p-1"
                aria-label="Green Pass Info"
              >
                <Info size={16} />
              </button>
            </div>
            <div className="flex items-baseline gap-1">
              <p className="text-2xl font-bold">{user.impact_points}</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">pts</p>
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-[0.03] text-primary rotate-12 pointer-events-none">
            <ShieldCheck size={80} />
          </div>
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
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center shrink-0">
            <Calendar size={24} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm text-slate-500 font-medium">Events Completed</p>
              <button 
                onClick={() => setIsHistoryOpen(true)}
                className="text-slate-300 hover:text-orange-600 transition-colors p-1"
                aria-label="View History"
              >
                <History size={16} />
              </button>
            </div>
            <p className="text-2xl font-bold">{totalEventsCompleted}</p>
          </div>
        </div>
      </div>

      {/* Badge Progression */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold">Badge Progression</h3>
            <p className="text-sm text-slate-500">Badge {toRoman(currentLevel)} unlocked</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-display font-black text-primary">
              {toRoman(currentLevel + 1)}
            </span>
            <p className="text-[10px] uppercase font-bold text-slate-400 text-nowrap">Next Milestone</p>
          </div>
        </div>

        <div className="relative pt-2">
          <div className="flex mb-2 items-center justify-between text-xs">
            <div className="font-bold text-primary bg-primary-light px-2 py-1 rounded-lg">
              {user.impact_points} / {nextLevelThreshold} pts
            </div>
            <div className="text-slate-400 font-bold uppercase tracking-widest">
              {Math.round(progressPercentage)}% to Badge {toRoman(currentLevel + 1)}
            </div>
          </div>
          <div className="overflow-hidden h-3 mb-2 text-xs flex rounded-full bg-slate-100 border border-slate-200">
            <div
              style={{ width: `${progressPercentage}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-1000 ease-out"
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 card flex flex-col min-h-0">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6 shrink-0">
            <h3 className="text-xl">Recent Activities</h3>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <FilterDropdown
                value={statusFilter}
                options={statusOptions}
                onChange={(value) => {
                  setStatusFilter(value as "all" | "approved" | "pending" | "rejected");
                  setActivityPage(1);
                }}
              />
              <FilterDropdown
                value={categoryFilter}
                options={categoryOptions}
                onChange={(value) => {
                  setCategoryFilter(value);
                  setActivityPage(1);
                }}
              />
            </div>
          </div>
          <div className="flex-1 min-h-0 space-y-4">
            {pagedActivities.length > 0 ? pagedActivities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-50 hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
                  <Clock size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{activity.taskTitle ?? activity.category}</p>
                  <p className="text-xs text-slate-500">{activity.date} • {activity.hours} hours</p>
                </div>
                <div className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold capitalize",
                  activity.status === 'approved' ? "bg-primary-light text-primary" :
                    activity.status === 'pending' ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"
                )}>
                  {activity.status}
                </div>
              </div>
            )) : (
              <div className="text-center py-12 text-slate-400">
                <AlertCircle className="mx-auto mb-2" size={32} />
                <p>No activities match the current filters.</p>
              </div>
            )}
          </div>
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
            <div className="text-sm text-slate-500">
              Page {safeActivityPage} of {totalActivityPages}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActivityPage((current) => Math.max(1, current - 1))}
                disabled={safeActivityPage === 1}
                className="inline-flex items-center gap-2 px-4 h-11 border border-slate-200 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
              >
                <ChevronLeft size={16} />
                Back
              </button>
              <button
                type="button"
                onClick={() => setActivityPage((current) => Math.min(totalActivityPages, current + 1))}
                disabled={safeActivityPage === totalActivityPages}
                className="inline-flex items-center gap-2 px-4 h-11 border border-slate-200 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Current tasks & Upcoming events */}
        <div className="card space-y-6">
          <div>
            <h3 className="text-xl mb-4 flex items-center gap-2">
              <Target size={22} className="text-primary" />
              Current tasks
            </h3>
            <ul className="space-y-3">
              {tasks.slice(0, 4).map((t) => (
                <li key={t.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="font-medium text-slate-900">{t.title}</p>
                  {t.pointsReward != null && (
                    <span className="text-sm font-semibold text-primary">{t.pointsReward} pts</span>
                  )}
                </li>
              ))}
            </ul>
            <Link
              to="/ai-supervisor"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              Check fit in AI Advisor
              <ChevronRight size={16} />
            </Link>
          </div>
          <div>
            <h3 className="text-xl mb-4 flex items-center gap-2">
              <Calendar size={22} className="text-primary" />
              Upcoming events
            </h3>
            <div className="space-y-4">
              {upcomingEvents.slice(0, 2).map((event) => (
                <div key={event.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">{event.date ?? ""}</span>
                    <ChevronRight size={16} className="text-slate-300" />
                  </div>
                  <p className="font-medium text-slate-900">{event.title}</p>
                  {event.location && <p className="text-xs text-slate-500">{event.location}</p>}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100/50">
            <h3 className="text-lg mb-3 flex items-center gap-2 text-slate-400">
              <Clock size={18} />
              Past events
            </h3>
            <div className="space-y-3">
              {pastEvents.slice(0, 2).map((event) => (
                <div key={event.id} className="p-3 rounded-xl border border-dashed border-slate-200 opacity-60">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-tight mb-1">{event.date ?? ""}</p>
                  <p className="text-sm font-medium text-slate-600">{event.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {isLogDialogOpen && (
        <LogActivityDialog
          userId={user.id}
          onActivityLogged={() => {
            onActivityLogged();
          }}
          onClose={() => setIsLogDialogOpen(false)}
        />
      )}
      {isInfoDialogOpen && (
        <GreenPassInfoDialog onClose={() => setIsInfoDialogOpen(false)} />
      )}
      {isHistoryOpen && (
        <EventHistoryDialog 
          activities={safeActivities} 
          onClose={() => setIsHistoryOpen(false)} 
        />
      )}
    </div>
  );
};
