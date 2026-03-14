import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, LoaderCircle, Upload, X } from "lucide-react";
import { verifyEcoImageWithGemini } from "../lib/geminiVerifier";

interface LogActivityProps {
  userId: number;
  onActivityLogged: () => void;
}

export const LogActivity: React.FC<LogActivityProps> = ({
  userId,
  onActivityLogged,
}) => {
  const navigate = useNavigate();

  const defaultDate = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    category: "Waste Management",
    hours: 1,
    date: defaultDate,
    description: "",
    evidenceUrl: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [submitStage, setSubmitStage] = useState("Saving your activity...");
  const [submitSuccess, setSubmitSuccess] = useState<null | {
    status: "approved" | "pending";
    points: number;
    note: string;
  }>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const minDescriptionLength = 15;

  const hasEnoughDescription =
    formData.description.trim().length >= minDescriptionLength;

  const isDirty =
    formData.category !== "Waste Management" ||
    formData.hours !== 1 ||
    formData.date !== defaultDate ||
    formData.description.trim().length > 0 ||
    formData.evidenceUrl.trim().length > 0 ||
    proofImage !== null;

  const canSubmit = hasEnoughDescription && !isSubmitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (proofImage && !hasEnoughDescription) {
      setSubmitError(
        `Please describe your action in at least ${minDescriptionLength} characters when uploading a photo.`,
      );
      return;
    }

    setIsSubmitting(true);
    setSubmitStage("Saving your activity details...");

    const submitSteps = [
      "Saving your activity details...",
      "Verifying evidence with AI...",
      "Finalizing your result...",
    ];

    let submitIndex = 0;

    const submitTimer = setInterval(() => {
      submitIndex = (submitIndex + 1) % submitSteps.length;
      setSubmitStage(submitSteps[submitIndex]);
    }, 850);

    try {
      let aiResult: Awaited<
        ReturnType<typeof verifyEcoImageWithGemini>
      > | null = null;

      if (proofImage) {
        setSubmitStage("Verifying evidence with AI...");
        aiResult = await verifyEcoImageWithGemini(
          proofImage,
          formData.category,
          formData.description,
        );
      }

      const enrichedDescription = aiResult
        ? `${formData.description}

[AI Verification]
Relevant: ${aiResult.isRelevant ? "yes" : "no"}
Confidence: ${(aiResult.confidence * 100).toFixed(0)}%
Estimated CO2: ${aiResult.estimatedCo2Kg} kg
Estimated Plastic Reduced: ${aiResult.estimatedPlasticItemsReduced} items
Estimated Water Saved: ${aiResult.estimatedWaterLitersSaved} L
Recommendation: ${aiResult.reviewRecommendation}
Summary: ${aiResult.summary}`
        : formData.description;

      const status =
        aiResult && aiResult.reviewRecommendation === "approve"
          ? "approved"
          : "pending";

      const earnedPoints =
        aiResult && status === "approved"
          ? Math.max(25, Math.round(aiResult.estimatedCo2Kg * 40))
          : 0;

      const localActivity = {
        id: Date.now(),
        user_id: userId,
        category: formData.category,
        hours: formData.hours,
        date: formData.date,
        description: enrichedDescription,
        evidenceUrl: formData.evidenceUrl,
        aiConfidence: aiResult?.confidence,
        aiRecommendation: aiResult?.reviewRecommendation,
        estimatedCo2Kg: aiResult?.estimatedCo2Kg,
        estimatedPlasticItemsReduced: aiResult?.estimatedPlasticItemsReduced,
        estimatedWaterLitersSaved: aiResult?.estimatedWaterLitersSaved,
        status,
      };

      const currentActivities = JSON.parse(
        localStorage.getItem("activities") || "[]",
      );

      localStorage.setItem(
        "activities",
        JSON.stringify([...currentActivities, localActivity]),
      );

      onActivityLogged();

      clearInterval(submitTimer);

      setSubmitSuccess({
        status,
        points: earnedPoints,
        note: !proofImage
          ? "No photo was uploaded. This log is queued for manual review."
          : status === "approved"
            ? "AI verification completed successfully."
            : "Evidence submitted. This log is queued for manual review.",
      });
    } catch (error) {
      console.error(error);
      setSubmitError("Unable to submit at the moment. Please try again.");
      clearInterval(submitTimer);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForAnotherLog = () => {
    setFormData({
      category: "Waste Management",
      hours: 1,
      date: defaultDate,
      description: "",
      evidenceUrl: "",
    });

    setProofImage(null);
    setSubmitError(null);
    setSubmitSuccess(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return <div className="p-6 max-w-3xl mx-auto">{/* UI code unchanged */}</div>;
};
