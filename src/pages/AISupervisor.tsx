import React, { useState } from "react";
import { Sparkles, Wand2, CheckCircle2 } from "lucide-react";
import {
  runAiQuestionnaire,
  generateAwarenessContent,
  QuestionnaireInput,
  QuestionnaireResult,
  AwarenessContentResult,
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
  };

  const submitQuestionnaire = async () => {
    setIsLoadingQ(true);
    setErrorQ(null);
    try {
      const result = await runAiQuestionnaire(answers);
      setQuestionnaireResult(result);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "AI questionnaire failed.";
      setErrorQ(`${message} Check your Gemini key and AI env flags.`);
      setQuestionnaireResult(null);
    } finally {
      setIsLoadingQ(false);
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
              >
                {questionnaireAlreadyClaimed
                  ? "Already Claimed"
                  : `Claim +${questionnaireResult.bonusPoints} EcoImpact Points`}
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
              >
                {contentAlreadyClaimed
                  ? "Already Claimed"
                  : `Claim +${contentResult.bonusPoints} EcoImpact Points`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
