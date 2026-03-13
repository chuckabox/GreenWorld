import React, { useState } from "react";
import { Sparkles, Wand2, CheckCircle2 } from "lucide-react";
import {
  runAiQuestionnaire,
  generateAwarenessContent,
  QuestionnaireInput,
  QuestionnaireResult,
  AwarenessContentResult,
} from "../lib/aiSupervisor";

const questions: Array<{ key: keyof QuestionnaireInput; label: string }> = [
  { key: "transport", label: "How sustainable is your weekly transport?" },
  { key: "homeEnergy", label: "How efficient is your home/campus energy use?" },
  { key: "waste", label: "How consistent are your reduce-reuse-recycle habits?" },
  { key: "food", label: "How sustainable are your food choices?" },
  { key: "community", label: "How active are you in community eco actions?" },
];

export const AISupervisor = ({ userEmail, onPointsAdded }: { userEmail: string; onPointsAdded: () => void }) => {
  const [answers, setAnswers] = useState<QuestionnaireInput>({
    transport: 3,
    homeEnergy: 3,
    waste: 3,
    food: 3,
    community: 3,
  });
  const [questionnaireResult, setQuestionnaireResult] = useState<QuestionnaireResult | null>(null);
  const [contentResult, setContentResult] = useState<AwarenessContentResult | null>(null);
  const [topic, setTopic] = useState("Plastic Reduction");
  const [audience, setAudience] = useState("University students");
  const [isLoadingQ, setIsLoadingQ] = useState(false);
  const [isLoadingC, setIsLoadingC] = useState(false);

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
    try {
      const result = await runAiQuestionnaire(answers);
      setQuestionnaireResult(result);
    } finally {
      setIsLoadingQ(false);
    }
  };

  const createContent = async () => {
    setIsLoadingC(true);
    try {
      const result = await generateAwarenessContent(topic, audience);
      setContentResult(result);
    } finally {
      setIsLoadingC(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl">AI Supervisor</h2>
        <p className="text-slate-500">Run your sustainability questionnaire and generate awareness content for bonus points.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-primary" />
            <h3 className="text-xl">AI Questionnaire</h3>
          </div>

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

          <button onClick={submitQuestionnaire} disabled={isLoadingQ} className="btn-primary w-full py-3">
            {isLoadingQ ? "Analyzing..." : "Analyze with AI"}
          </button>

          {questionnaireResult && (
            <div className="rounded-xl border border-slate-200 p-4 bg-slate-50 space-y-2">
              <p className="font-bold">Score: {questionnaireResult.score} / 100</p>
              <p className="text-sm">Tier: <span className="font-semibold">{questionnaireResult.tier}</span> · Mode: {questionnaireResult.mode}</p>
              <ul className="text-sm list-disc pl-5 text-slate-600 space-y-1">
                {questionnaireResult.recommendations.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
              <button
                onClick={() => awardPoints(questionnaireResult.bonusPoints)}
                className="mt-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold"
              >
                Claim +{questionnaireResult.bonusPoints} GreenPass Points
              </button>
            </div>
          )}
        </div>

        <div className="card space-y-4">
          <div className="flex items-center gap-2">
            <Wand2 size={18} className="text-primary" />
            <h3 className="text-xl">Awareness Content Creator</h3>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Topic</label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Target audience</label>
            <input
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
            />
          </div>

          <button onClick={createContent} disabled={isLoadingC} className="btn-primary w-full py-3">
            {isLoadingC ? "Generating..." : "Generate AI Content"}
          </button>

          {contentResult && (
            <div className="rounded-xl border border-slate-200 p-4 bg-slate-50 space-y-2">
              <div className="flex items-center gap-2 text-emerald-700 text-sm font-semibold">
                <CheckCircle2 size={16} />
                Generated ({contentResult.mode} mode)
              </div>
              <p className="font-bold">{contentResult.title}</p>
              <p className="text-sm whitespace-pre-line text-slate-700">{contentResult.shortScript}</p>
              <p className="text-sm text-slate-700">Caption: {contentResult.caption}</p>
              <p className="text-xs text-slate-500">{contentResult.hashtags.join(" ")}</p>
              <button
                onClick={() => awardPoints(contentResult.bonusPoints)}
                className="mt-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold"
              >
                Claim +{contentResult.bonusPoints} GreenPass Points
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
