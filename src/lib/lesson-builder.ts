import type { Lesson } from './content';

export type LessonDraft = {
  id: string; title: string; minutes: number; xp: number;
  why: string; concept: string; analogy: string; example: string;
  mistake: string; nextStep: string; distractor: string;
};

function arrange(correct: string, distractors: string[], seed: number) {
  const options = [correct, ...distractors];
  const shift = seed % options.length;
  return {
    choices: options.map((_, index) => options[(index + shift) % options.length]),
    answer: (options.length - shift) % options.length,
  };
}

export function buildLesson(draft: LessonDraft): Lesson & LessonDraft {
  const seed = draft.id.split('').reduce((sum, character) => sum + character.charCodeAt(0), 0);
  const q1 = arrange(draft.concept, [draft.distractor, 'It is only a job title and has no practical use.'], seed);
  const q2 = arrange(draft.nextStep, [draft.mistake, 'Skip the customer context and change production immediately.'], seed + 1);
  const q3 = arrange(draft.mistake, [draft.distractor, 'Writing down assumptions before making a change.'], seed + 2);
  const quiz = [
    { question: `Which statement best describes ${draft.title.toLowerCase()}?`, ...q1, explanation: draft.concept },
    { question: `In this situation: ${draft.example} What is the safest useful next step?`, ...q2, explanation: draft.nextStep },
    { question: `Which risk should you watch for when working with ${draft.title.toLowerCase()}?`, ...q3, explanation: draft.mistake },
  ];
  const cards = [
    { front: `What should you remember about ${draft.title.toLowerCase()}?`, back: draft.concept },
    { front: 'What is the safest next step in the field?', back: draft.nextStep },
    { front: 'Which mistake should you avoid?', back: draft.mistake },
  ];
  return { ...draft, quiz, cards };
}
