import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, ChevronRight, ChevronDown, RotateCw } from "lucide-react";
import {
  getTaskRecommendations,
  getTaskRecommendationsFromProfile,
  TaskForFit,
  TaskRecommendation,
  QuestionnaireInput,
  UserActivityProfile,
} from "../lib/aiSupervisor";
import tasksAndEventsData from "../data/tasksAndEvents.json";
import { cn } from "../lib/utils";
import type { Activity } from "../types";
import { LogActivityDialog } from "../components/LogActivityDialog";
import { acquireBodyLock, releaseBodyLock } from "../lib/modalBodyLock";

type TaskItem = { id: string; type: string; title: string; description?: string; pointsReward?: number };

const questions: Array<{ key: keyof QuestionnaireInput; label: string }> = [
  { key: "transport", label: "How sustainable is your weekly transport?" },
  { key: "homeEnergy", label: "How efficient is your home/campus energy use?" },
  { key: "waste", label: "How consistent are your reduce-reuse-recycle habits?" },
  { key: "food", label: "How sustainable are your food choices?" },
  { key: "community", label: "How active are you in community eco actions?" },
];

const defaultAnswers: QuestionnaireInput = {
  transport: 3,
  homeEnergy: 3,
  waste: 3,
  food: 3,
  community: 3,
};

function buildProfile(activities: Activity[]): UserActivityProfile {
  const categories = Array.from(new Set(activities.map((a) => a.category).filter(Boolean)));
  const taskIdsDone = Array.from(
    new Set(activities.map((a) => a.taskId).filter((id): id is string => Boolean(id))),
  );
  return { totalCount: activities.length, categories, taskIdsDone };
}

type Props = { user: { id: number }; activities: Activity[]; onPointsAdded: () => void };

