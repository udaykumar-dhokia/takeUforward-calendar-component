export interface MonthMeta {
  image: string;
  season: string;
  accent: string;
  description: string;
}

export const MONTH_IMAGES: Record<number, MonthMeta> = {
  0: {
    image: "/images/months/jan.jpg",
    season: "Winter",
    accent: "#7BA7BC",
    description: "Frost-kissed mornings and new beginnings",
  },
  1: {
    image: "/images/months/feb.jpg",
    season: "Winter",
    accent: "#C4848A",
    description: "Love in the air, warmth in the heart",
  },
  2: {
    image: "/images/months/mar.jpg",
    season: "Spring",
    accent: "#8BA888",
    description: "The world awakens, green returns",
  },
  3: {
    image: "/images/months/apr.jpg",
    season: "Spring",
    accent: "#9B8EC4",
    description: "Gentle rains bring vibrant life",
  },
  4: {
    image: "/images/months/may.jpg",
    season: "Spring",
    accent: "#C4775A",
    description: "Blossoms paint the world in color",
  },
  5: {
    image: "/images/months/jun.jpg",
    season: "Summer",
    accent: "#D4A574",
    description: "Golden light and endless days",
  },
  6: {
    image: "/images/months/jul.jpg",
    season: "Summer",
    accent: "#C4775A",
    description: "Sunlit adventures and warm nights",
  },
  7: {
    image: "/images/months/aug.jpg",
    season: "Summer",
    accent: "#D4A574",
    description: "Late summer haze and harvest's promise",
  },
  8: {
    image: "/images/months/sep.jpg",
    season: "Autumn",
    accent: "#C4775A",
    description: "Amber leaves and crisp beginnings",
  },
  9: {
    image: "/images/months/oct.jpg",
    season: "Autumn",
    accent: "#D4A574",
    description: "Golden forests and cozy evenings",
  },
  10: {
    image: "/images/months/nov.jpg",
    season: "Autumn",
    accent: "#8BA888",
    description: "Gratitude fills the cooling air",
  },
  11: {
    image: "/images/months/dec.jpg",
    season: "Winter",
    accent: "#7BA7BC",
    description: "Magic in the frosty twilight",
  },
};

export function getMonthMeta(month: number): MonthMeta {
  return MONTH_IMAGES[month];
}
