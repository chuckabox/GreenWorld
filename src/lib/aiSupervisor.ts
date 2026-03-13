import { GoogleGenAI } from "@google/genai";

export interface QuestionnaireInput {
  transport: number;
  homeEnergy: number;
  waste: number;
  food: number;
  community: number;
}

export interface QuestionnaireResult {
  score: number;
  tier: "Starter" | "Builder" | "Champion";
  recommendations: string[];
  bonusPoints: number;
  mode: "demo" | "live";
}

/** Task from the list; used for fit analysis */
export interface TaskForFit {
  id: string;
  title: string;
  description: string;
  category?: string;
  pointsReward?: number;
}

/** Result of AI analyzing if the user fits the selected task */
export interface TaskFitResult {
  fitsTask: boolean;
  fitScore: number;
  summary: string;
  recommendations: string[];
  bonusPoints: number;
  mode: "demo" | "live";
}

export interface AwarenessContentResult {
  title: string;
  shortScript: string;
  caption: string;
  hashtags: string[];
  bonusPoints: number;
  mode: "demo" | "live";
}

const parseBoolean = (value: string | undefined, defaultValue = false) => {
  if (value == null) return defaultValue;
  return value.trim().toLowerCase() === "true";
};

const cleanJsonText = (text: string) =>
  text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

const getDemoQuestionnaireResult = (input: QuestionnaireInput): QuestionnaireResult => {
  const avg = (input.transport + input.homeEnergy + input.waste + input.food + input.community) / 5;
  const score = Math.round((avg / 5) * 100);
  const tier = score >= 80 ? "Champion" : score >= 60 ? "Builder" : "Starter";
  const bonusPoints = tier === "Champion" ? 120 : tier === "Builder" ? 80 : 50;

  return {
    score,
    tier,
    bonusPoints,
    recommendations: [
      "Replace 2 short car trips per week with public transport or biking.",
      "Run a 7-day plastic-free challenge and document your progress.",
      "Invite 2 friends to join a local cleanup or campus eco event.",
    ],
    mode: "demo",
  };
};

const getDemoAwarenessContent = (topic: string, audience: string): AwarenessContentResult => ({
  title: `${topic}: 30-Second Green Action Challenge`,
  shortScript:
    `Hook (0-5s): "Small actions, big impact."
Proof (5-15s): show one real action related to ${topic.toLowerCase()}.
Call to Action (15-25s): invite ${audience.toLowerCase()} to copy the action today.
Close (25-30s): "Log it in EcoImpact and earn points."`,
  caption: `Today I took one step for the planet through ${topic.toLowerCase()}. Join me and log your impact in EcoImpact.`,
  hashtags: ["#EcoImpact", "#ClimateAction", "#Sustainability", "#EcoChallenge"],
  bonusPoints: 40,
  mode: "demo",
});

const getDemoTaskFitResult = (task: TaskForFit, input: QuestionnaireInput, _userFeeling?: string): TaskFitResult => {
  const avg = (input.transport + input.homeEnergy + input.waste + input.food + input.community) / 5;
  const fitScore = Math.round((avg / 5) * 100);
  const fitsTask = fitScore >= 55;
  const bonusPoints = task.pointsReward ?? (fitsTask ? 80 : 30);

  return {
    fitsTask,
    fitScore,
    summary: fitsTask
      ? `Your awareness and habits align well with "${task.title}". You're a good fit to take this on.`
      : `You're building awareness. Focus on the recommendations below to get ready for "${task.title}".`,
    recommendations: [
      "Increase sustainable transport (e.g. 1–2 car-free days per week).",
      "Improve waste habits: reduce single-use plastic and recycle consistently.",
      "Join one local or campus eco activity to boost community engagement.",
    ],
    bonusPoints: fitsTask ? bonusPoints : Math.min(40, bonusPoints),
    mode: "demo",
  };
};

