import { GoogleGenAI } from "@google/genai";

export interface EcoVerificationResult {
  isRelevant: boolean;
  actionCategory: string;
  confidence: number;
  summary: string;
  estimatedCo2Kg: number;
  estimatedPlasticItemsReduced: number;
  estimatedWaterLitersSaved: number;
  reviewRecommendation: "approve" | "manual_review" | "reject";
  verificationMode: "demo" | "live";
}

const parseBoolean = (value: string | undefined, defaultValue = false) => {
  if (value == null) return defaultValue;
  return value.trim().toLowerCase() === "true";
};

const extractNumberBeforeKeyword = (text: string, keywords: string[]) => {
  for (const keyword of keywords) {
    const regex = new RegExp(`(\\d+(?:\\.\\d+)?)\\s*(?:x\\s*)?${keyword}`, "i");
    const match = text.match(regex);
    if (match?.[1]) return Number(match[1]);
  }
  return null;
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const getDemoVerification = (activityCategory: string, activityDescription: string): EcoVerificationResult => {
  const category = activityCategory.toLowerCase();
  const description = activityDescription.toLowerCase();
  const looksSuspicious = description.includes("test") || description.includes("fake");

  const confidenceByCategory: Record<string, number> = {
    "waste management": 0.84,
    "energy conservation": 0.76,
    "community outreach": 0.72,
    "environmental advocacy": 0.68,
    biodiversity: 0.8,
  };

  const confidence = Math.max(0.45, Math.min(0.95, (confidenceByCategory[category] ?? 0.7) - (looksSuspicious ? 0.2 : 0)));
  const isRelevant = !looksSuspicious;

  const bottleCount = extractNumberBeforeKeyword(description, ["bottle", "bottles"]) ?? (description.includes("bottle") ? 1 : 0);
  const canCount = extractNumberBeforeKeyword(description, ["can", "cans"]) ?? (description.includes("can") ? 1 : 0);
  const kmByBike = extractNumberBeforeKeyword(description, ["km bike", "km cycle", "km cycled", "km bicycle", "kilometer bike", "kilometre bike"])
    ?? (description.includes("bike") || description.includes("cycle") ? 2 : 0);
  const treeCount = extractNumberBeforeKeyword(description, ["tree", "trees"]) ?? (description.includes("plant") && description.includes("tree") ? 1 : 0);

  let estimatedCo2Kg = (() => {
    if (treeCount > 0) return treeCount * 8; // annualized estimate per tree, conservative for demo.
    if (kmByBike > 0) return kmByBike * 0.18;
    if (bottleCount > 0 || canCount > 0) return bottleCount * 0.06 + canCount * 0.05;

    const baselineByCategory: Record<string, number> = {
      "waste management": 0.2,
      "energy conservation": 0.8,
      "community outreach": 0.15,
      "environmental advocacy": 0.08,
      biodiversity: 1.2,
    };
    return baselineByCategory[category] ?? 0.2;
  })();

  estimatedCo2Kg = isRelevant ? clamp(estimatedCo2Kg * confidence, 0.02, 25) : 0;
  const estimatedPlasticItemsReduced = isRelevant
    ? Math.max(0, Math.round((bottleCount + canCount) || confidence * 3))
    : 0;
  const estimatedWaterLitersSaved = isRelevant
    ? Math.max(0, Math.round((category === "energy conservation" ? 20 : 8) * confidence))
    : 0;

  const reviewRecommendation = !isRelevant
    ? "reject"
    : confidence >= 0.8
      ? "approve"
      : confidence >= 0.6
        ? "manual_review"
        : "reject";

  return {
    isRelevant,
    actionCategory: activityCategory,
    confidence,
    summary: isRelevant
      ? "Verification complete. Your evidence aligns with the selected sustainability action."
      : "Verification complete. This evidence needs a manual review before approval.",
    estimatedCo2Kg: Number(estimatedCo2Kg.toFixed(2)),
    estimatedPlasticItemsReduced,
    estimatedWaterLitersSaved,
    reviewRecommendation,
    verificationMode: "demo",
  };
};

const toBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result ?? "");
      const base64 = result.includes(",") ? result.split(",")[1] : result;
      resolve(base64);
    };
    reader.onerror = () => reject(new Error("Failed to read selected image."));
    reader.readAsDataURL(file);
  });

