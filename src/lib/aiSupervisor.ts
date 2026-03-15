import { GoogleGenAI } from "@google/genai";
import { GEMINI_API_KEY, USE_GEMINI_LIVE } from "./geminiConfig";

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

/** Task item used for fit analysis (from tasksAndEvents where type === "task"). */
export interface TaskForFit {
  id: string;
  title: string;
  description?: string;
  pointsReward?: number;
}

/** Result of AI task–fit analysis. */
export interface TaskFitResult {
  fit: "high" | "medium" | "low";
  summary: string;
  suggestions?: string[];
  mode: "demo" | "live";
}

/** One recommended task from getTaskRecommendations. */
export interface TaskRecommendation {
  taskId: string;
  taskTitle: string;
  fit: "high" | "medium" | "low";
  reason: string;
  mode?: "demo" | "live";
}

/** Summary of user's activity history for context-aware recommendations. */
export interface UserActivityProfile {
  totalCount: number;
  categories: string[];
  taskIdsDone: string[];
}

const RANDOM_REASONS = [
  "Perfectly aligned with your recent eco-actions.",
  "A highly impactful step for your community.",
  "Matches your interest in sustainable living.",
  "Great way to build a consistent green habit.",
  "A simple but effective contribution today.",
  "Recommended based on your lifestyle profile.",
  "Helps you reach your next badge milestone faster.",
  "A popular choice among eco-conscious users.",
  "Tailored to your current sustainability level.",
  "A rewarding task with a high impact score.",
  "Directly supports local green initiatives.",
  "Fits easily into your daily routine.",
];

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
Close (25-30s): "Log it in GreenWorld and earn points."`,
  caption: `Today I took one step for the planet through ${topic.toLowerCase()}. Join me and log your impact in GreenWorld.`,
  hashtags: ["#GreenWorld", "#ClimateAction", "#Sustainability", "#EcoChallenge"],
  bonusPoints: 40,
  mode: "demo",
});

export const runAiQuestionnaire = async (input: QuestionnaireInput): Promise<QuestionnaireResult> => {
  if (!USE_GEMINI_LIVE) return getDemoQuestionnaireResult(input);

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

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
    return getDemoQuestionnaireResult(input);
  }
};

export const generateAwarenessContent = async (
  topic: string,
  audience: string,
): Promise<AwarenessContentResult> => {
  if (!USE_GEMINI_LIVE) return getDemoAwarenessContent(topic, audience);

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

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
      hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags.map(String).slice(0, 6) : ["#GreenWorld", "#Sustainability"],
      bonusPoints: Number(parsed.bonusPoints ?? 40),
      mode: "live",
    };
  } catch {
    return getDemoAwarenessContent(topic, audience);
  }
};

const getDemoTaskFitResult = (
  _task: TaskForFit,
  input: QuestionnaireInput,
  feelingText?: string,
): TaskFitResult => {
  const avg = (input.transport + input.homeEnergy + input.waste + input.food + input.community) / 5;
  const hasFeeling = (feelingText ?? "").trim().length > 5;
  const fit = avg >= 4 && hasFeeling ? "high" : avg >= 3 ? "medium" : "low";
  const summary =
    fit === "high"
      ? "Your current habits and motivation align well with this task. You're likely to complete it and build lasting habits."
      : fit === "medium"
        ? "This task is a good stretch. A few small adjustments could make it easier to stick to."
        : "This task may feel challenging right now. Consider starting with a smaller step or building related habits first.";
  return {
    fit,
    summary,
    suggestions: [
      "Start with one concrete action this week.",
      "Log your progress in the app to stay accountable.",
    ],
    mode: "demo",
  };
};

export const runTaskFitAnalysis = async (
  task: TaskForFit,
  answers: QuestionnaireInput,
  feelingText?: string,
): Promise<TaskFitResult> => {
  if (!USE_GEMINI_LIVE) return getDemoTaskFitResult(task, answers, feelingText);

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  const feeling = (feelingText ?? "").trim() ? `User's feeling about the task: "${feelingText.trim()}"` : "No extra comment.";
  const prompt = `You are an AI sustainability supervisor. Assess how well this user fits the given task.

Task: ${task.title}
${task.description ? `Description: ${task.description}` : ""}

User questionnaire (1–5 scale): transport=${answers.transport}, homeEnergy=${answers.homeEnergy}, waste=${answers.waste}, food=${answers.food}, community=${answers.community}.
${feeling}

Return STRICT JSON only:
{
  "fit": "high" | "medium" | "low",
  "summary": "2–3 sentences explaining fit and why.",
  "suggestions": ["one short tip", "another short tip"]
}
Rules: fit = high if they're well aligned, medium if doable with small changes, low if likely to struggle. No markdown.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    const parsed = JSON.parse(cleanJsonText(response.text ?? "{}"));
    const fit = parsed.fit === "high" || parsed.fit === "medium" || parsed.fit === "low" ? parsed.fit : "medium";
    return {
      fit,
      summary: String(parsed.summary ?? "We've assessed your fit for this task."),
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions.slice(0, 4).map(String) : [],
      mode: "live",
    };
  } catch {
    return getDemoTaskFitResult(task, answers, feelingText);
  }
};

const getDemoTaskRecommendations = (
  tasks: TaskForFit[],
  input: QuestionnaireInput,
  _feelingText?: string,
): TaskRecommendation[] => {
  const avg = (input.transport + input.homeEnergy + input.waste + input.food + input.community) / 5;
  return tasks.slice(0, 5).map((t, i) => {
    const rank = (5 - i) / 5;
    const fit: "high" | "medium" | "low" =
      avg >= 4 && rank > 0.5 ? "high" : avg >= 3 || rank > 0.3 ? "medium" : "low";
    const reason = RANDOM_REASONS[(i + t.title.length) % RANDOM_REASONS.length];
    return { taskId: t.id, taskTitle: t.title, fit, reason, mode: "demo" as const };
  });
};

export const getTaskRecommendations = async (
  tasks: TaskForFit[],
  answers: QuestionnaireInput,
  feelingText?: string,
): Promise<TaskRecommendation[]> => {
  if (tasks.length === 0) return [];

  if (!USE_GEMINI_LIVE) return getDemoTaskRecommendations(tasks, answers, feelingText);

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  const taskList = tasks
    .map((t) => `- id: "${t.id}", title: "${t.title}"${t.description ? `, description: ${t.description}` : ""}`)
    .join("\n");
  const feeling = (feelingText ?? "").trim() ? `User also said: "${feelingText.trim()}"` : "";

  const prompt = `You are an AI sustainability advisor. Given this user's profile and the list of tasks, recommend which tasks fit them best. Return a ranked list (best fit first).

