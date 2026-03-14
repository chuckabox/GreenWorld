import React from "react";
import { createPortal } from "react-dom";
import { X, Gift, Store, Sparkles, TrendingUp, ShieldCheck } from "lucide-react";

export const GreenPassInfoDialog = ({ onClose }: { onClose: () => void }) => {
  const perks = [
    {
      icon: Store,
      title: "Local Business Discounts",
      description: "Get 10-20% off at our partner-sponsored eco-friendly businesses.",
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      icon: Gift,
      title: "Free Items",
      description: "Redeem your pts for free sustainable products and merch.",
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    {
      icon: Sparkles,
      title: "Exclusive Events",
      description: "Early access to VIP community workshops and regional cleanups.",
      color: "text-purple-600",
      bg: "bg-purple-50"
    },
    {
      icon: TrendingUp,
      title: "Point Multipliers",
      description: "Earn 1.5x points on every activity you log with a verified Pass.",
      color: "text-orange-600",
      bg: "bg-orange-50"
    }
  ];

  const overlay = (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 px-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="relative max-w-md w-full bg-white rounded-3xl p-6 shadow-2xl space-y-6"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-light text-primary rounded-xl flex items-center justify-center">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Green Pass Perks</h2>
              <p className="text-xs text-slate-500 font-medium tracking-tight">Your verified status unlocks value.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {perks.map((perk, i) => {
            const Icon = perk.icon;
            return (
              <div key={i} className="flex gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors group">
                <div className={cn("w-10 h-10 shrink-0 rounded-xl flex items-center justify-center", perk.bg, perk.color)}>
                  <Icon size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 mb-0.5">{perk.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{perk.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-primary-light/30 p-4 rounded-2xl border border-primary/10">
          <p className="text-xs text-slate-600 leading-relaxed text-center italic">
            "Your actions don't just help the planet, they reward you too. Keep logging to earn more pts!"
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full btn-primary h-12 flex items-center justify-center font-bold"
        >
          Got it
        </button>
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
};

// Helper for class merging if not imported
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