export const AISupervisor = ({ user, activities, onPointsAdded }: Props) => {
  const navigate = useNavigate();
  const tasks = useMemo(
    () => (tasksAndEventsData as (TaskItem & { type: string })[]).filter((t) => t.type === "task") as TaskForFit[],
    [],
  );
  const profile = useMemo(() => buildProfile(activities), [activities]);

  const [recommendations, setRecommendations] = useState<TaskRecommendation[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [refineOpen, setRefineOpen] = useState(false);
  const [answers, setAnswers] = useState<QuestionnaireInput>(defaultAnswers);
  const [feelingText, setFeelingText] = useState("");
  const [refineLoading, setRefineLoading] = useState(false);
  const [isLogDialogOpen, setIsLogDialogOpen] = useState(false);
  const [selectedTaskForLog, setSelectedTaskForLog] = useState<{ taskId: string; taskTitle: string } | null>(null);
  const refineScrollRef = useRef<HTMLDivElement | null>(null);
  const [refineDragStartY, setRefineDragStartY] = useState<number | null>(null);
  const [refineDragTranslateY, setRefineDragTranslateY] = useState(0);

  useEffect(() => {
    if (!refineOpen) return;
    acquireBodyLock();
    return () => {
      releaseBodyLock();
    };
  }, [refineOpen]);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    setRecommendations(null);
    setIsLoading(true);

    // Initial load doesn't need fake delay, but let's add it for consistency if requested
    getTaskRecommendationsFromProfile(tasks, profile)
      .then((list) => {
        if (!cancelled) setRecommendations(list);
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Recommendations failed.");
          setRecommendations([]);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [tasks, profile.totalCount, profile.categories.join(","), profile.taskIdsDone.join(",")]);

  const refreshWithAnimation = (action: () => Promise<any>) => {
    setIsLoading(true);
    setRecommendations(null);
    setTimeout(async () => {
      try {
        await action();
      } finally {
        setIsLoading(false);
      }
    }, 1500); // Pretend refresh animation delay
  };

  const refreshFromProfile = () => {
    refreshWithAnimation(async () => {
      try {
        const list = await getTaskRecommendationsFromProfile(tasks, profile);
        setRecommendations(list);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Recommendations failed.");
        setRecommendations([]);
      }
    });
  };

  const acceptTask = (rec: TaskRecommendation) => {
    const existing = JSON.parse(localStorage.getItem("acceptedTasks") || "[]");
    if (!existing.find((t: any) => t.taskId === rec.taskId)) {
      localStorage.setItem("acceptedTasks", JSON.stringify([...existing, rec]));
    }
    navigate("/dashboard");
  };

  const fetchFromQuiz = async () => {
    setRefineLoading(true);
    setError(null);
    try {
      const list = await getTaskRecommendations(tasks, answers, feelingText.trim() || undefined);
      setRecommendations(list);
      setRefineOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Recommendations failed.");
    } finally {
      setRefineLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
      {/* ── Header ── */}
      <div>
        <h2 className="text-3xl">AI Advisor</h2>
        <p className="text-slate-500">
          {profile.totalCount > 0
            ? "Recommendations based on your impact history. Personalise your AI with a quiz."
            : "Here are some good first tasks. You can personalise your AI with a quiz."}
        </p>
      </div>

      <div className="card space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h3 className="text-xl font-bold text-slate-900">Recommended for you</h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={refreshFromProfile}
              disabled={isLoading}
              className="p-2 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-xl transition-all disabled:opacity-50"
              title="Refresh recommendations"
            >
              <RotateCw size={18} className={cn(isLoading && "animate-spin")} />
            </button>
            <button
              type="button"
              onClick={() => setRefineOpen(true)}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              <Sparkles size={16} className="text-primary" />
              Take quiz
            </button>
          </div>
        </div>

        {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

        <div className="transition-all duration-300">
          {isLoading ? (
            <ul className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <li
                  key={i}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 animate-pulse">
                    <div className="flex-1 min-w-0">
                      <div className="h-5 bg-slate-200 rounded w-1/3 mb-1"></div>
                      <div className="h-4 bg-slate-200 rounded w-full mt-1 mb-1"></div>
                      <div className="h-4 bg-slate-200 rounded w-2/3 mb-2"></div>
                      <div className="h-6 bg-slate-200 rounded-full w-20 mt-2"></div>
                    </div>
                    <div className="shrink-0 mt-3 sm:mt-0">
                      <div className="h-10 bg-slate-200 rounded-xl w-full sm:w-28"></div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : recommendations !== null && recommendations.length === 0 ? (
            <p className="text-slate-500">No recommendations right now. Try refining with the quiz.</p>
          ) : recommendations !== null ? (
            <ul className="space-y-4">
              {recommendations.map((rec) => (
                <li
                  key={rec.taskId}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-primary/30 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900">{rec.taskTitle}</p>
                      <p className="text-sm text-slate-600 mt-1">{rec.reason}</p>
                      <span
                        className={cn(
                          "inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-bold",
                          rec.fit === "high"
                            ? "bg-primary-light text-primary"
                            : rec.fit === "medium"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-slate-200 text-slate-700"
                        )}
                      >
                        {rec.fit === "high" ? "High fit" : rec.fit === "medium" ? "Medium fit" : "Low fit"}
                      </span>
                    </div>
                    <div className="flex shrink-0">
                      <button
                        type="button"
                        onClick={() => acceptTask(rec)}
                        className="btn-primary py-2.5 px-6"
                      >
                        I'll do it
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="h-40" />
          )}
        </div>
      </div>

      {/* Quiz dialog (full-page overlay via portal) */}
      {refineOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-40 flex items-end md:items-center justify-center bg-slate-950/40 px-2 pb-4 sm:px-4 sm:pb-8 md:pb-0 overflow-hidden"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setRefineOpen(false);
            }}
          >
            <div
              className="relative w-full max-w-lg sm:max-w-xl md:max-w-xl shrink-0"
              onMouseDown={(event) => event.stopPropagation()}
              onTouchStart={(event) => {
                const scrollTop = refineScrollRef.current?.scrollTop ?? 0;
                if (scrollTop > 0) {
                  setRefineDragStartY(null);
                  setRefineDragTranslateY(0);
                  return;
                }
                setRefineDragStartY(event.touches[0].clientY);
              }}
              onTouchMove={(event) => {
                if (refineDragStartY == null) return;
                const scrollTop = refineScrollRef.current?.scrollTop ?? 0;
                if (scrollTop > 0) {
                  return;
                }
                const delta = event.touches[0].clientY - refineDragStartY;
                if (delta > 0) {
                  setRefineDragTranslateY(delta);
                }
              }}
              onTouchEnd={() => {
                if (refineDragTranslateY > 80) {
                  setRefineOpen(false);
                } else {
                  setRefineDragTranslateY(0);
                }
                setRefineDragStartY(null);
              }}
              style={{
                transform: refineDragTranslateY ? `translateY(${refineDragTranslateY}px)` : undefined,
                transition: refineDragTranslateY ? "none" : "transform 0.2s ease-out",
              }}
            >
              <div
                ref={refineScrollRef}
                className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-h-[90vh] overflow-y-auto modal-scroll p-5 space-y-4 shadow-xl"
              >
                <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-slate-200 sm:hidden" />
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold">Personalise your AI</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Answer a few quick questions and we’ll fine-tune your recommendations.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRefineOpen(false)}
                    className="p-1 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-700"
                    aria-label="Close quiz"
                  >
                    <ChevronDown size={16} className="rotate-180" />
                  </button>
                </div>

                <div className="space-y-3 overflow-hidden">
                  {questions.map((q) => (
                    <div key={q.key} className="space-y-1">
                      <label className="text-xs text-slate-600 block">{q.label}</label>
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setAnswers({ ...answers, [q.key]: n })}
                            className={cn(
                              "flex-1 min-w-0 py-1.5 rounded-lg text-sm font-bold transition-colors",
                              answers[q.key] === n
                                ? "bg-primary text-white shadow-sm"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                            )}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="space-y-1">
                    <label className="text-xs text-slate-600">How do you feel? (optional)</label>
                    <input
                      type="text"
                      value={feelingText}
                      onChange={(e) => setFeelingText(e.target.value)}
                      placeholder="e.g. I want to focus on waste this week..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-1">
                  <p className="text-[10px] text-slate-400 text-center">
                    By submitting, you consent to generating a response using the data you input.
                  </p>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setRefineOpen(false)}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={fetchFromQuiz}
                      disabled={refineLoading}
                      className="btn-primary py-2.5 px-5 flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Sparkles size={16} />
                      {refineLoading ? "Updating..." : "Get recommendations from quiz"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {isLogDialogOpen && selectedTaskForLog && (
        <LogActivityDialog
          userId={user.id}
          initialTaskId={selectedTaskForLog.taskId}
          initialTaskTitle={selectedTaskForLog.taskTitle}
          onActivityLogged={() => {
            onPointsAdded();
            setIsLogDialogOpen(false);
          }}
          onClose={() => setIsLogDialogOpen(false)}
        />
      )}
    </div>
  );
};
