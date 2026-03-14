import React, { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Activity, StoredUser } from "../types";

export const AdminPortal = () => {
  const [pending, setPending] = useState<any[]>([]);

  const getLocalPending = () => {
    const users: StoredUser[] = JSON.parse(
      localStorage.getItem("users") || "[]",
    );
    const activities: Activity[] = JSON.parse(
      localStorage.getItem("activities") || "[]",
    );
    const usersById = new Map<number, StoredUser>(users.map((u) => [u.id, u]));

    return activities
      .filter((activity) => activity.status === "pending")
      .map((activity) => ({
        ...activity,
        user_name: usersById.get(activity.user_id || 0)?.name || "Unknown User",
      }));
  };

  useEffect(() => {
    setPending(getLocalPending());
  }, []);

  const handleReview = (activityId: number, status: string, points: number) => {
    const activities: Activity[] = JSON.parse(
      localStorage.getItem("activities") || "[]",
    );
    const users: StoredUser[] = JSON.parse(
      localStorage.getItem("users") || "[]",
    );

    const updatedActivities = activities.map((activity) =>
      activity.id === activityId
        ? { ...activity, status: status as "approved" | "pending" | "rejected" }
        : activity,
    );
    localStorage.setItem("activities", JSON.stringify(updatedActivities));

    if (status === "approved" && points > 0) {
      const reviewed = updatedActivities.find(
        (activity) => activity.id === activityId,
      );
      if (reviewed?.user_id) {
        const updatedUsers = users.map((user) => {
          if (user.id !== reviewed.user_id) return user;
          const updatedPoints = (user.impact_points || 0) + points;
          return {
            ...user,
            impact_points: updatedPoints,
            award_progress: Math.min(100, Math.round(updatedPoints / 10)),
          };
        });
        localStorage.setItem("users", JSON.stringify(updatedUsers));
      }
    }

    setPending((prev) => prev.filter((activity) => activity.id !== activityId));
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <div className="card bg-slate-900 text-white">
          <p className="text-xs sm:text-sm opacity-70">Total Submissions</p>
          <p className="text-2xl sm:text-3xl font-bold mt-1">1,284</p>
        </div>
        <div className="card">
          <p className="text-xs sm:text-sm text-slate-500">Pending Review</p>
          <p className="text-2xl sm:text-3xl font-bold text-yellow-600 mt-1">
            {pending.length}
          </p>
        </div>
        <div className="card">
          <p className="text-xs sm:text-sm text-slate-500">Approved Today</p>
          <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-1">
            42
          </p>
        </div>
        <div className="card">
          <p className="text-xs sm:text-sm text-slate-500">Active Students</p>
          <p className="text-2xl sm:text-3xl font-bold text-blue-600 mt-1">
            856
          </p>
        </div>
      </div>

      {/* ── Review Queue ── */}
      <div className="card">
        <h3 className="text-lg sm:text-xl font-bold mb-5 sm:mb-6">
          Review Queue
        </h3>

        {/* Desktop table — hidden on mobile */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-4 font-bold text-sm text-slate-500">
                  Student
                </th>
                <th className="pb-4 font-bold text-sm text-slate-500">
                  Activity
                </th>
                <th className="pb-4 font-bold text-sm text-slate-500">Hours</th>
                <th className="pb-4 font-bold text-sm text-slate-500">Date</th>
                <th className="pb-4 font-bold text-sm text-slate-500 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {pending.map((item) => (
                <tr key={item.id} className="group">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-200 rounded-full overflow-hidden shrink-0">
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.user_name}`}
                          alt="avatar"
                          className="w-full h-full"
                        />
                      </div>
                      <span className="font-semibold">{item.user_name}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <p className="font-medium">{item.category}</p>
                    <p className="text-xs text-slate-400 truncate max-w-[200px] lg:max-w-xs">
                      {item.description}
                    </p>
                  </td>
                  <td className="py-4 font-medium">{item.hours}h</td>
                  <td className="py-4 text-slate-500 text-sm">{item.date}</td>
                  <td className="py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() =>
                          handleReview(item.id, "approved", item.hours * 10)
                        }
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        aria-label="Approve"
                      >
                        <CheckCircle2 size={20} />
                      </button>
                      <button
                        onClick={() => handleReview(item.id, "rejected", 0)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="Reject"
                      >
                        <AlertCircle size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {pending.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    Queue is empty. Great job!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile card list — shown only on mobile */}
        <div className="sm:hidden space-y-3">
          {pending.length === 0 ? (
            <p className="py-10 text-center text-slate-400 text-sm">
              Queue is empty. Great job!
            </p>
          ) : (
            pending.map((item) => (
              <div
                key={item.id}
                className="border border-slate-100 rounded-2xl p-4 space-y-3"
              >
                {/* Student + actions row */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 bg-slate-200 rounded-full overflow-hidden shrink-0">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.user_name}`}
                        alt="avatar"
                        className="w-full h-full"
                      />
                    </div>
                    <span className="font-semibold text-sm truncate">
                      {item.user_name}
                    </span>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <button
                      onClick={() =>
                        handleReview(item.id, "approved", item.hours * 10)
                      }
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      aria-label="Approve"
                    >
                      <CheckCircle2 size={20} />
                    </button>
                    <button
                      onClick={() => handleReview(item.id, "rejected", 0)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Reject"
                    >
                      <AlertCircle size={20} />
                    </button>
                  </div>
                </div>

                {/* Activity details */}
                <div>
                  <p className="font-medium text-sm">{item.category}</p>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                {/* Meta row */}
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">
                    {item.hours}h
                  </span>
                  <span>{item.date}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