User questionnaire (1–5 scale): transport=${answers.transport}, homeEnergy=${answers.homeEnergy}, waste=${answers.waste}, food=${answers.food}, community=${answers.community}.
${feeling}

Tasks:
${taskList}

Return STRICT JSON only, an array of recommendations (include at least 3, up to 5), best first:
[
  { "taskId": "task-1", "fit": "high" | "medium" | "low", "reason": "one short sentence why this fits" },
  ...
]
Rules: taskId must be one of the ids above. fit = high (well aligned), medium (doable), low (stretch). reason under 15 words. No markdown.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    const raw = response.text ?? "[]";
    const parsed = JSON.parse(cleanJsonText(raw));
    const list = Array.isArray(parsed) ? parsed : [];
    const taskById = new Map(tasks.map((t) => [t.id, t]));
    return list.slice(0, 5).map((item: { taskId?: string; fit?: string; reason?: string }) => {
      const taskId = String(item.taskId ?? "");
      const task = taskById.get(taskId);
      const fit =
        item.fit === "high" || item.fit === "medium" || item.fit === "low" ? item.fit : "medium";
      return {
        taskId,
        taskTitle: task?.title ?? taskId,
        fit,
        reason: String(item.reason ?? "Recommended for you."),
        mode: "live" as const,
      };
    });
  } catch {
    return getDemoTaskRecommendations(tasks, answers, feelingText);
  }
};