const cleanJsonText = (text: string) =>
  text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

export const verifyEcoImageWithGemini = async (
  file: File,
  activityCategory: string,
  activityDescription: string,
): Promise<EcoVerificationResult> => {
  const aiDemoMode = parseBoolean(import.meta.env.VITE_AI_DEMO_MODE, false);
  if (aiDemoMode) {
    return getDemoVerification(activityCategory, activityDescription);
  }

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing VITE_GEMINI_API_KEY in .env");
  }

  const ai = new GoogleGenAI({ apiKey });
  const imageBase64 = await toBase64(file);

  const prompt = `You are an eco-action evidence verifier for a hackathon app.

User-submitted claim:
- Category: ${activityCategory}
- Description: ${activityDescription || "(empty)"}

Task:
1) Judge whether this image is relevant evidence for a real sustainability action.
2) Estimate likely impact conservatively.
3) Return STRICT JSON only, no markdown.

JSON schema:
{
  "isRelevant": boolean,
  "actionCategory": string,
  "confidence": number,
  "summary": string,
  "estimatedCo2Kg": number,
  "estimatedPlasticItemsReduced": number,
  "estimatedWaterLitersSaved": number,
  "reviewRecommendation": "approve" | "manual_review" | "reject"
}

Rules:
- Confidence must be between 0 and 1.
- Keep estimates conservative and realistic.
- Use these reference anchors:
  - 1 recycled plastic bottle ~= 0.05 to 0.1 kg CO2 avoided.
  - 1 recycled aluminum can ~= 0.04 to 0.08 kg CO2 avoided.
  - Cycling 1 km instead of car ~= 0.15 to 0.22 kg CO2 avoided.
  - Planting 1 tree should be treated as ANNUAL sequestration ~= 5 to 10 kg CO2/year (not instant).
- If quantity is missing, assume one small action only.
- For a single small action, estimatedCo2Kg is usually between 0.03 and 1.5.
- Never return inflated values for tiny actions (e.g., 1 bottle should not exceed 0.15 kg).
- If evidence is weak, set reviewRecommendation to "manual_review".
- If irrelevant/non-eco image, set isRelevant=false and reviewRecommendation="reject".
- Never include text outside JSON.`;

  let response;
  try {
    response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: file.type || "image/jpeg",
                data: imageBase64,
              },
            },
          ],
        },
      ],
    });
  } catch (error) {
    const fallbackToDemo = parseBoolean(import.meta.env.VITE_AI_FALLBACK_TO_DEMO, false);
    if (fallbackToDemo) {
      return getDemoVerification(activityCategory, activityDescription);
    }
    throw error;
  }

  const rawText = response.text?.trim();
  if (!rawText) {
    throw new Error("Gemini returned an empty response.");
  }

  let parsed: Partial<EcoVerificationResult>;
  try {
    parsed = JSON.parse(cleanJsonText(rawText));
  } catch {
    throw new Error("Gemini response was not valid JSON.");
  }

  return {
    isRelevant: Boolean(parsed.isRelevant),
    actionCategory: String(parsed.actionCategory ?? "Unknown"),
    confidence: clamp(Number(parsed.confidence ?? 0), 0, 1),
    summary: String(parsed.summary ?? "No summary provided."),
    estimatedCo2Kg: clamp(Number(parsed.estimatedCo2Kg ?? 0), 0, 25),
    estimatedPlasticItemsReduced: clamp(Number(parsed.estimatedPlasticItemsReduced ?? 0), 0, 1000),
    estimatedWaterLitersSaved: clamp(Number(parsed.estimatedWaterLitersSaved ?? 0), 0, 10000),
    reviewRecommendation:
      parsed.reviewRecommendation === "approve" ||
      parsed.reviewRecommendation === "manual_review" ||
      parsed.reviewRecommendation === "reject"
        ? parsed.reviewRecommendation
        : "manual_review",
    verificationMode: "live",
  };
};
