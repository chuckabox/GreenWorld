import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Sparkles, CheckCircle2, ChevronRight, Target, LogIn } from "lucide-react";
import {
  runTaskFitAnalysis,
  QuestionnaireInput,
  TaskFitResult,
  TaskForFit,
} from "../lib/aiSupervisor";
import tasksAndEventsData from "../data/tasksAndEvents.json";

const questions: Array<{ key: keyof QuestionnaireInput; label: string }> = [
  { key: "transport", label: "How sustainable is your weekly transport?" },
  { key: "homeEnergy", label: "How efficient is your home/campus energy use?" },
  { key: "waste", label: "How consistent are your reduce-reuse-recycle habits?" },
  { key: "food", label: "How sustainable are your food choices?" },
  { key: "community", label: "How active are you in community eco actions?" },
];

type TaskItem = { id: string; type: string; title: string; description: string; category?: string; pointsReward?: number; location?: string; deadline?: string };

export const AISupervisor = ({ userEmail, onPointsAdded }: { userEmail: string; onPointsAdded: () => void }) => {
  const tasks = useMemo(() => (tasksAndEventsData as TaskItem[]).filter((t) => t.type === "task"), []);

  const [selectedTask, setSelectedTask] = useState<TaskForFit | null>(null);
  const [answers, setAnswers] = useState<QuestionnaireInput>({
    transport: 3,
    homeEnergy: 3,
    waste: 3,
    food: 3,
    community: 3,
  });
  const [feelingText, setFeelingText] = useState("");
  const [fitResult, setFitResult] = useState<TaskFitResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startOver = () => {
    setSelectedTask(null);
    setFitResult(null);
    setError(null);
    setFeelingText("");
    setAnswers({ transport: 3, homeEnergy: 3, waste: 3, food: 3, community: 3 });
  };

  const submitForAnalysis = async () => {
    if (!selectedTask) return;
    setIsLoading(true);
    setError(null);
    setFitResult(null);
    try {
      const result = await runTaskFitAnalysis(selectedTask, answers, feelingText.trim() || undefined);
      setFitResult(result);
    } catch (e) {
      const message = e instanceof Error ? e.message : "AI analysis failed.";
      setError(`${message} Check your Gemini key or use demo mode.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl">AI Supervisor</h2>
        <p className="text-slate-500">
          Pick a task, rate your habits and share how you feel. The AI will tell you if the task fits you—then you can choose to do it or check another.
        </p>
      </div>

      {!selectedTask ? (
        <div className="card">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Target size={20} className="text-primary" />
            Choose a task
          </h3>
          <div className="grid gap-3">
            {tasks.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedTask({
                  id: t.id,
                  title: t.title,
                  description: t.description,
                  category: t.category,
                  pointsReward: t.pointsReward,
                })}
                className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-primary/40 hover:bg-primary-light/30 transition-all flex items-center justify-between gap-3"
              >
                <div>
                  <p className="font-bold text-slate-900">{t.title}</p>
                  <p className="text-sm text-slate-500 line-clamp-1">{t.description}</p>
                  {t.pointsReward != null && (
                    <span className="inline-block mt-1 text-xs font-semibold text-primary">Complete to earn up to {t.pointsReward} pts</span>
                  )}
                </div>
                <ChevronRight size={20} className="text-slate-400 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="card p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Selected task</p>
              <p className="font-bold text-lg">{selectedTask.title}</p>
            </div>
            <button type="button" onClick={startOver} className="text-sm font-semibold text-slate-500 hover:text-primary">
              Change task
            </button>
          </div>

          {!fitResult ? (
            <div className="card space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-primary" />
                <h3 className="text-xl">Questionnaire & how you feel</h3>
              </div>
              <p className="text-sm text-slate-600">
                Rate your current habits (1–5). Optionally write how you feel about this task—the AI will use both to judge fit.
              </p>
              {questions.map((q) => (
                <div key={q.key} className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">{q.label}</label>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={answers[q.key]}
                    onChange={(e) => setAnswers({ ...answers, [q.key]: Number(e.target.value) })}
                    className="w-full"
                  />
                  <p className="text-xs text-slate-500">Score: {answers[q.key]} / 5</p>
                </div>
              ))}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">How do you feel about this task? (optional)</label>
                <textarea
                  placeholder="e.g. I’m keen but not sure I have time; or I’ve done similar things before..."
                  rows={3}
                  value={feelingText}
                  onChange={(e) => setFeelingText(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none resize-none text-sm"
                />
              </div>
              <button
                onClick={submitForAnalysis}
                disabled={isLoading}
                className="btn-primary w-full py-3 flex items-center justify-center gap-2"
              >
                {isLoading ? "Analyzing fit..." : "Check if I fit"}
              </button>
              {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
            </div>
          ) : (
            <div className="card space-y-4">
              <div className={`rounded-xl p-4 border ${fitResult.fitsTask ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-amber-200 bg-amber-50 text-amber-900"}`}>
                <div className="flex items-center gap-2 font-bold text-lg">
                  <CheckCircle2 size={20} />
                  {fitResult.fitsTask ? "You're a good fit" : "Build a bit more awareness"}
                </div>
                <p className="mt-2 text-sm opacity-90">Fit score: {fitResult.fitScore} / 100</p>
                <p className="mt-2 text-sm">{fitResult.summary}</p>
                {fitResult.recommendations.length > 0 && (
                  <ul className="mt-3 list-disc pl-5 text-sm space-y-1">
                    {fitResult.recommendations.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                )}
              </div>
              <p className="text-sm text-slate-500">No points for the check—earn points when you complete the task and log it.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/log"
                  className="flex-1 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                >
                  <LogIn size={18} />
                  I'll do this task
                </Link>
                <button
                  type="button"
                  onClick={startOver}
                  className="flex-1 py-3 rounded-xl border-2 border-slate-200 font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Check another task
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
