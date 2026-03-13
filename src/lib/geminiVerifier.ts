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
}

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
- If evidence is weak, set reviewRecommendation to "manual_review".
- If irrelevant/non-eco image, set isRelevant=false and reviewRecommendation="reject".
- Never include text outside JSON.`;

  const response = await ai.models.generateContent({
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
    confidence: Number(parsed.confidence ?? 0),
    summary: String(parsed.summary ?? "No summary provided."),
    estimatedCo2Kg: Number(parsed.estimatedCo2Kg ?? 0),
    estimatedPlasticItemsReduced: Number(parsed.estimatedPlasticItemsReduced ?? 0),
    estimatedWaterLitersSaved: Number(parsed.estimatedWaterLitersSaved ?? 0),
    reviewRecommendation:
      parsed.reviewRecommendation === "approve" ||
      parsed.reviewRecommendation === "manual_review" ||
      parsed.reviewRecommendation === "reject"
        ? parsed.reviewRecommendation
        : "manual_review",
  };
};
