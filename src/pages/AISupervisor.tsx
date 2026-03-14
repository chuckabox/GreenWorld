import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Sparkles, CheckCircle2, ChevronRight, Target, LogIn } from "lucide-react";
import {
  runTaskFitAnalysis,
  QuestionnaireInput,
  TaskFitResult,
  TaskForFit,
} from "../lib/aiSupervisor";

const CLAIMS_STORAGE_KEY = "ai_claimed_rewards";

const buildQuestionnaireClaimKey = (
  userEmail: string,
  result: QuestionnaireResult,
) =>
  `q:${userEmail}:${result.mode}:${result.score}:${result.tier}:${result.recommendations.join("|")}`;

const buildContentClaimKey = (
  userEmail: string,
  result: AwarenessContentResult,
) =>
  `c:${userEmail}:${result.mode}:${result.title}:${result.caption}:${result.hashtags.join("|")}`;

const getClaimedRewardKeys = () => {
  const raw = localStorage.getItem(CLAIMS_STORAGE_KEY);
  if (!raw) return [] as string[];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
};

const markClaimedRewardKey = (claimKey: string) => {
  const keys = new Set(getClaimedRewardKeys());
  keys.add(claimKey);
  localStorage.setItem(CLAIMS_STORAGE_KEY, JSON.stringify(Array.from(keys)));
};

const isRewardClaimed = (claimKey: string) =>
  getClaimedRewardKeys().includes(claimKey);
import tasksAndEventsData from "../data/tasksAndEvents.json";

const questions: Array<{ key: keyof QuestionnaireInput; label: string }> = [
  { key: "transport", label: "How sustainable is your weekly transport?" },
  { key: "homeEnergy", label: "How efficient is your home/campus energy use?" },
  {
    key: "waste",
    label: "How consistent are your reduce-reuse-recycle habits?",
  },
  { key: "food", label: "How sustainable are your food choices?" },
  { key: "community", label: "How active are you in community eco actions?" },
];

