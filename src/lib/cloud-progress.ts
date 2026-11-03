import { quizScoreToXp } from './rank';
import type { Progress } from './progress';

function mergeRecord(left: Record<string, number>, right: Record<string, number>) {
  const result = { ...left };
  for (const [key, value] of Object.entries(right)) result[key] = Math.max(result[key] ?? 0, value);
  return result;
}

function mergeCards(left: Progress['cards'], right: Progress['cards']): Progress['cards'] {
  const result = { ...left };
  for (const [id, incoming] of Object.entries(right)) {
    const existing = result[id];
    if (!existing || incoming.step > existing.step || (incoming.step === existing.step && incoming.due > existing.due)) result[id] = incoming;
  }
  return result;
}

export function mergeProgress(local: Progress, cloud: Progress): Progress {
  const completedLessons = [...new Set([...local.completedLessons, ...cloud.completedLessons])];
  const quizBest = mergeRecord(local.quizBest, cloud.quizBest);
  const gameBest = mergeRecord(local.gameBest, cloud.gameBest);
  const bossPassed = [...new Set([...local.bossPassed, ...cloud.bossPassed])];
  const badges = [...new Set([...local.badges, ...cloud.badges])];
  const streak = local.streak.lastDay > cloud.streak.lastDay ? local.streak : cloud.streak.lastDay > local.streak.lastDay
    ? cloud.streak : { current: Math.max(local.streak.current, cloud.streak.current), lastDay: local.streak.lastDay };
  const derivedXp = completedLessons.length * 10
    + Object.entries(quizBest).reduce((sum, [key, score]) => sum + quizScoreToXp(score, key.startsWith('gate:') ? 6 : 3), 0)
    + Object.values(gameBest).reduce((sum, score) => sum + score, 0)
    + bossPassed.length * 300;

  return {
    version: 1,
    xp: Math.max(local.xp, cloud.xp, derivedXp),
    completedLessons, quizBest, gameBest, bossPassed, badges, streak,
    cards: mergeCards(local.cards, cloud.cards),
  };
}
