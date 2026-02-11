export function getOccasionEmoji(occasion: string): string {
  const map: Record<string, string> = {
    birthday: "🎂",
    valentine: "💕",
    anniversary: "💍",
    appreciation: "🌟",
    friendship: "🤝",
    other: "✨",
  };
  return map[occasion] || "✨";
}

export function getOccasionGradient(occasion: string): string {
  const map: Record<string, string> = {
    birthday: "from-amber-50 via-guardian-cream to-orange-50",
    valentine: "from-rose-50 via-pink-50 to-guardian-cream",
    anniversary: "from-guardian-cream via-amber-50 to-yellow-50",
    appreciation: "from-guardian-cream via-emerald-50 to-teal-50",
    friendship: "from-sky-50 via-guardian-cream to-indigo-50",
    other: "from-guardian-cream via-purple-50 to-guardian-warmWhite",
  };
  return map[occasion] || map.other;
}