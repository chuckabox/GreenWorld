import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  PlusCircle,
  Zap,
  Globe,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "../lib/utils";
import { UserData, Activity } from "../types";
import { getLevelLabel, getNextBadge, getUnlockedBadges } from "../lib/badges";

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
  const selected =
    options.find((option) => option.value === value) ?? options[0];

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
    <div
      ref={rootRef}
      className="relative min-w-0 flex-1 sm:flex-none sm:min-w-[140px]"
    >
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-900 flex items-center justify-between hover:border-primary/30 hover:bg-white transition-colors"
      >
        <span className="truncate">{selected?.label ?? "Select"}</span>
        <ChevronDown
          size={16}
          className={cn(
            "text-slate-400 transition-transform shrink-0 ml-2",
            open && "rotate-180",
          )}
        />
      </button>
      {open ? (
        <div className="absolute right-0 mt-2 w-full min-w-[160px] rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70 p-2 z-20">
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
                  : "text-slate-700 hover:bg-slate-50",
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

export const Dashboard = ({
  user,
  activities,
}: {
  user: UserData;
  activities: Activity[];
}) => {
  const [statusFilter, setStatusFilter] = useState<
    "all" | "approved" | "pending" | "rejected"
  >("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [activityPage, setActivityPage] = useState(1);

  const unlockedBadges = getUnlockedBadges(user.impact_points);
  const nextBadge = getNextBadge(user.impact_points);
  const totalEstimatedCo2 = activities.reduce(
    (sum, activity) => sum + (activity.estimatedCo2Kg ?? 0),
    0,
  );

  const activityCategories = useMemo(
    () =>
      Array.from(
        new Set(
          activities.map((activity) => activity.category).filter(Boolean),
        ),
      ).sort(),
    [activities],
  );

  const filteredActivities = useMemo(
    () =>
      [...activities]
        .filter(
          (activity) =>
            statusFilter === "all" || activity.status === statusFilter,
        )
        .filter(
          (activity) =>
            categoryFilter === "all" || activity.category === categoryFilter,
        )
        .sort((left, right) => {
          const dateDiff =
            new Date(right.date).getTime() - new Date(left.date).getTime();
          if (dateDiff !== 0) return dateDiff;
          return right.id - left.id;
        }),
    [activities, categoryFilter, statusFilter],
  );

  const activitiesPerPage = 5;
  const totalActivityPages = Math.max(
    1,
    Math.ceil(filteredActivities.length / activitiesPerPage),
  );
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
    ...activityCategories.map((category) => ({
      value: category,
      label: category,
    })),
  ];

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold">
            Welcome back, {user.name.split(" ")[0]}! 👋
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-0.5">
            {user.suburb ? `${user.suburb} ` : ""}
            {user.team ? `• ${user.team} • ` : ""}
            Level: {getLevelLabel(user.impact_points)}
          </p>
        </div>
        <Link
          to="/log"
          className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <PlusCircle size={20} />
          Log New Activity
        </Link>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {/* Impact Points */}
        <div className="card flex items-center gap-4">
          <div className="w-11 h-11 sm:w-12 sm:h-12 bg-primary-light text-primary rounded-xl flex items-center justify-center shrink-0">
            <Zap size={22} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Impact Points</p>
            <p className="text-2xl font-bold">{user.impact_points}</p>
          </div>
        </div>

        {/* Award Progress */}
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-500 font-medium">Award Progress</p>
            <span className="text-sm font-bold text-primary">
              {user.award_progress}%
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary"
              style={{ width: `${user.award_progress}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Next: Silver Award (500 pts)
          </p>
        </div>

        {/* CO2 Saved */}
        <div className="card flex items-center gap-4">
          <div className="w-11 h-11 sm:w-12 sm:h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
            <Globe size={22} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">
              Verified CO₂ Saved
            </p>
            <p className="text-2xl font-bold">
              {totalEstimatedCo2.toFixed(2)} kg
            </p>
          </div>
        </div>
      </div>

      {/* ── Badge Progress ── */}
      <div className="card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">Badge Progress</p>
          <p className="text-lg sm:text-xl font-bold">
            {unlockedBadges.length} unlocked badges
          </p>
          <p className="text-sm text-slate-500">
            {nextBadge
              ? `Next badge: ${nextBadge.name} at ${nextBadge.minPoints} points`
              : "All core badges unlocked. You are now a city-level climate champion."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {unlockedBadges.slice(-3).map((badge) => (
            <span
              key={badge.id}
              className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"
            >
              {badge.name}
            </span>
          ))}
        </div>
      </div>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 card">
          {/* Card header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-bold shrink-0">
              Recent Activities
            </h3>
            {/* Filters — full-width on mobile, side-by-side */}
            <div className="flex gap-2 sm:gap-3">
              <FilterDropdown
                value={statusFilter}
                options={statusOptions}
                onChange={(value) => {
                  setStatusFilter(
                    value as "all" | "approved" | "pending" | "rejected",
                  );
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

          {/* Activity list */}
          <div className="space-y-3 sm:space-y-4">
            {pagedActivities.length > 0 ? (
              pagedActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl border border-slate-50 hover:bg-slate-50 transition-colors"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 shrink-0">
                    <Clock size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm sm:text-base truncate">
                      {activity.category}
                    </p>
                    <p className="text-xs text-slate-500">
                      {activity.date} • {activity.hours} hours
                    </p>
                  </div>
                  <div
                    className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-bold capitalize shrink-0",
                      activity.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : activity.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700",
                    )}
                  >
                    {activity.status}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 sm:py-12 text-slate-400">
                <AlertCircle className="mx-auto mb-2" size={32} />
                <p className="text-sm">
                  No activities match the current filters.
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="mt-4 sm:mt-5 flex items-center justify-between gap-3">
            <div className="text-xs sm:text-sm text-slate-500">
              Page {safeActivityPage} of {totalActivityPages}
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() =>
                  setActivityPage((current) => Math.max(1, current - 1))
                }
                disabled={safeActivityPage === 1}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 h-9 sm:h-11 border border-slate-200 rounded-xl text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
              >
                <ChevronLeft size={15} />
                <span className="hidden xs:inline">Back</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  setActivityPage((current) =>
                    Math.min(totalActivityPages, current + 1),
                  )
                }
                disabled={safeActivityPage === totalActivityPages}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 h-9 sm:h-11 border border-slate-200 rounded-xl text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
              >
                <span className="hidden xs:inline">Next</span>
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Upcoming Green Events */}
        <div className="card">
          <h3 className="text-lg sm:text-xl font-bold mb-5 sm:mb-6">
            Upcoming Green Events
          </h3>
          <div className="space-y-3 sm:space-y-4">
            {[
              {
                title: "Tree Planting Day",
                date: "Mar 20",
                location: "Central Park",
              },
              {
                title: "Eco-Tech Workshop",
                date: "Mar 25",
                location: "Innovation Hub",
              },
              {
                title: "Zero Waste Seminar",
                date: "Apr 02",
                location: "Online",
              },
            ].map((event, i) => (
              <div
                key={i}
                className="p-3 sm:p-4 rounded-2xl bg-slate-50 border border-slate-100"
              >
                <div className="flex justify-between items-start mb-1.5 sm:mb-2">
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">
                    {event.date}
                  </span>
                  <ChevronRight size={15} className="text-slate-300 shrink-0" />
                </div>
                <p className="font-bold text-sm sm:text-base">{event.title}</p>
                <p className="text-xs text-slate-500">{event.location}</p>
              </div>
            ))}
          </div>
          <button className="w-full mt-5 sm:mt-6 py-3 border-2 border-slate-100 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors">
            Explore All Events
          </button>
        </div>
      </div>
    </div>
  );
};
