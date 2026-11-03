import { describe, expect, it } from 'vitest';
import { levelIsUnlocked, quizScoreToXp, rankForXp, scoreToXp } from './rank';

describe('academy progression', () => {
  it('maps total XP to the right rank', () => {
    expect(rankForXp(0)).toBe('Recruit');
    expect(rankForXp(500)).toBe('Builder');
    expect(rankForXp(8000)).toBe('FDE Hero');
  });
  it('keeps a level locked until the previous boss is passed', () => {
    expect(levelIsUnlocked(0, [], ['L0', 'L1'])).toBe(true);
    expect(levelIsUnlocked(1, [], ['L0', 'L1'])).toBe(false);
    expect(levelIsUnlocked(1, ['L0'], ['L0', 'L1'])).toBe(true);
  });
  it('maps a game score to XP', () => {
    expect(scoreToXp(3, 5)).toBe(60);
    expect(scoreToXp(0, 0)).toBe(0);
  });
  it('keeps quiz XP between 20 and 50 points', () => {
    expect(quizScoreToXp(0, 3)).toBe(20);
    expect(quizScoreToXp(3, 3)).toBe(50);
  });
});