/** Starter recommendations for new users (no or little history). */
const getDemoStarterRecommendations = (tasks: TaskForFit[]): TaskRecommendation[] =>
  tasks.slice(0, 5).map((t, i) => ({
    taskId: t.id,
    taskTitle: t.title,
    fit: (i < 2 ? "high" : i < 4 ? "medium" : "low") as "high" | "medium" | "low",
    reason: RANDOM_REASONS[i % RANDOM_REASONS.length],
    mode: "demo" as const,
  }));

/** Recommendations based on user's activity history (no questionnaire). */
const getDemoRecommendationsFromProfile = (
  tasks: TaskForFit[],
  profile: UserActivityProfile,
): TaskRecommendation[] => {
  const notDone = tasks.filter((t) => !profile.taskIdsDone.includes(t.id));
  const pool = notDone.length >= 3 ? notDone : tasks;
  return pool.slice(0, 5).map((t, i) => {
    const done = profile.taskIdsDone.includes(t.id);
    const reason = done
      ? "Worth repeating to build habit."
      : RANDOM_REASONS[(i + profile.totalCount) % RANDOM_REASONS.length];
    return {
      taskId: t.id,
      taskTitle: t.title,
      fit: (i < 2 ? "high" : i < 4 ? "medium" : "low") as "high" | "medium" | "low",
      reason,
      mode: "demo" as const,
    };
  });
};

export const getTaskRecommendationsFromProfile = async (
  tasks: TaskForFit[],
  profile: UserActivityProfile,
): Promise<TaskRecommendation[]> => {
  if (tasks.length === 0) return [];

  const hasHistory = profile.totalCount > 0;
  if (!USE_GEMINI_LIVE) {
    return hasHistory
      ? getDemoRecommendationsFromProfile(tasks, profile)
      : getDemoStarterRecommendations(tasks);
  }

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  const taskList = tasks
    .map((t) => `- id: "${t.id}", title: "${t.title}"${t.description ? `, description: ${t.description}` : ""}`)
    .join("\n");
  const context = hasHistory
    ? `User has logged ${profile.totalCount} activities. Categories they've done: ${profile.categories.join(", ") || "none"}. Task IDs already completed: ${profile.taskIdsDone.join(", ") || "none"}. Recommend tasks that build on this or add variety (prefer not-yet-done tasks).`
    : "User is new or has no activity history. Recommend 4-5 good starter tasks, varied and achievable.";

  const prompt = `You are an AI sustainability advisor. ${context}

Tasks:
${taskList}

Return STRICT JSON only, an array of recommendations (3-5 items), best first:
[
  { "taskId": "task-1", "fit": "high" | "medium" | "low", "reason": "one short sentence" },
  ...
]
Rules: taskId must be one of the ids above. reason under 15 words. No markdown.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    const raw = response.text ?? "[]";
    const parsed = JSON.parse(cleanJsonText(raw));
    const list = Array.isArray(parsed) ? parsed : [];
    const taskById = new Map(tasks.map((t) => [t.id, t]));
    return list.slice(0, 5).map((item: { taskId?: string; fit?: string; reason?: string }) => {
      const taskId = String(item.taskId ?? "");
      const task = taskById.get(taskId);
      const fit =
        item.fit === "high" || item.fit === "medium" || item.fit === "low" ? item.fit : "medium";
      return {
        taskId,
        taskTitle: task?.title ?? taskId,
        fit,
        reason: String(item.reason ?? "Recommended for you."),
        mode: "live" as const,
      };
    });
  } catch {
    return hasHistory
      ? getDemoRecommendationsFromProfile(tasks, profile)
      : getDemoStarterRecommendations(tasks);
  }
};
