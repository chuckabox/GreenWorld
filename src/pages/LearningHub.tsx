import React from "react";
import {
  ArrowUpRight,
  BookOpen,
  CheckCircle,
  Clock,
  PlayCircle,
} from "lucide-react";

const learningThemes = [
  {
    title: "Core Environmental Ecosystems",
    description:
      "Understand the natural systems that keep our planet resilient.",
    paths: [
      {
        title: "🌊 Ocean & Marine Life",
        duration: "70 mins",
        modules: 4,
        accent: "bg-blue-50 text-blue-700",
      },
      {
        title: "🌳 Forests & Biodiversity",
        duration: "85 mins",
        modules: 5,
        accent: "bg-emerald-50 text-emerald-700",
      },
      {
        title: "🐝 Wildlife & Ecosystems",
        duration: "60 mins",
        modules: 4,
        accent: "bg-amber-50 text-amber-700",
      },
      {
        title: "🌱 Soil & Agriculture",
        duration: "75 mins",
        modules: 4,
        accent: "bg-lime-50 text-lime-700",
      },
      {
        title: "💧 Water Resources",
        duration: "65 mins",
        modules: 3,
        accent: "bg-sky-50 text-sky-700",
      },
    ],
  },
  {
    title: "Human Sustainability Systems",
    description: "Design the systems that make low-impact living possible.",
    paths: [
      {
        title: "⚡ Energy & Climate",
        duration: "80 mins",
        modules: 5,
        accent: "bg-amber-50 text-amber-700",
      },
      {
        title: "♻️ Waste & Circular Economy",
        duration: "70 mins",
        modules: 4,
        accent: "bg-emerald-50 text-emerald-700",
      },
      {
        title: "🚲 Sustainable Cities & Transport",
        duration: "90 mins",
        modules: 5,
        accent: "bg-blue-50 text-blue-700",
      },
      {
        title: "🍎 Food & Sustainable Consumption",
        duration: "60 mins",
        modules: 3,
        accent: "bg-rose-50 text-rose-700",
      },
    ],
  },
  {
    title: "Emerging Sustainability Areas",
    description: "Explore growing fields shaping climate solutions.",
    paths: [
      {
        title: "🧠 Green Innovation & Technology",
        duration: "75 mins",
        modules: 4,
        accent: "bg-violet-50 text-violet-700",
      },
      {
        title: "🌍 Climate Action & Policy",
        duration: "85 mins",
        modules: 5,
        accent: "bg-slate-50 text-slate-700",
      },
      {
        title: "🤝 Community Sustainability",
        duration: "65 mins",
        modules: 3,
        accent: "bg-teal-50 text-teal-700",
      },
    ],
  },
];

const quickGuides = [
  { title: "5-minute recycling check", tag: "Checklist" },
  { title: "Compost starter kit", tag: "How-to" },
  { title: "Low-carbon commute planner", tag: "Toolkit" },
  { title: "Home energy audit", tag: "Worksheet" },
];

const videoLessons = [
  { title: "Circular economy in 8 mins", length: "8:24" },
  { title: "Clean energy myths", length: "6:40" },
  { title: "Community climate wins", length: "12:05" },
];

const challenges = [
  {
    title: "Plastic-free week",
    progress: "2 of 5 tasks done",
    status: "In progress",
  },
  {
    title: "Bike or walk commute",
    progress: "0 of 4 rides logged",
    status: "Not started",
  },
  { title: "Energy reset", progress: "Complete", status: "Completed" },
];

export const LearningHub = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold">Green Hub</h2>
          <p className="text-slate-500 text-sm sm:text-base">
            Bite-sized learning materials to level up your climate impact.
          </p>
        </div>

        <button className="btn-primary inline-flex items-center justify-center gap-2 w-full sm:w-auto">
          <BookOpen size={18} />
          Browse full library
        </button>
      </div>

      {/* Learning Themes */}
      <div className="space-y-10">
        {learningThemes.map((theme) => (
          <div key={theme.title} className="space-y-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold">
                {theme.title}
              </h3>
              <p className="text-sm text-slate-500">{theme.description}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
              {theme.paths.slice(0, 3).map((path) => (
                <div
                  key={path.title}
                  className="card flex flex-col gap-4 p-4 sm:p-5"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 ${path.accent}`}
                    >
                      <BookOpen size={20} />
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-base sm:text-lg font-bold">
                        {path.title}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {path.modules} modules • {path.duration}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      Learning path
                    </span>

                    <button className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80">
                      Start
                      <ArrowUpRight size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button className="text-sm font-semibold text-primary hover:text-primary/80 inline-flex items-center gap-1">
              View all
              <ArrowUpRight size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Quick Guides + Videos */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 card p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold">Quick Guides</h3>
              <p className="text-sm text-slate-500">
                Fast wins you can apply this week.
              </p>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary-light text-primary w-fit">
              Updated weekly
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickGuides.map((guide) => (
              <div
                key={guide.title}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold">{guide.title}</p>
                  <p className="text-xs text-slate-500">{guide.tag}</p>
                </div>

                <ArrowUpRight size={18} className="text-slate-400" />
              </div>
            ))}
          </div>
        </div>

        <div className="card p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <PlayCircle size={20} />
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-semibold">
                Video Lessons
              </h3>
              <p className="text-sm text-slate-500">
                Learn in under 15 minutes.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {videoLessons.map((video) => (
              <div
                key={video.title}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50"
              >
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                  <PlayCircle size={18} />
                </div>

                <div className="flex-1">
                  <p className="font-semibold text-sm">{video.title}</p>
                  <p className="text-xs text-slate-400">{video.length}</p>
                </div>

                <ArrowUpRight size={16} className="text-slate-300" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Challenges */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="card p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Clock size={20} />
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-semibold">
                Weekly Challenge
              </h3>
              <p className="text-sm text-slate-500">
                Stay consistent with small actions.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-sm text-slate-500">This week</p>
            <p className="text-base sm:text-lg font-bold">
              Track 3 low-carbon commutes
            </p>
            <p className="text-xs text-slate-400">Earn +120 impact points</p>
          </div>
        </div>

        <div className="xl:col-span-2 card p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {challenges.map((challenge) => (
              <div
                key={challenge.title}
                className="p-4 rounded-2xl border border-slate-100"
              >
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                  <CheckCircle size={14} className="text-emerald-500" />
                  {challenge.status}
                </div>

                <p className="font-semibold">{challenge.title}</p>
                <p className="text-xs text-slate-500">{challenge.progress}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
