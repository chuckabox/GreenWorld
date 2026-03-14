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
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-green-50 to-white" />
        <div className="relative grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 items-center">
          <div className="space-y-5">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
              Green Hub Category
            </span>
            <h1 className="text-4xl lg:text-5xl">Waste & Circular Economy</h1>
            <p className="text-lg text-slate-600 max-w-xl">
              Learn how materials can stay in use instead of becoming pollution.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="btn-primary inline-flex items-center gap-2">
                Start Learning
                <ArrowRight size={18} />
              </button>
              <button className="inline-flex items-center gap-2 px-4 h-11 rounded-xl border border-emerald-200 text-emerald-700 font-semibold hover:bg-emerald-50 transition-colors">
                Explore activities
                <ArrowUpRight size={18} />
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-3xl bg-white border border-emerald-100 shadow-lg p-6 flex items-center justify-center">
              <div className="w-full h-full rounded-3xl bg-gradient-to-br from-emerald-100 via-green-50 to-slate-50 flex items-center justify-center relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-200/60 rounded-full" />
                <div className="absolute -bottom-12 -left-10 w-36 h-36 bg-green-200/50 rounded-full" />
                <div className="relative w-36 h-36 rounded-full bg-white shadow-md flex items-center justify-center">
                  <Recycle size={64} className="text-emerald-600" />
                </div>
                <div className="absolute bottom-6 left-6 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-emerald-700">
                  Circular flow
                </div>
                <div className="absolute top-6 right-6 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-emerald-700">
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
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Quick overview</span>
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
              accent: "bg-emerald-50 text-emerald-600",
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

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg">Material Loop Snapshot</h3>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Infographic</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Reused", value: 62, color: "bg-emerald-500" },
                { label: "Recycled", value: 24, color: "bg-blue-500" },
                { label: "Waste", value: 14, color: "bg-rose-500" },
              ].map((stat) => (
                <div key={stat.label} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-xs text-slate-500">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}%</p>
                  <div className="w-full h-2 bg-slate-100 rounded-full mt-3 overflow-hidden">
                    <div className={`${stat.color} h-full`} style={{ width: `${stat.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg">Watch: Circular Economy 101</h3>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Video</span>
            </div>
            <div className="aspect-video rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500">
              <PlayCircle size={42} />
            </div>
            <p className="text-xs text-slate-500 mt-3">Short explainer video placeholder.</p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <h2 className="text-2xl">Learning Path Overview</h2>
          <p className="text-slate-500">Progress from awareness to real-world action.</p>
        </div>
        <div className="relative">
          <div className="hidden md:block absolute left-0 right-0 top-1/2 h-px bg-emerald-100" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "🌱 Level 1: Discover",
                description: "Understand the basics of waste streams and circular systems.",
              },
              {
                title: "🧠 Level 2: Apply",
                description: "Build habits, track waste, and test circular alternatives.",
              },
              {
                title: "🌍 Level 3: Act",
                description: "Lead community initiatives and measure impact outcomes.",
              },
            ].map((level) => (
              <div key={level.title} className="card relative">
                <div className="absolute -top-3 left-6 w-6 h-6 rounded-full bg-emerald-500 shadow-sm hidden md:block" />
                <h3 className="text-lg">{level.title}</h3>
                <p className="text-sm text-slate-500 mt-2">{level.description}</p>
                <button className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80">
                  Go to level
                  <ArrowUpRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <h2 className="text-2xl">Featured Activities</h2>
            <p className="text-slate-500">Hands-on ways to practice circular thinking.</p>
          </div>
          <button className="text-sm font-semibold text-primary hover:text-primary/80 inline-flex items-center gap-1">
            View all activities
            <ArrowUpRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Waste Sorting Game",
              description: "Test your knowledge of proper recycling and disposal.",
              icon: Recycle,
              accent: "bg-emerald-50 text-emerald-600",
            },
            {
              title: "Circular Product Design Simulator",
              description: "Prototype products that stay in circulation longer.",
              icon: Sparkles,
              accent: "bg-blue-50 text-blue-600",
            },
            {
              title: "Zero-Waste Challenge",
              description: "Track daily wins and build a waste-free routine.",
              icon: CheckCircle,
              accent: "bg-amber-50 text-amber-600",
            },
          ].map((activity) => {
            const Icon = activity.icon;
            return (
              <div key={activity.title} className="card flex flex-col gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${activity.accent}`}>
                  <Icon size={22} />
                </div>
                <div>
                  <h3 className="text-lg">{activity.title}</h3>
                  <p className="text-sm text-slate-500 mt-2">{activity.description}</p>
                </div>
                <button className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80">
                  Try Activity
                  <ArrowUpRight size={16} />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      <section className="card bg-gradient-to-br from-emerald-700 via-green-700 to-emerald-800 text-white border-emerald-600 shadow-xl shadow-emerald-900/20">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 items-center">
          <div className="space-y-3">
            <h2 className="text-2xl">Community Impact Meter</h2>
            <p className="text-emerald-100">Together we are proving circular systems work.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="bg-white/10 rounded-2xl p-4">
                <p className="text-sm text-emerald-100">Waste Reduced</p>
                <p className="text-3xl font-bold">{reducedLabel} kg</p>
                <div className="w-full h-2 bg-white/10 rounded-full mt-3">
                  <div className="h-full bg-white rounded-full" style={{ width: "72%" }} />
                </div>
              </div>
              <div className="bg-white/10 rounded-2xl p-4">
                <p className="text-sm text-emerald-100">Participants</p>
                <p className="text-3xl font-bold">{participantsLabel}</p>
                <div className="w-full h-2 bg-white/10 rounded-full mt-3">
                  <div className="h-full bg-white rounded-full" style={{ width: "64%" }} />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white/10 rounded-3xl p-6 border border-white/10">
            <h3 className="text-lg">Impact Highlights</h3>
            <div className="space-y-4 mt-4">
              {[
                { label: "Community cleanups", value: "148 events" },
                { label: "Circular projects", value: "36 pilots" },
                { label: "Households engaged", value: "1,020" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <span className="text-emerald-100">{item.label}</span>
                  <span className="font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
