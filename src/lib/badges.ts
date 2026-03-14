import { BadgeDefinition } from "../types";

export const badgeCatalog: BadgeDefinition[] = [
  {
    id: "eco-beginner",
    name: "Eco Beginner",
    description: "Started your first verified eco actions.",
    minPoints: 0,
    colorClass: "from-primary-light to-primary",
  },
  {
    id: "recycling-champion",
    name: "Recycling Champion",
    description: "Consistently reduced waste and single-use plastics.",
    minPoints: 150,
    colorClass: "from-cyan-400 to-cyan-600",
  },
  {
    id: "tree-guardian",
    name: "Tree Guardian",
    description: "Built measurable impact through local green actions.",
    minPoints: 300,
    colorClass: "from-lime-400 to-green-600",
  },
  {
    id: "planet-protector",
    name: "Planet Protector",
    description: "Top-tier climate impact leader in your community.",
    minPoints: 500,
    colorClass: "from-amber-400 to-orange-600",
  },
  {
    id: "climate-action-hero",
    name: "Climate Action Hero",
    description: "Elite contributor driving city-scale sustainability outcomes.",
    minPoints: 800,
    colorClass: "from-violet-500 to-indigo-700",
  },
];

export const getUnlockedBadges = (points: number) =>
  badgeCatalog.filter((badge) => points >= badge.minPoints);

export const getNextBadge = (points: number) =>
  badgeCatalog.find((badge) => points < badge.minPoints) ?? null;

export const getLevelLabel = (points: number) => {
  if (points >= 800) return "Earth Champion";
  if (points >= 500) return "Eco Leader";
  if (points >= 300) return "Sustainability Advocate";
  if (points >= 150) return "Green Explorer";
  return "Eco Learner";
};
