import React, { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Activity, StoredUser } from "../types";

export const AdminPortal = () => {
  const [pending, setPending] = useState<any[]>([]);

  const getLocalPending = () => {
    const users: StoredUser[] = JSON.parse(localStorage.getItem("users") || "[]");
    const activities: Activity[] = JSON.parse(localStorage.getItem("activities") || "[]");
    const usersById = new Map<number, StoredUser>(users.map((u) => [u.id, u]));

    return activities
      .filter((activity) => activity.status === "pending")
      .map((activity) => ({
        ...activity,
        user_name: usersById.get(activity.user_id || 0)?.name || "Unknown User",
      }));
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/pending");
        if (!res.ok) throw new Error("Pending API failed");
        const data = await res.json();
        setPending(data);
      } catch {
        setPending(getLocalPending());
      }
    };

    load();
  }, []);

  const handleReview = async (activityId: number, status: string, points: number) => {
    let apiOk = false;
    try {
      const res = await fetch("/api/admin/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activityId, status, points })
      });
      apiOk = res.ok;
    } catch {
      apiOk = false;
    }

    if (!apiOk) {
      const activities: Activity[] = JSON.parse(localStorage.getItem("activities") || "[]");
      const users: StoredUser[] = JSON.parse(localStorage.getItem("users") || "[]");

      const updatedActivities = activities.map((activity) =>
        activity.id === activityId ? { ...activity, status: status as "approved" | "pending" | "rejected" } : activity
      );
      localStorage.setItem("activities", JSON.stringify(updatedActivities));

      if (status === "approved" && points > 0) {
        const reviewed = updatedActivities.find((activity) => activity.id === activityId);
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
    }

    setPending((prev) => prev.filter((activity) => activity.id !== activityId));
  };

  return (
    <div className="p-6 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card bg-slate-900 text-white">
          <p className="text-sm opacity-70">Total Submissions</p>
          <p className="text-3xl font-bold">1,284</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Pending Review</p>
          <p className="text-3xl font-bold text-yellow-600">{pending.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Approved Today</p>
          <p className="text-3xl font-bold text-green-600">42</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Active Students</p>
          <p className="text-3xl font-bold text-blue-600">856</p>
        </div>
      </div>

      <div className="card">
        <h3 className="text-xl mb-6">Review Queue</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-4 font-bold text-sm text-slate-500">Student</th>
                <th className="pb-4 font-bold text-sm text-slate-500">Activity</th>
                <th className="pb-4 font-bold text-sm text-slate-500">Hours</th>
                <th className="pb-4 font-bold text-sm text-slate-500">Date</th>
                <th className="pb-4 font-bold text-sm text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {pending.map((item) => (
                <tr key={item.id} className="group">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-200 rounded-full overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.user_name}`} alt="avatar" />
                      </div>
                      <span className="font-semibold">{item.user_name}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <p className="font-medium">{item.category}</p>
                    <p className="text-xs text-slate-400 truncate max-w-xs">{item.description}</p>
                  </td>
                  <td className="py-4 font-medium">{item.hours}h</td>
                  <td className="py-4 text-slate-500 text-sm">{item.date}</td>
                  <td className="py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleReview(item.id, 'approved', item.hours * 10)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <CheckCircle2 size={20} />
                      </button>
                      <button
                        onClick={() => handleReview(item.id, 'rejected', 0)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
      </div>
    </div>
  );
};
