const ICEBREAKERS = [
  "If you could live anywhere in the world for a year, where would it be?",
  "What's the most underrated movie you've ever watched?",
  "You're stuck on a desert island with one album — which one?",
  "What's a skill you wish you could learn overnight?",
  "Hot take: what's an unpopular opinion you hold?",
  "What's the best meal you've ever had?",
  "If you could have dinner with any person, alive or dead, who would it be?",
  "What's the last thing that made you genuinely laugh?",
  "Are you a morning person or a night owl?",
  "What's your go-to comfort show?",
  "If you could time-travel to any era, when would you go?",
  "What's the weirdest fun fact you know?",
  "What hobby have you always wanted to pick up?",
  "Cats or dogs? (This is important.)",
  "What's a song that never gets old for you?",
  "What's the most adventurous thing you've ever done?",
  "If you could master any instrument overnight, which one?",
  "What's your favorite way to spend a rainy day?",
];

export function getRandomIcebreakers(count: number = 3): string[] {
  const shuffled = [...ICEBREAKERS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
