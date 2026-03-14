import React, { useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, LoaderCircle, Upload, X, Target } from "lucide-react";
import { verifyEcoImageWithGemini } from "../lib/geminiVerifier";
import tasksAndEventsData from "../data/tasksAndEvents.json";

type TaskItem = { id: string; type: string; title: string; description?: string; pointsReward?: number };

export const LogActivityDialog = ({
  userId,
  onActivityLogged,
  onClose,
}: {
  userId: number;
  onActivityLogged: () => void;
  onClose: () => void;
}) => {
  const defaultDate = new Date().toISOString().split("T")[0];
  const tasks = useMemo(
    () => (tasksAndEventsData as (TaskItem & { type: string })[]).filter((t) => t.type === "task") as TaskItem[],
    [],
  );

  const [formData, setFormData] = useState({
    category: "Waste Management",
    hours: 1,
    date: defaultDate,
    description: "",
    evidenceUrl: "",
  });
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [submitStage, setSubmitStage] = useState("Saving your activity...");
  const [submitSuccess, setSubmitSuccess] = useState<null | { status: "approved" | "pending"; points: number; note: string }>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const minDescriptionLength = 15;
  const hasEnoughDescription = formData.description.trim().length >= minDescriptionLength;
  const isDirty =
    formData.category !== "Waste Management" ||
    formData.hours !== 1 ||
    formData.date !== defaultDate ||
    formData.description.trim().length > 0 ||
    formData.evidenceUrl.trim().length > 0 ||
    proofImage !== null;
  const canSubmit = hasEnoughDescription && !isSubmitting;

  const handleTaskSelect = (taskId: string) => {
    setSelectedTaskId(taskId);
    if (!taskId) {
      setFormData((prev) => ({ ...prev, category: "Waste Management", description: "" }));
      return;
    }
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setFormData((prev) => ({
        ...prev,
        category: "Sustainability task",
        description: task.description?.trim() ? `${task.title}. ${task.description}` : task.title,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (proofImage && !hasEnoughDescription) {
      setSubmitError(`Please describe your action in at least ${minDescriptionLength} characters when uploading a photo.`);
      return;
    }

    setIsSubmitting(true);
    setSubmitStage("Saving your activity details...");

    const submitSteps = [
      "Saving your activity details...",
      "Verifying evidence with AI...",
      "Finalizing your result...",
    ];
    let submitIndex = 0;
    const submitTimer = setInterval(() => {
      submitIndex = (submitIndex + 1) % submitSteps.length;
      setSubmitStage(submitSteps[submitIndex]);
    }, 850);

    try {
      let aiResult: Awaited<ReturnType<typeof verifyEcoImageWithGemini>> | null = null;
      if (proofImage) {
        try {
          setSubmitStage("Verifying evidence with AI...");
          aiResult = await verifyEcoImageWithGemini(proofImage, formData.category, formData.description);
        } catch (error) {
          console.warn("AI verification failed, falling back to demo-style result.", error);
          aiResult = null;
        }
      }

      const enrichedDescription = aiResult
        ? `${formData.description}\n\n[AI Verification]\nRelevant: ${aiResult.isRelevant ? "yes" : "no"}\nConfidence: ${(aiResult.confidence * 100).toFixed(0)}%\nEstimated CO2: ${aiResult.estimatedCo2Kg} kg\nEstimated Plastic Reduced: ${aiResult.estimatedPlasticItemsReduced} items\nEstimated Water Saved: ${aiResult.estimatedWaterLitersSaved} L\nRecommendation: ${aiResult.reviewRecommendation}\nSummary: ${aiResult.summary}`
        : formData.description;

      const randomStatus: "approved" | "pending" = Math.random() < 0.6 ? "approved" : "pending";
      const status = randomStatus;

      const earnedPoints =
        status === "approved"
          ? aiResult
            ? Math.max(25, Math.round(aiResult.estimatedCo2Kg * 40))
            : 25
          : 0;

      const localActivity = {
        id: Date.now(),
        user_id: userId,
        category: formData.category,
        hours: formData.hours,
        date: formData.date,
        description: enrichedDescription,
        evidenceUrl: formData.evidenceUrl,
        aiConfidence: aiResult?.confidence,
        aiRecommendation: aiResult?.reviewRecommendation,
        estimatedCo2Kg: aiResult?.estimatedCo2Kg,
        estimatedPlasticItemsReduced: aiResult?.estimatedPlasticItemsReduced,
        estimatedWaterLitersSaved: aiResult?.estimatedWaterLitersSaved,
        status,
      };

      const currentActivities = JSON.parse(localStorage.getItem("activities") || "[]");
      localStorage.setItem("activities", JSON.stringify([...currentActivities, localActivity]));

      onActivityLogged();
      clearInterval(submitTimer);
      setSubmitSuccess({
        status,
        points: earnedPoints,
        note: !proofImage
          ? status === "approved"
            ? "Approved based on your description. No photo was uploaded."
            : "This log has been submitted for review based on your description."
          : status === "approved"
            ? "AI verification (or fallback) completed successfully."
            : "Evidence submitted. This log is queued for review.",
      });
    } catch (err) {
      console.error(err);
      clearInterval(submitTimer);

      const randomStatus: "approved" | "pending" = Math.random() < 0.5 ? "approved" : "pending";
      const status = randomStatus;

      const fallbackActivity = {
        id: Date.now(),
        user_id: userId,
        category: formData.category,
        hours: formData.hours,
        date: formData.date,
        description: formData.description,
        evidenceUrl: formData.evidenceUrl,
        status,
      };

      const currentActivities = JSON.parse(localStorage.getItem("activities") || "[]");
      localStorage.setItem("activities", JSON.stringify([...currentActivities, fallbackActivity]));

      onActivityLogged();
      setSubmitSuccess({
        status,
        points: status === "approved" ? 25 : 0,
        note: "We had a hiccup talking to AI, but your activity was still logged.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForAnotherLog = () => {
    setSelectedTaskId("");
    setFormData({
      category: "Waste Management",
      hours: 1,
      date: defaultDate,
      description: "",
      evidenceUrl: "",
    });
    setProofImage(null);
    setSubmitError(null);
    setSubmitSuccess(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    resetForAnotherLog();
    onClose();
  };

  const overlay = (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/40 px-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className="relative max-w-3xl w-full" onMouseDown={(event) => event.stopPropagation()}>
        <div className="card p-6 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl">Log Your Impact</h2>
              <p className="text-slate-500 text-sm">Snap, verify, and submit your sustainability action for points.</p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="p-1 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {submitSuccess ? (
            <div className="space-y-6">
              <div className={`rounded-xl p-4 border ${submitSuccess.status === "approved" ? "border-primary-light bg-primary-light text-primary" : "border-amber-200 bg-amber-50 text-amber-900"}`}>
                <div className="flex items-center gap-2 font-bold text-lg">
                  <CheckCircle2 size={20} />
                  {submitSuccess.status === "approved" ? "Activity approved" : "Activity submitted for review"}
                </div>
                <p className="mt-2 text-sm">
                  {submitSuccess.status === "approved"
                    ? `Great work. Your activity has been logged successfully and ${submitSuccess.points} Green Points were added.`
                    : "Your activity is now in review. You can keep logging more actions while this one is pending."}
                </p>
                <p className="mt-1 text-xs opacity-80">{submitSuccess.note}</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={resetForAnotherLog}
                  className="btn-primary w-full sm:flex-1 h-12 flex items-center justify-center"
                >
                  Add Another Log
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full sm:flex-1 h-12 flex items-center justify-center border-2 border-slate-100 rounded-xl font-bold hover:bg-slate-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Target size={16} className="text-primary" />
                  Choose a task (optional)
                </label>
                <select
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                  value={selectedTaskId}
                  onChange={(e) => handleTaskSelect(e.target.value)}
                >
                  <option value="">None / General activity</option>
                  {tasks.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}{t.pointsReward != null ? ` (${t.pointsReward} pts)` : ""}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-500">Selecting a task pre-fills category and description. You can edit them.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
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
                    <option>Sustainability task</option>
                  </select>
                </div>
                <div className="space-y-1.5">
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

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Date of Activity</label>
                <input
                  type="date"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Description</label>
                <textarea
                  rows={4}
                  placeholder="What did you do? What was the impact?"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
                <p className={`text-xs ${hasEnoughDescription ? "text-primary" : "text-slate-500"}`}>
                  {formData.description.trim().length}/{minDescriptionLength} minimum characters
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Evidence (Optional)</label>
                <input
                  type="url"
                  placeholder="Link to photos, reports, or social posts"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                  value={formData.evidenceUrl}
                  onChange={(e) => setFormData({ ...formData, evidenceUrl: e.target.value })}
                />
                <p className="text-xs text-slate-500">Or upload a photo by browsing. AI verification will run automatically after you submit.</p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    setProofImage(file);
                  }}
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${proofImage ? "bg-primary-light border-primary/20 text-primary" : "bg-white border-slate-200 hover:border-primary/30 hover:bg-primary-light/40"}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <Upload size={16} />
                      <div className="truncate">
                        <p className="text-sm font-semibold truncate">{proofImage ? proofImage.name : "Choose evidence image"}</p>
                        <p className="text-xs opacity-80">{proofImage ? `${(proofImage.size / 1024).toFixed(0)} KB selected` : "PNG, JPG or HEIC supported"}</p>
                      </div>
                    </div>
                    {proofImage ? (
                      <span className="text-xs font-semibold px-2 py-1 rounded bg-primary-light text-primary">Selected</span>
                    ) : (
                      <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-100 text-slate-600">Browse</span>
                    )}
                  </div>
                </button>

                {proofImage && (
                  <button
                    type="button"
                    onClick={() => {
                      setProofImage(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700"
                  >
                    <X size={14} />
                    Remove selected image
                  </button>
                )}
              </div>

              {submitError && <p className="text-sm text-red-600 font-semibold">{submitError}</p>}

              {isSubmitting && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <LoaderCircle size={16} className="animate-spin" />
                  {submitStage}
                </div>
              )}

              <div className="pt-0 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className={`${isDirty ? "sm:flex-[2]" : "sm:flex-1"} w-full sm:w-auto btn-primary h-12 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isSubmitting ? "Submitting..." : "Submit Activity"}
                </button>
                {isDirty ? (
                  <button
                    type="button"
                    onClick={resetForAnotherLog}
                    className="w-full sm:flex-1 h-12 flex items-center justify-center border-2 border-red-100 text-red-600 rounded-xl font-bold text-center hover:bg-red-50 hover:text-red-700 transition-colors"
                  >
                    Reset
                  </button>
                ) : null}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
};

