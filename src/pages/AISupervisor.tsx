import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Target, CheckCircle2, ChevronRight } from "lucide-react";
import { runTaskFitAnalysis, TaskForFit, TaskFitResult, QuestionnaireInput } from "../lib/aiSupervisor";
import tasksAndEventsData from "../data/tasksAndEvents.json";
import { cn } from "../lib/utils";

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

export const AISupervisor = ({ userEmail, onPointsAdded }: { userEmail: string; onPointsAdded: () => void }) => {
  const tasks = useMemo(
    () => (tasksAndEventsData as (TaskItem & { type: string })[]).filter((t) => t.type === "task") as TaskForFit[],
    [],
  );

  const [selectedTask, setSelectedTask] = useState<TaskForFit | null>(null);
  const [answers, setAnswers] = useState<QuestionnaireInput>(defaultAnswers);
  const [feelingText, setFeelingText] = useState("");
  const [fitResult, setFitResult] = useState<TaskFitResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runFit = async () => {
    if (!selectedTask) return;
    setIsLoading(true);
    setError(null);
    setFitResult(null);
    try {
      const result = await runTaskFitAnalysis(selectedTask, answers, feelingText.trim() || undefined);
      setFitResult(result);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Fit analysis failed.";
      setError(`${message} Check VITE_GEMINI_API_KEY and AI env flags.`);
    } finally {
      setIsLoading(false);
    }
  };

  const pickAnotherTask = () => {
    setSelectedTask(null);
    setFitResult(null);
    setError(null);
    setAnswers(defaultAnswers);
    setFeelingText("");
  };

  const taskToLogState = selectedTask
    ? { taskId: selectedTask.id, taskTitle: selectedTask.title }
    : undefined;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl">AI Advisor</h2>
        <p className="text-slate-500">Pick a task, answer a few questions, and see if it’s a good fit for you.</p>
      </div>

      {!selectedTask ? (
        <div className="card">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Target size={22} className="text-primary" />
            Choose a task
          </h3>
          <ul className="space-y-3">
            {tasks.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => setSelectedTask(t)}
                  className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-primary/40 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="font-bold text-slate-900">{t.title}</p>
                    {t.pointsReward != null && (
                      <span className="text-sm font-semibold text-primary">{t.pointsReward} pts</span>
                    )}
                  </div>
                  <ChevronRight size={20} className="text-slate-400 shrink-0" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : !fitResult ? (
        <div className="card space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-xl font-bold text-slate-900">{selectedTask.title}</h3>
              {selectedTask.pointsReward != null && (
                <span className="text-sm font-semibold text-primary">{selectedTask.pointsReward} pts</span>
              )}
            </div>
            <button
              type="button"
              onClick={pickAnotherTask}
              className="text-sm font-medium text-slate-500 hover:text-slate-700"
            >
              Change task
            </button>
          </div>

          <div className="space-y-5">
            <p className="text-sm font-semibold text-slate-700">Quick questionnaire (1–5)</p>
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
                        "flex-1 min-w-0 py-2.5 rounded-xl text-sm font-bold transition-colors",
                        answers[q.key] === n
                          ? "bg-primary text-white shadow-sm"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-transparent"
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">How do you feel? (optional)</label>
            <textarea
              value={feelingText}
              onChange={(e) => setFeelingText(e.target.value)}
              placeholder="e.g. I’m keen but worried I won’t have time..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 min-h-[80px]"
              rows={3}
            />
          </div>

          <button onClick={runFit} disabled={isLoading} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
            <Sparkles size={18} />
            {isLoading ? "Checking..." : "Check fit"}
          </button>

          {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
        </div>
      ) : (
        <div className="card space-y-6">
          <div className="flex items-center gap-2 text-slate-600">
            <CheckCircle2 size={20} className="text-primary" />
            <span className="font-semibold">Fit result</span>
            <span
              className={`ml-2 px-3 py-1 rounded-full text-sm font-bold ${
                fitResult.fit === "high"
                  ? "bg-emerald-100 text-emerald-800"
                  : fitResult.fit === "medium"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-slate-200 text-slate-700"
              }`}
            >
              {fitResult.fit === "high" ? "High fit" : fitResult.fit === "medium" ? "Medium fit" : "Low fit"}
            </span>
          </div>

          <p className="text-slate-700 leading-relaxed">{fitResult.summary}</p>

          {fitResult.suggestions && fitResult.suggestions.length > 0 && (
            <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600">
              {fitResult.suggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to="/log"
              state={taskToLogState}
              className="btn-primary flex items-center justify-center gap-2 py-3"
            >
              I'll do this task
              <ChevronRight size={18} />
            </Link>
            <button
              type="button"
              onClick={pickAnotherTask}
              className="py-3 px-6 rounded-xl border-2 border-slate-200 font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Check another task
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