/** Analyze if the user's questionnaire answers and optional feeling text show they're a good fit for the selected task. */
export const runTaskFitAnalysis = async (
  task: TaskForFit,
  input: QuestionnaireInput,
  userFeelingText?: string
): Promise<TaskFitResult> => {
  const aiDemoMode = parseBoolean(import.meta.env.VITE_AI_DEMO_MODE, false);
  if (aiDemoMode) return getDemoTaskFitResult(task, input, userFeelingText);

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error("Missing VITE_GEMINI_API_KEY in .env");

  const ai = new GoogleGenAI({ apiKey });

  const feelingBlock = userFeelingText?.trim()
    ? `\nThey also wrote about how they feel about this task: "${userFeelingText.trim()}"\n`
    : "\n";

  const prompt = `You are an AI sustainability supervisor. A user wants to take on this task:
TASK: ${task.title}
DESCRIPTION: ${task.description}

Their self-reported awareness (1–5 scale): transport=${input.transport}, homeEnergy=${input.homeEnergy}, waste=${input.waste}, food=${input.food}, community=${input.community}.${feelingBlock}

Analyze whether this user is a good fit for the task (skills, habits, awareness, motivation). Use both the scores and their written feeling if provided. Return STRICT JSON only, no markdown:
{
  "fitsTask": boolean,
  "fitScore": number,
  "summary": string,
  "recommendations": string[],
  "bonusPoints": number
}
Rules: fitScore 0–100. If they fit, summary should be positive and bonusPoints between 50–120. If they don't fit yet, give 2–3 short recommendations and lower bonusPoints (20–50). Exactly 3 recommendations. No markdown.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const parsed = JSON.parse(cleanJsonText(response.text ?? "{}"));
    const fitsTask = Boolean(parsed.fitsTask);
    const fitScore = Math.max(0, Math.min(100, Number(parsed.fitScore ?? 50)));

    return {
      fitsTask,
      fitScore,
      summary: String(parsed.summary ?? "Analysis complete."),
      recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations.slice(0, 3).map(String) : [],
      bonusPoints: Math.max(0, Math.min(150, Number(parsed.bonusPoints ?? (fitsTask ? 80 : 30)))),
      mode: "live",
    };
  } catch {
    const fallback = parseBoolean(import.meta.env.VITE_AI_FALLBACK_TO_DEMO, false);
    if (fallback) return getDemoTaskFitResult(task, input, userFeelingText);
    throw new Error("AI task fit analysis failed.");
  }
};

export const runAiQuestionnaire = async (input: QuestionnaireInput): Promise<QuestionnaireResult> => {
  const aiDemoMode = parseBoolean(import.meta.env.VITE_AI_DEMO_MODE, false);
  if (aiDemoMode) return getDemoQuestionnaireResult(input);

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error("Missing VITE_GEMINI_API_KEY in .env");

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `You are an AI sustainability supervisor.
Given scores (1-5): transport=${input.transport}, homeEnergy=${input.homeEnergy}, waste=${input.waste}, food=${input.food}, community=${input.community}.
Return STRICT JSON only:
{
  "score": number,
  "tier": "Starter" | "Builder" | "Champion",
  "recommendations": string[],
  "bonusPoints": number
}
Rules: score 0-100, exactly 3 recommendations, realistic and concise, no markdown.`,
    });

    const parsed = JSON.parse(cleanJsonText(response.text ?? "{}"));
    return {
      score: Number(parsed.score ?? 60),
      tier: parsed.tier === "Champion" || parsed.tier === "Builder" || parsed.tier === "Starter" ? parsed.tier : "Builder",
      recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations.slice(0, 3).map(String) : [],
      bonusPoints: Number(parsed.bonusPoints ?? 80),
      mode: "live",
    };
  } catch {
    const fallback = parseBoolean(import.meta.env.VITE_AI_FALLBACK_TO_DEMO, false);
    if (fallback) return getDemoQuestionnaireResult(input);
    throw new Error("AI questionnaire failed.");
  }
};

export const generateAwarenessContent = async (
  topic: string,
  audience: string,
): Promise<AwarenessContentResult> => {
  const aiDemoMode = parseBoolean(import.meta.env.VITE_AI_DEMO_MODE, false);
  if (aiDemoMode) return getDemoAwarenessContent(topic, audience);

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error("Missing VITE_GEMINI_API_KEY in .env");

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Create awareness content for topic: ${topic}. Audience: ${audience}.
Return STRICT JSON only:
{
  "title": string,
  "shortScript": string,
  "caption": string,
  "hashtags": string[],
  "bonusPoints": number
}
Rules: shortScript under 90 words, caption under 35 words, hashtags 3-6 items, no markdown.`,
    });

    const parsed = JSON.parse(cleanJsonText(response.text ?? "{}"));
    return {
      title: String(parsed.title ?? "Eco Action Spotlight"),
      shortScript: String(parsed.shortScript ?? "Show one practical eco action and invite others to participate."),
      caption: String(parsed.caption ?? "Join me in taking one climate-positive action today."),
      hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags.map(String).slice(0, 6) : ["#EcoImpact", "#Sustainability"],
      bonusPoints: Number(parsed.bonusPoints ?? 40),
      mode: "live",
    };
  } catch {
    const fallback = parseBoolean(import.meta.env.VITE_AI_FALLBACK_TO_DEMO, false);
    if (fallback) return getDemoAwarenessContent(topic, audience);
    throw new Error("AI content generation failed.");
  }
};
