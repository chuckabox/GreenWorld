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

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-8 flex justify-center">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-6 sm:p-8">
        <h1 className="text-xl sm:text-2xl font-semibold mb-6">
          Log Sustainability Activity
        </h1>

        {submitSuccess ? (
          <div className="text-center space-y-4">
            <CheckCircle2 className="mx-auto text-green-500" size={48} />
            <h2 className="text-xl font-semibold">
              {submitSuccess.status === "approved"
                ? "Activity Approved!"
                : "Activity Submitted"}
            </h2>

            <p className="text-gray-600">{submitSuccess.note}</p>

            {submitSuccess.points > 0 && (
              <p className="text-lg font-medium text-green-600">
                +{submitSuccess.points} points earned
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <button
                onClick={resetForAnotherLog}
                className="px-5 py-2 rounded-lg bg-green-600 text-white"
              >
                Log Another
              </button>

              <button
                onClick={() => navigate("/dashboard")}
                className="px-5 py-2 rounded-lg border"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Category */}
            <div>
              <label className="text-sm font-medium">Category</label>
              <select
                className="w-full border rounded-lg px-3 py-2 mt-1"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option>Waste Management</option>
                <option>Tree Planting</option>
                <option>Energy Saving</option>
                <option>Water Conservation</option>
              </select>
            </div>

            {/* Hours + Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Hours</label>
                <input
                  type="number"
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                  value={formData.hours}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hours: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium">Date</label>
                <input
                  type="date"
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                className="w-full border rounded-lg px-3 py-2 mt-1"
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            {/* Upload */}
            <div>
              <label className="text-sm font-medium">Upload Proof</label>

              <div
                className="border-dashed border-2 rounded-lg p-6 text-center cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                {proofImage ? (
                  <div className="flex justify-between items-center">
                    <span>{proofImage.name}</span>
                    <X
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setProofImage(null);
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload />
                    <p className="text-sm text-gray-500">
                      Click to upload image
                    </p>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => setProofImage(e.target.files?.[0] || null)}
              />
            </div>

            {/* Error */}
            {submitError && (
              <p className="text-red-500 text-sm">{submitError}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full py-3 rounded-lg bg-green-600 text-white flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="animate-spin" size={18} />
                  {submitStage}
                </>
              ) : (
                "Submit Activity"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