export const AISupervisor = ({
  userEmail,
  onPointsAdded,
}: {
  userEmail: string;
  onPointsAdded: () => void;
}) => {
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
  const [questionnaireResult, setQuestionnaireResult] =
    useState<QuestionnaireResult | null>(null);
  const [contentResult, setContentResult] =
    useState<AwarenessContentResult | null>(null);
  const [topic, setTopic] = useState("Plastic Reduction");
  const [audience, setAudience] = useState("University students");
  const [isLoadingQ, setIsLoadingQ] = useState(false);
  const [isLoadingC, setIsLoadingC] = useState(false);
  const [errorQ, setErrorQ] = useState<string | null>(null);
  const [errorC, setErrorC] = useState<string | null>(null);

  const awardPoints = (points: number) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const updated = users.map((u: any) => {
      if (u.email !== userEmail) return u;
      const newPoints = (u.impact_points || 0) + points;
      return {
        ...u,
        impact_points: newPoints,
        award_progress: Math.min(100, Math.round(newPoints / 10)),
      };
    });
    localStorage.setItem("users", JSON.stringify(updated));
    onPointsAdded();
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
      const result = await runAiQuestionnaire(answers);
      setQuestionnaireResult(result);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "AI questionnaire failed.";
      setErrorQ(`${message} Check your Gemini key and AI env flags.`);
      setQuestionnaireResult(null);
      const result = await runTaskFitAnalysis(selectedTask, answers, feelingText.trim() || undefined);
      setFitResult(result);
    } catch (e) {
      const message = e instanceof Error ? e.message : "AI analysis failed.";
      setError(`${message} Check your Gemini key or use demo mode.`);
    } finally {
      setIsLoading(false);
    }
  };

  const createContent = async () => {
    setIsLoadingC(true);
    setErrorC(null);
    try {
      const result = await generateAwarenessContent(topic, audience);
      setContentResult(result);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "AI content generation failed.";
      setErrorC(`${message} Check your Gemini key and AI env flags.`);
      setContentResult(null);
    } finally {
      setIsLoadingC(false);
    }
  };

  const questionnaireClaimKey = questionnaireResult
    ? buildQuestionnaireClaimKey(userEmail, questionnaireResult)
    : null;
  const contentClaimKey = contentResult
    ? buildContentClaimKey(userEmail, contentResult)
    : null;

  const questionnaireAlreadyClaimed = questionnaireClaimKey
    ? isRewardClaimed(questionnaireClaimKey)
    : false;
  const contentAlreadyClaimed = contentClaimKey
    ? isRewardClaimed(contentClaimKey)
    : false;

  return (
    <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
      {/* ── Header ── */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold">AI Supervisor</h2>
        <p className="text-slate-500 text-sm sm:text-base mt-0.5">
          Run your sustainability questionnaire and generate awareness content
          for bonus points.
        </p>
      </div>

      {/* ── Two-column grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        {/* ── Questionnaire card ── */}
        <div className="card space-y-4 sm:space-y-5">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-primary shrink-0" />
            <h3 className="text-lg sm:text-xl font-bold">AI Questionnaire</h3>
          </div>

          {questions.map((q) => (
            <div key={q.key} className="space-y-1.5 sm:space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">
                {q.label}
              </label>
              <input
                type="range"
                min={1}
                max={5}
                value={answers[q.key]}
                onChange={(e) =>
                  setAnswers({ ...answers, [q.key]: Number(e.target.value) })
                }
                className="w-full"
              />
              <p className="text-xs text-slate-500">
                Score: {answers[q.key]} / 5
              </p>
            </div>
          ))}

          <button
            onClick={submitQuestionnaire}
            disabled={isLoadingQ}
            className="btn-primary w-full py-3 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoadingQ ? "Analyzing..." : "Analyze with AI"}
          </button>

          {errorQ && (
            <p className="text-sm text-red-600 font-medium break-words">
              {errorQ}
            </p>
          )}

          {questionnaireResult && (
            <div className="rounded-xl border border-slate-200 p-4 bg-slate-50 space-y-2.5">
              <p className="font-bold text-sm sm:text-base">
                Score: {questionnaireResult.score} / 100
              </p>
              <p className="text-sm">
                Tier:{" "}
                <span className="font-semibold">
                  {questionnaireResult.tier}
                </span>
                {" · "}Mode: {questionnaireResult.mode}
              </p>
              <ul className="text-sm list-disc pl-5 text-slate-600 space-y-1">
                {questionnaireResult.recommendations.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
              <button
                onClick={() => {
                  if (!questionnaireClaimKey || questionnaireAlreadyClaimed)
                    return;
                  awardPoints(questionnaireResult.bonusPoints);
                  markClaimedRewardKey(questionnaireClaimKey);
                }}
                disabled={questionnaireAlreadyClaimed}
                className="w-full sm:w-auto mt-1 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
            </div>
          )}
        </div>

        {/* ── Content Creator card ── */}
        <div className="card space-y-4 sm:space-y-5">
          <div className="flex items-center gap-2">
            <Wand2 size={18} className="text-primary shrink-0" />
            <h3 className="text-lg sm:text-xl font-bold">
              Awareness Content Creator
            </h3>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-sm font-semibold text-slate-700 block">
              Topic
            </label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-sm font-semibold text-slate-700 block">
              Target audience
            </label>
            <input
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
            />
          </div>

          <button
            onClick={createContent}
            disabled={isLoadingC}
            className="btn-primary w-full py-3 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoadingC ? "Generating..." : "Generate AI Content"}
          </button>

          {errorC && (
            <p className="text-sm text-red-600 font-medium break-words">
              {errorC}
            </p>
          )}

          {contentResult && (
            <div className="rounded-xl border border-slate-200 p-4 bg-slate-50 space-y-2.5">
              <div className="flex items-center gap-2 text-emerald-700 text-sm font-semibold">
                <CheckCircle2 size={16} className="shrink-0" />
                <span>Generated ({contentResult.mode} mode)</span>
              </div>
              <p className="font-bold text-sm sm:text-base">
                {contentResult.title}
              </p>
              <p className="text-sm whitespace-pre-line text-slate-700 leading-relaxed">
                {contentResult.shortScript}
              </p>
              <p className="text-sm text-slate-700">
                Caption:{" "}
                <span className="text-slate-600">{contentResult.caption}</span>
              </p>
              <p className="text-xs text-slate-500 break-words">
                {contentResult.hashtags.join(" ")}
              </p>
              <button
                onClick={() => {
                  if (!contentClaimKey || contentAlreadyClaimed) return;
                  awardPoints(contentResult.bonusPoints);
                  markClaimedRewardKey(contentClaimKey);
                }}
                disabled={contentAlreadyClaimed}
                className="w-full sm:w-auto mt-1 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
