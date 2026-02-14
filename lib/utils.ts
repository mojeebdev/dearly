export function getOccasionEmoji(occasion: string): string {
  const map: Record<string, string> = {
    birthday: "🎂",
    valentine: "💝",
    anniversary: "💍",
    appreciation: "🌟",
    friendship: "🤝",
    graduation: "🎓", 
    success: "🏆",    
    get_well: "🌸",
    other: "✨",
  };
  
  
  const key = occasion?.toLowerCase();
  return map[key] || "✨";
}

export function getOccasionGradient(occasion: string): string {
  const map: Record<string, string> = {
    birthday: "from-amber-50 via-guardian-cream to-orange-50",
    valentine: "from-rose-50 via-pink-50 to-guardian-cream",
    anniversary: "from-guardian-cream via-amber-50 to-yellow-50",
    appreciation: "from-guardian-cream via-emerald-50 to-teal-50",
    friendship: "from-sky-50 via-guardian-cream to-indigo-50",
    graduation: "from-blue-50 via-guardian-cream to-indigo-50",
    success: "from-yellow-50 via-guardian-goldLight/20 to-amber-50",
    other: "from-guardian-cream via-purple-50 to-guardian-warmWhite",
  };

  const key = occasion?.toLowerCase();
  return map[key] || map.other;
}