import { BadgeDefinition } from "../types";

export const toRoman = (num: number): string => {
  const lookup: { [key: string]: number } = {
    M: 1000,
    CM: 900,
    D: 500,
    CD: 400,
    C: 100,
    XC: 90,
    L: 50,
    XL: 40,
    X: 10,
    IX: 9,
    V: 5,
    IV: 4,
    I: 1,
  };
  let roman = "";
  for (const i in lookup) {
    while (num >= lookup[i]) {
      roman += i;
      num -= lookup[i];
    }
  }
  return roman;
};

export const getLevelLabel = (points: number) => {
  const level = Math.floor(points / 500) + 1;
  return `Sustainability Badge ${toRoman(level)}`;
};

export const badgeCatalog: BadgeDefinition[] = []; // Empty or keep minimal as fallback

export const getUnlockedBadges = (points: number) => []; // No longer using static list
export const getNextBadge = (points: number) => null; // Using progression bar instead
