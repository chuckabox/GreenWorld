import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const LogActivity = ({ userId, onActivityLogged }: { userId: number, onActivityLogged: () => void }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: "Waste Management",
    hours: 1,
    date: new Date().toISOString().split('T')[0],
    description: "",
    evidenceUrl: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userId })
      });
      if (res.ok) {
        onActivityLogged();
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl">Log Your Impact</h2>
        <p className="text-slate-500">Tell us about your sustainability contribution.</p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Category</label>
            <select
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option>Waste Management</option>
              <option>Energy Conservation</option>
              <option>Community Outreach</option>
              <option>Environmental Advocacy</option>
              <option>Biodiversity</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Hours Involved</label>
            <input
              type="number"
              min="0.5"
              step="0.5"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
              value={formData.hours}
              onChange={(e) => setFormData({ ...formData, hours: parseFloat(e.target.value) })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Date of Activity</label>
          <input
            type="date"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Description</label>
          <textarea
            rows={4}
            placeholder="What did you do? What was the impact?"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none resize-none"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Evidence (Optional URL)</label>
          <input
            type="url"
            placeholder="Link to photos, reports, or social posts"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
            value={formData.evidenceUrl}
            onChange={(e) => setFormData({ ...formData, evidenceUrl: e.target.value })}
          />
        </div>

        <div className="pt-4 flex items-center gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary flex-1 py-4 disabled:opacity-50"
          >
            {isSubmitting ? "Logging..." : "Submit for Review"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-8 py-4 border-2 border-slate-100 rounded-xl font-bold hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
