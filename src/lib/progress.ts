import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { z } from 'zod';
import { quizScoreToXp } from './rank';

export const progressSchema = z.object({
  version: z.literal(1), xp: z.number().nonnegative(), completedLessons: z.array(z.string()),
  quizBest: z.record(z.string(), z.number().nonnegative()), gameBest: z.record(z.string(), z.number().nonnegative()),
  bossPassed: z.array(z.string()), badges: z.array(z.string()),
  streak: z.object({ current: z.number().nonnegative(), lastDay: z.string() }),
  cards: z.record(z.string(), z.object({ due: z.string(), step: z.number().int().nonnegative() })),
});

export type Progress = {
  version: 1;
  xp: number;
  completedLessons: string[];
  quizBest: Record<string, number>;
  gameBest: Record<string, number>;
  bossPassed: string[];
  badges: string[];
  streak: { current: number; lastDay: string };
  cards: Record<string, { due: string; step: number }>;
};

const emptyProgress: Progress = {
  version: 1, xp: 0, completedLessons: [], quizBest: {}, gameBest: {},
  bossPassed: [], badges: [], streak: { current: 0, lastDay: '' }, cards: {},
};

type Store = Progress & {
  completeLesson: (id: string, xp: number) => void;
  recordQuiz: (id: string, score: number, total?: number) => void;
  recordGame: (id: string, xp: number) => void;
  passBoss: (id: string) => void;
  replaceProgress: (progress: Progress) => void;
  exportProgress: () => string;
  importProgress: (json: string) => boolean;
};

export const useProgressStore = create<Store>()(persist((set, get) => ({
  ...emptyProgress,
  completeLesson: (id, xp) => set((state) => state.completedLessons.includes(id) ? state : {
    completedLessons: [...state.completedLessons, id], xp: state.xp + xp,
    badges: state.badges.includes('first-lesson') ? state.badges : [...state.badges, 'first-lesson'],
  }),
  recordQuiz: (id, score, total = 3) => set((state) => {
    const previous = state.quizBest[id];
    const best = Math.max(score, previous ?? 0);
    const previousXp = previous === undefined ? 0 : quizScoreToXp(previous, total);
    const nextXp = quizScoreToXp(best, total);
    return { quizBest: { ...state.quizBest, [id]: best }, xp: state.xp + Math.max(0, nextXp - previousXp) };
  }),
  recordGame: (id, xp) => set((state) => {
    const previous = state.gameBest[id] ?? 0;
    const best = Math.max(previous, xp);
    return { gameBest: { ...state.gameBest, [id]: best }, xp: state.xp + best - previous };
  }),
  passBoss: (id) => set((state) => state.bossPassed.includes(id) ? state : { bossPassed: [...state.bossPassed, id], xp: state.xp + 300 }),
  replaceProgress: (progress) => set(progress),
  exportProgress: () => JSON.stringify({
    version: get().version, xp: get().xp, completedLessons: get().completedLessons,
    quizBest: get().quizBest, gameBest: get().gameBest, bossPassed: get().bossPassed,
    badges: get().badges, streak: get().streak, cards: get().cards,
  }, null, 2),
  importProgress: (json) => {
    try {
      const parsed = progressSchema.safeParse(JSON.parse(json));
      if (!parsed.success) return false;
      set(parsed.data); return true;
    } catch { return false; }
  },
}), { name: 'fde-hero-progress', version: 1, storage: createJSONStorage(() => localStorage) }));

export function parseProgressSnapshot(value: unknown): Progress | null {
  const parsed = progressSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

export function progressSnapshot(state: Progress): Progress {
  return {
    version: state.version, xp: state.xp, completedLessons: state.completedLessons,
    quizBest: state.quizBest, gameBest: state.gameBest, bossPassed: state.bossPassed,
    badges: state.badges, streak: state.streak, cards: state.cards,
  };
}
