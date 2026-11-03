export const ranks = [
  { name: 'Recruit', threshold: 0 },
  { name: 'Builder', threshold: 500 },
  { name: 'Integrator', threshold: 1500 },
  { name: 'AI Engineer', threshold: 3000 },
  { name: 'Field Operator', threshold: 5000 },
  { name: 'FDE Hero', threshold: 8000 },
] as const;

export function rankForXp(xp: number) {
  return [...ranks].reverse().find((rank) => xp >= rank.threshold)?.name ?? 'Recruit';
}

export function levelIsUnlocked(levelIndex: number, bossesPassed: string[], levelIds: readonly string[]) {
  return levelIndex === 0 || bossesPassed.includes(levelIds[levelIndex - 1] ?? '');
}

export function scoreToXp(correct: number, total: number, maximum = 100) {
  if (total <= 0) return 0;
  return Math.round((Math.max(0, Math.min(correct, total)) / total) * maximum);
}

export function quizScoreToXp(correct: number, total: number) {
  if (total <= 0) return 0;
  const bounded = Math.max(0, Math.min(correct, total));
  return 20 + Math.round((bounded / total) * 30);
}
