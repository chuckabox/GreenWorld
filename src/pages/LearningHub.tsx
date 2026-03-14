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
        slug: "ocean-marine",
        duration: "15 mins",
        points: 8,
        accent: "bg-blue-50 text-blue-700",
      },
      {
        title: "🌳 Forests & Biodiversity",
        slug: "forests-biodiversity",
        duration: "12 mins",
        points: 6,
        accent: "bg-emerald-50 text-emerald-700",
      },
      {
        title: "🐝 Wildlife & Ecosystems",
        slug: "wildlife-ecosystems",
        duration: "10 mins",
        points: 5,
        accent: "bg-amber-50 text-amber-700",
      },
      {
        title: "🌱 Soil & Agriculture",
        slug: "soil-agriculture",
        duration: "8 mins",
        points: 4,
        accent: "bg-lime-50 text-lime-700",
      },
      {
        title: "💧 Water Resources",
        slug: "water-resources",
        duration: "14 mins",
        points: 7,
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
        slug: "energy-climate",
        duration: "18 mins",
        points: 9,
        accent: "bg-amber-50 text-amber-700",
      },
      {
        title: "♻️ Waste & Circular Economy",
        slug: "waste-circular",
        duration: "10 mins",
        points: 5,
        accent: "bg-emerald-50 text-emerald-700",
      },
      {
        title: "🚲 Sustainable Cities & Transport",
        slug: "sustainable-cities",
        duration: "16 mins",
        points: 8,
        accent: "bg-blue-50 text-blue-700",
      },
      {
        title: "🍎 Food & Sustainable Consumption",
        slug: "food-consumption",
        duration: "12 mins",
        points: 6,
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
        slug: "green-innovation",
        duration: "14 mins",
        points: 7,
        accent: "bg-violet-50 text-violet-700",
      },
      {
        title: "🌍 Climate Action & Policy",
        slug: "climate-policy",
        duration: "15 mins",
        points: 8,
        accent: "bg-slate-50 text-slate-700",
      },
      {
        title: "🤝 Community Sustainability",
        slug: "community-sustainability",
        duration: "9 mins",
        points: 4,
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
                <Link
                  key={path.title}
                  to={`/learning/${path.slug}`}
                  className="card flex flex-col gap-4 hover:border-primary/30 transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${path.accent}`}>
                        <BookOpen size={22} />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold group-hover:text-primary transition-colors">{path.title}</h4>
                        <p className="text-xs text-slate-500 font-medium">
                          {path.duration} • <span className="text-amber-600 font-bold">{path.points} pts</span>
                        </p>
                      </div>
                    </div>
                    <ArrowUpRight size={20} className="text-slate-300 group-hover:text-primary transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
