import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, AlertCircle, LoaderCircle } from "lucide-react";
import { verifyEcoImageWithGemini, EcoVerificationResult } from "../lib/geminiVerifier";

export const LogActivity = ({ userId, onActivityLogged }: { userId: number, onActivityLogged: () => void }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: "Waste Management",
    hours: 1,
    date: new Date().toISOString().split('T')[0],
    description: "",
    evidenceUrl: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<EcoVerificationResult | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleVerify = async () => {
    if (!proofImage) {
      setVerifyError("Please select an image before verifying.");
      return;
    }

    setIsVerifying(true);
    setVerifyError(null);

    try {
      const result = await verifyEcoImageWithGemini(proofImage, formData.category, formData.description);
      setVerificationResult(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Verification failed.";
      setVerifyError(message);
      setVerificationResult(null);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!verificationResult) {
      setSubmitError("Run AI verification before submitting this action.");
      return;
    }

    if (verificationResult.reviewRecommendation === "reject") {
      setSubmitError("AI marked this evidence as non-relevant. Please upload clearer proof.");
      return;
    }

    setIsSubmitting(true);
    try {
      const enrichedDescription = verificationResult
        ? `${formData.description}\n\n[AI Verification]\nRelevant: ${verificationResult.isRelevant ? "yes" : "no"}\nConfidence: ${(verificationResult.confidence * 100).toFixed(0)}%\nEstimated CO2: ${verificationResult.estimatedCo2Kg} kg\nEstimated Plastic Reduced: ${verificationResult.estimatedPlasticItemsReduced} items\nEstimated Water Saved: ${verificationResult.estimatedWaterLitersSaved} L\nRecommendation: ${verificationResult.reviewRecommendation}\nSummary: ${verificationResult.summary}`
        : formData.description;

      const localActivity = {
        id: Date.now(),
        user_id: userId,
        category: formData.category,
        hours: formData.hours,
        date: formData.date,
        description: enrichedDescription,
        evidenceUrl: formData.evidenceUrl,
        aiConfidence: verificationResult.confidence,
        aiRecommendation: verificationResult.reviewRecommendation,
        estimatedCo2Kg: verificationResult.estimatedCo2Kg,
        estimatedPlasticItemsReduced: verificationResult.estimatedPlasticItemsReduced,
        estimatedWaterLitersSaved: verificationResult.estimatedWaterLitersSaved,
        status: verificationResult.reviewRecommendation === "approve" ? "approved" : "pending" as const,
      };

      const currentActivities = JSON.parse(localStorage.getItem("activities") || "[]");
      localStorage.setItem("activities", JSON.stringify([...currentActivities, localActivity]));

      onActivityLogged();
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setSubmitError("Unable to submit at the moment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl">Log Your Impact</h2>
        <p className="text-slate-500">Snap, verify, and submit your sustainability action for points.</p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Category</label>
            <select
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option>Waste Management</option>
              <option>Energy Conservation</option>
              <option>Community Outreach</option>
              <option>Environmental Advocacy</option>
              <option>Biodiversity</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Hours Involved</label>
            <input
              type="number"
              min="0.5"
              step="0.5"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
              value={formData.hours}
              onChange={(e) => setFormData({ ...formData, hours: parseFloat(e.target.value) })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Date of Activity</label>
          <input
            type="date"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Description</label>
          <textarea
            rows={4}
            placeholder="What did you do? What was the impact?"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none resize-none"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Evidence (Optional URL)</label>
          <input
            type="url"
            placeholder="Link to photos, reports, or social posts"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
            value={formData.evidenceUrl}
            onChange={(e) => setFormData({ ...formData, evidenceUrl: e.target.value })}
          />
        </div>

        <div className="space-y-3 border border-slate-200 bg-slate-50 rounded-xl p-4">
          <div>
            <label className="text-sm font-bold text-slate-700">AI Image Verification (Recommended)</label>
            <p className="text-xs text-slate-500 mt-1">Upload a photo proof and verify before submitting.</p>
          </div>

          <input
            type="file"
            accept="image/*"
            className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              setProofImage(file);
              setVerificationResult(null);
              setVerifyError(null);
            }}
          />

          <button
            type="button"
            onClick={handleVerify}
            disabled={isVerifying || !proofImage}
            className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold disabled:opacity-50"
          >
            {isVerifying ? "Verifying..." : "Snap-to-Verify with AI Supervisor"}
          </button>

          {isVerifying && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <LoaderCircle size={16} className="animate-spin" />
              AI is reviewing your evidence...
            </div>
          )}

          {verifyError && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle size={16} />
              {verifyError}
            </div>
          )}

          {verificationResult && (
            <div className={`rounded-xl p-3 text-sm ${verificationResult.isRelevant ? "bg-green-50 text-green-800 border border-green-200" : "bg-amber-50 text-amber-900 border border-amber-200"}`}>
              <div className="flex items-center gap-2 font-semibold mb-2">
                {verificationResult.isRelevant ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                {verificationResult.isRelevant ? "Evidence looks relevant" : "Evidence needs manual review"}
              </div>
              <p className="mb-2">{verificationResult.summary}</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>Verification confidence: {(verificationResult.confidence * 100).toFixed(0)}%</div>
                <div>Action category: {verificationResult.actionCategory}</div>
                <div>Estimated CO2 impact: {verificationResult.estimatedCo2Kg} kg</div>
                <div>Estimated plastic reduced: {verificationResult.estimatedPlasticItemsReduced}</div>
                <div>Estimated water saved: {verificationResult.estimatedWaterLitersSaved} L</div>
              </div>
            </div>
          )}

          {verificationResult?.reviewRecommendation === "approve" && (
            <div className="rounded-xl p-3 text-sm border border-emerald-200 bg-emerald-50 text-emerald-800">
              Verified action. Estimated reward: <span className="font-bold">+{Math.max(25, Math.round(verificationResult.estimatedCo2Kg * 40))} Green Points</span>
            </div>
          )}
        </div>

        {submitError && <p className="text-sm text-red-600 font-semibold">{submitError}</p>}

        <div className="pt-4 flex items-center gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary flex-1 py-4 disabled:opacity-50"
          >
            {isSubmitting ? "Logging..." : "Submit for Review"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-8 py-4 border-2 border-slate-100 rounded-xl font-bold hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
