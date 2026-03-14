import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Sparkles, CheckCircle2, ChevronRight, Target, LogIn, Wand2 } from "lucide-react";
import { motion } from "framer-motion";
import tasksAndEventsData from "../data/tasksAndEvents.json";
import {
  runTaskFitAnalysis,
  QuestionnaireInput,
  TaskFitResult,
  TaskForFit,
} from "../lib/aiSupervisor";

type TaskItem = { id: string; type: string; title: string; description: string; category?: string; pointsReward?: number; location?: string; deadline?: string };

export const AISupervisor = ({
  userEmail,
  onPointsAdded,
}: {
  userEmail: string;
  onPointsAdded: () => void;
}) => {
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

  const questions: Array<{ key: keyof QuestionnaireInput; label: string }> = [
    { key: "transport", label: "How sustainable is your weekly transport?" },
    { key: "homeEnergy", label: "How efficient is your home/campus energy use?" },
    { key: "waste", label: "How consistent are your reduce-reuse-recycle habits?" },
    { key: "food", label: "How sustainable are your food choices?" },
    { key: "community", label: "How active are you in community eco actions?" },
  ];

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
    <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
      {/* ── Header ── */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold">AI Advisor</h2>
        <p className="text-slate-500 text-sm sm:text-base mt-2">
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
          <div className="card p-4 flex items-center justify-between gap-4 border border-primary/10">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Selected task</p>
              <p className="font-bold text-lg">{selectedTask.title}</p>
            </div>
            <button type="button" onClick={startOver} className="text-sm font-semibold text-slate-500 hover:text-primary transition-colors">
              Change task
            </button>
          </div>

          {!fitResult ? (
            <div className="card space-y-4 sm:space-y-6">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-primary" />
                <h3 className="text-xl font-bold">Habits & Feelings</h3>
              </div>
              <p className="text-sm text-slate-600">
                Rate your current habits (1–5). Optionally write how you feel about this task—the AI will use both to judge fit.
              </p>
              {questions.map((q) => (
                <div key={q.key} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold text-slate-700">{q.label}</label>
                    <span className="text-xs font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-600">{answers[q.key]} / 5</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={answers[q.key]}
                    onChange={(e) => setAnswers({ ...answers, [q.key]: Number(e.target.value) })}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              ))}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">How do you feel about this task? (optional)</label>
                <textarea
                  placeholder="e.g. I’m keen but not sure I have time; or I’ve done similar things before..."
                  rows={3}
                  value={feelingText}
                  onChange={(e) => setFeelingText(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none resize-none text-sm transition-all"
                />
              </div>
              <button
                onClick={submitForAnalysis}
                disabled={isLoading}
                className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                      <Sparkles size={18} />
                    </motion.div>
                    <span>Analyzing fit...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>Check if I fit</span>
                  </>
                )}
              </button>
              {error && <p className="text-sm text-red-600 font-medium text-center">{error}</p>}
            </div>
          ) : (
            <div className="card space-y-4 sm:space-y-6">
              <div className={`rounded-2xl p-6 border-2 ${fitResult.fitsTask ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-amber-200 bg-amber-50 text-amber-900"}`}>
                <div className="flex items-center gap-2 font-bold text-xl mb-4">
                  <CheckCircle2 size={24} />
                  {fitResult.fitsTask ? "You're a good fit! ✨" : "Build a bit more awareness"}
                </div>
                <div className="flex items-center gap-2 mb-4">
                   <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className={`h-full ${fitResult.fitsTask ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${fitResult.fitScore}%` }} />
                   </div>
                   <span className="text-sm font-bold">{fitResult.fitScore}% Fit</span>
                </div>
                <p className="text-sm leading-relaxed mb-4">{fitResult.summary}</p>
                {fitResult.recommendations.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider opacity-60">Recommendations</p>
                    <ul className="list-disc pl-5 text-sm space-y-1 opacity-90">
                      {fitResult.recommendations.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <p className="text-sm text-slate-500 text-center italic">No points for the check—earn points when you complete the task and log it.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/log"
                  className="flex-1 py-4 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark transition-all hover:scale-[1.02] shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                >
                  <LogIn size={18} />
                  I'll do this task
                </Link>
                <button
                  type="button"
                  onClick={startOver}
                  className="flex-1 py-4 rounded-xl border-2 border-slate-200 font-bold text-slate-700 hover:bg-white hover:border-slate-300 transition-all"
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
