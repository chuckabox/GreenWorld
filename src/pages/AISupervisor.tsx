import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, ChevronRight, ChevronDown } from "lucide-react";
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

  useEffect(() => {
    let cancelled = false;
    setError(null);
    setRecommendations(null);
    setIsLoading(true);
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

  const refreshFromProfile = () => {
    setError(null);
    setIsLoading(true);
    getTaskRecommendationsFromProfile(tasks, profile)
      .then(setRecommendations)
      .catch((e) => {
        setError(e instanceof Error ? e.message : "Recommendations failed.");
        setRecommendations([]);
      })
      .finally(() => setIsLoading(false));
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

      {isLoading ? (
        <div className="card py-12 flex items-center justify-center gap-3 text-slate-500">
          <Sparkles size={24} className="animate-pulse text-primary" />
          <span>Finding recommendations...</span>
        </div>
      ) : (
        <div className="card space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-xl font-bold text-slate-900">Recommended for you</h3>
            <button
              type="button"
              onClick={refreshFromProfile}
              disabled={isLoading}
              className="text-sm font-medium text-primary hover:underline"
            >
              Refresh
            </button>
          </div>

          {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

          {recommendations !== null && recommendations.length === 0 ? (
            <p className="text-slate-500">No recommendations right now. Try refining with the quiz below.</p>
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
                    <button
                      type="button"
                      onClick={() =>
                        navigate("/dashboard", {
                          state: { taskId: rec.taskId, taskTitle: rec.taskTitle },
                        })
                      }
                      className="btn-primary shrink-0 flex items-center justify-center gap-2 py-2.5 px-4"
                    >
                      I'll do this task
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : null}

          <div className="pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setRefineOpen(true)}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              <ChevronDown size={16} className="transition-transform" />
              Take quiz
            </button>
          </div>
        </div>
      )}

      {/* Quiz dialog */}
      {refineOpen && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/40 px-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setRefineOpen(false);
          }}
        >
          <div
            className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-xl"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold">Personalise your AI</h3>
                <p className="text-sm text-slate-500">
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

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {questions.map((q) => (
                <div key={q.key} className="space-y-2">
                  <label className="text-sm text-slate-600 block">{q.label}</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setAnswers({ ...answers, [q.key]: n })}
                        className={cn(
                          "flex-1 min-w-0 py-2 rounded-xl text-sm font-bold transition-colors",
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
              <div className="space-y-2">
                <label className="text-sm text-slate-600">How do you feel? (optional)</label>
                <textarea
                  value={feelingText}
                  onChange={(e) => setFeelingText(e.target.value)}
                  placeholder="e.g. I want to focus on waste this week..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 min-h-[72px]"
                  rows={2}
                />
              </div>
            </div>

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
      )}
    </div>
  );
};
