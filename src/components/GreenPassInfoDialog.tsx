import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, Gift, Store, Sparkles, TrendingUp, ShieldCheck } from "lucide-react";

export const GreenPassInfoDialog = ({ onClose }: { onClose: () => void }) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [dragStartY, setDragStartY] = useState<number | null>(null);
  const [dragTranslateY, setDragTranslateY] = useState(0);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

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
      icon: ShieldCheck,
      title: "Badge Certificate",
      description: "Download a CV-ready certificate with your current sustainability badge.",
      color: "text-orange-600",
      bg: "bg-orange-50"
    }
  ];

  const overlay = (
    <div
      className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-slate-950/40 px-2 pb-4 sm:px-4 sm:pb-8 md:pb-0 overflow-hidden"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="relative w-full max-w-lg sm:max-w-xl md:max-w-xl shrink-0"
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(event) => {
          const scrollTop = scrollRef.current?.scrollTop ?? 0;
          if (scrollTop > 0) {
            setDragStartY(null);
            setDragTranslateY(0);
            return;
          }
          setDragStartY(event.touches[0].clientY);
        }}
        onTouchMove={(event) => {
          if (dragStartY == null) return;
          const scrollTop = scrollRef.current?.scrollTop ?? 0;
          if (scrollTop > 0) {
            return;
          }
          const delta = event.touches[0].clientY - dragStartY;
          if (delta > 0) {
            setDragTranslateY(delta);
          }
        }}
        onTouchEnd={() => {
          if (dragTranslateY > 80) {
            onClose();
          } else {
            setDragTranslateY(0);
          }
          setDragStartY(null);
        }}
        style={{
          transform: dragTranslateY ? `translateY(${dragTranslateY}px)` : undefined,
          transition: dragTranslateY ? "none" : "transform 0.2s ease-out",
        }}
      >
        <div
          ref={scrollRef}
          className="bg-white rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8 max-h-[90vh] overflow-y-auto modal-scroll"
        >
          <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-slate-200 sm:hidden" />
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-light text-primary rounded-2xl flex items-center justify-center">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Green Pass Perks</h2>
                <p className="text-sm text-slate-500 font-medium tracking-tight">
                  Your verified status unlocks these benefits.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {perks.map((perk, i) => {
            const Icon = perk.icon;
            return (
              <div key={i} className="flex flex-col gap-3 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary/20 transition-all group">
                <div className={cn("w-10 h-10 shrink-0 rounded-xl flex items-center justify-center", perk.bg, perk.color)}>
                  <Icon size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-base text-slate-900 mb-1">{perk.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{perk.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full btn-primary h-12 flex items-center justify-center font-bold"
        >
          Got it
        </button>
      </div>
    </div>
  </div>
  );

  return createPortal(overlay, document.body);
};

// Helper for class merging if not imported
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
