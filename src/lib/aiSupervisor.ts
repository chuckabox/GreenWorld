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
Close (25-30s): "Log it in GreenPass and earn points."`,
  caption: `Today I took one step for the planet through ${topic.toLowerCase()}. Join me and log your impact in GreenPass.`,
  hashtags: ["#GreenPass", "#ClimateAction", "#Sustainability", "#EcoChallenge"],
  bonusPoints: 40,
  mode: "demo",
});

export const runAiQuestionnaire = async (input: QuestionnaireInput): Promise<QuestionnaireResult> => {
  const aiDemoMode = parseBoolean(import.meta.env.VITE_AI_DEMO_MODE, true);
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
    const fallback = parseBoolean(import.meta.env.VITE_AI_FALLBACK_TO_DEMO, true);
    if (fallback) return getDemoQuestionnaireResult(input);
    throw new Error("AI questionnaire failed.");
  }
};

export const generateAwarenessContent = async (
  topic: string,
  audience: string,
): Promise<AwarenessContentResult> => {
  const aiDemoMode = parseBoolean(import.meta.env.VITE_AI_DEMO_MODE, true);
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
      hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags.map(String).slice(0, 6) : ["#GreenPass", "#Sustainability"],
      bonusPoints: Number(parsed.bonusPoints ?? 40),
      mode: "live",
    };
  } catch {
    const fallback = parseBoolean(import.meta.env.VITE_AI_FALLBACK_TO_DEMO, true);
    if (fallback) return getDemoAwarenessContent(topic, audience);
    throw new Error("AI content generation failed.");
  }
};
