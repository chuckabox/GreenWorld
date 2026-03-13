import React, { useMemo, useState } from "react";
import { AlertCircle, ChevronLeft, ChevronRight, Clock3 } from "lucide-react";
import { cn } from "../lib/utils";
import { Activity } from "../types";

const PAGE_SIZE = 5;

export const ActivityHistory = ({ activities }: { activities: Activity[] }) => {
  const [statusFilter, setStatusFilter] = useState<"all" | "approved" | "pending" | "rejected">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [page, setPage] = useState(1);

  const categories = useMemo(() => {
    return Array.from(new Set(activities.map((activity) => activity.category).filter(Boolean))).sort();
  }, [activities]);

  const filteredActivities = useMemo(() => {
    return [...activities]
      .filter((activity) => statusFilter === "all" || activity.status === statusFilter)
      .filter((activity) => categoryFilter === "all" || activity.category === categoryFilter)
      .sort((left, right) => {
        const dateDiff = new Date(right.date).getTime() - new Date(left.date).getTime();
        if (dateDiff !== 0) return dateDiff;
        return right.id - left.id;
      });
  }, [activities, statusFilter, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredActivities.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedActivities = filteredActivities.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleStatusChange = (value: "all" | "approved" | "pending" | "rejected") => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
    setPage(1);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl">Activity History</h2>
          <p className="text-slate-500">Browse your submitted sustainability actions with filter and page controls.</p>
        </div>
        <div className="text-sm text-slate-500">
          Showing {pagedActivities.length} of {filteredActivities.length} matching activities
        </div>
      </div>

      <div className="card space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Filter by status</label>
            <select
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value as "all" | "approved" | "pending" | "rejected")}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="all">All statuses</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Filter by category</label>
            <select
              value={categoryFilter}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="all">All categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {pagedActivities.length > 0 ? (
            pagedActivities.map((activity) => (
              <div key={activity.id} className="p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 shrink-0">
                    <Clock3 size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                      <div>
                        <p className="font-semibold">{activity.category}</p>
                        <p className="text-xs text-slate-500">{activity.date} • {activity.hours} hours</p>
                      </div>
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-bold capitalize w-fit",
                        activity.status === "approved" ? "bg-green-100 text-green-700" :
                          activity.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                            "bg-red-100 text-red-700"
                      )}>
                        {activity.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{activity.description}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-slate-400">
              <AlertCircle className="mx-auto mb-2" size={32} />
              <p>No activities match the selected filters.</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={safePage === 1}
            className="inline-flex items-center gap-2 px-4 h-11 border border-slate-200 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
          >
            <ChevronLeft size={16} />
            Back
          </button>
          <div className="text-sm text-slate-500">
            Page {safePage} of {totalPages}
          </div>
          <button
            type="button"
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={safePage === totalPages}
            className="inline-flex items-center gap-2 px-4 h-11 border border-slate-200 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};