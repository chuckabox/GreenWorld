import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, BookOpen, CheckCircle, Clock, PlayCircle } from "lucide-react";

const learningThemes = [
  {
    title: "Core Environmental Ecosystems",
    description: "Understand the natural systems that keep our planet resilient.",
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
  {
    title: "Energy reset",
    progress: "Complete",
    status: "Completed",
  },
];

export const LearningHub = () => {
  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl">Green Hub</h2>
          <p className="text-slate-500">Bite-sized learning materials to level up your climate impact.</p>
        </div>
        <button className="btn-primary inline-flex items-center gap-2">
          <BookOpen size={18} />
          Browse full library
        </button>
      </div>

      <div className="space-y-8">
        {learningThemes.map((theme) => (
          <div key={theme.title} className="space-y-4">
            <div>
              <h3 className="text-2xl">{theme.title}</h3>
              <p className="text-sm text-slate-500">{theme.description}</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {theme.paths.slice(0, 3).map((path) => (
                <div key={path.title} className="card flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${path.accent}`}>
                      <BookOpen size={22} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold">{path.title}</h4>
                      <p className="text-xs text-slate-500">{path.modules} modules • {path.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Learning path</span>
                    {path.title === "♻️ Waste & Circular Economy" ? (
                      <Link
                        to="/green-hub/waste-circular"
                        className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80"
                      >
                        Start
                        <ArrowUpRight size={16} />
                      </Link>
                    ) : (
                      <button className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80">
                        Start
                        <ArrowUpRight size={16} />
                      </button>
                    )}
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
    </div>
  );
};
