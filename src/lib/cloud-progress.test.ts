import { describe, expect, it } from 'vitest';
import { mergeProgress } from './cloud-progress';
import type { Progress } from './progress';

const base: Progress = {
  version: 1, xp: 0, completedLessons: [], quizBest: {}, gameBest: {}, bossPassed: [], badges: [],
  streak: { current: 0, lastDay: '' }, cards: {},
};

describe('mergeProgress', () => {
  it('combines learning from two devices without duplicating earned XP', () => {
    const local = { ...base, xp: 60, completedLessons: ['lesson-one'], quizBest: { 'lesson-one': 3 } };
    const cloud = { ...base, xp: 60, completedLessons: ['lesson-two'], quizBest: { 'lesson-two': 3 } };
    const merged = mergeProgress(local, cloud);
    expect(merged.completedLessons).toEqual(['lesson-one', 'lesson-two']);
    expect(merged.xp).toBe(120);
  });

  it('keeps the best quiz and game results, completed bosses, and latest card review', () => {
    const local = {
      ...base, xp: 500, quizBest: { q: 2 }, gameBest: { g: 50 }, bossPassed: ['L0-recruit'],
      cards: { c: { due: '2026-11-05', step: 2 } },
    };
    const cloud = {
      ...base, xp: 200, quizBest: { q: 3 }, gameBest: { g: 80 }, bossPassed: ['L1-builder'],
      cards: { c: { due: '2026-11-06', step: 2 } },
    };
    const merged = mergeProgress(local, cloud);
    expect(merged.quizBest.q).toBe(3);
    expect(merged.gameBest.g).toBe(80);
    expect(merged.bossPassed).toEqual(['L0-recruit', 'L1-builder']);
    expect(merged.cards.c.due).toBe('2026-11-06');
    expect(merged.xp).toBeGreaterThanOrEqual(500);
  });
});
