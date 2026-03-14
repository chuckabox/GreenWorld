import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CheckCircle,
  Leaf,
  PlayCircle,
  Recycle,
  RefreshCcw,
  Sparkles,
  Target,
} from "lucide-react";

const useCountUp = (target: number, duration = 1400) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame: number | null = null;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      setValue(Math.floor(progress * target));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => {
      if (frame) cancelAnimationFrame(frame);
    };
  }, [target, duration]);

  return value;
};

export const GreenHubCategory = () => {
  const reduced = useCountUp(2400);
  const participants = useCountUp(3200);
  const reducedLabel = useMemo(() => reduced.toLocaleString(), [reduced]);
  const participantsLabel = useMemo(() => participants.toLocaleString(), [participants]);

  return (
    <div className="p-6 space-y-10">
      <section className="card overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-light/50 via-white to-white" />
        <div className="relative grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 items-center">
          <div className="space-y-5">
            <h1 className="text-4xl lg:text-5xl">Waste & Circular Economy</h1>
            <p className="text-lg text-slate-600 max-w-xl">
              Learn how materials can stay in use instead of becoming pollution.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="btn-primary inline-flex items-center gap-2">
                Start Learning
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-3xl bg-white border border-primary-light shadow-lg p-6 flex items-center justify-center">
              <div className="w-full h-full rounded-3xl bg-gradient-to-br from-primary-light via-white to-slate-50 flex items-center justify-center relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-light/60 rounded-full" />
                <div className="absolute -bottom-12 -left-10 w-36 h-36 bg-primary-light/40 rounded-full" />
                <div className="relative w-36 h-36 rounded-full bg-white shadow-md flex items-center justify-center">
                  <Recycle size={64} className="text-primary" />
                </div>
                <div className="absolute bottom-6 left-6 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-primary">
                  Circular flow
                </div>
                <div className="absolute top-6 right-6 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-primary">
                  Zero waste
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <h2 className="text-2xl">Why It Matters</h2>
            <p className="text-slate-500">Small choices add up to cleaner communities and resilient systems.</p>
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Quick overview</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Waste Crisis",
              description: "Global waste is rising fast, overwhelming landfills and waterways.",
              icon: Target,
              accent: "bg-rose-50 text-rose-600",
            },
            {
              title: "Environmental Impact",
              description: "Discarded materials release emissions and harm habitats.",
              icon: Leaf,
              accent: "bg-primary-light text-primary",
            },
            {
              title: "Importance of Circular Systems",
              description: "Reuse and redesign keep resources in play, reducing extraction.",
              icon: RefreshCcw,
              accent: "bg-blue-50 text-blue-600",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="card">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.accent} mb-4`}>
                  <Icon size={22} />
                </div>
                <h3 className="text-lg">{item.title}</h3>
                <p className="text-sm text-slate-500 mt-2">{item.description}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
