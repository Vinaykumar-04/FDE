'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useProgressStore } from '@/lib/progress';
import { quizScoreToXp } from '@/lib/rank';
import type { QuizItem } from '@/lib/content';

export function LessonQuiz({ id, items }: { id: string; items: QuizItem[] }) {
  const [answer, setAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const recordQuiz = useProgressStore((state) => state.recordQuiz);
  const completeLesson = useProgressStore((state) => state.completeLesson);
  const item = items[step];
  function choose(index: number) {
    if (answer !== null) return;
    setAnswer(index);
    if (index === item.answer) setScore((value) => value + 1);
  }
  function next() {
    if (step < items.length - 1) { setStep((value) => value + 1); setAnswer(null); return; }
    const finalScore = score + (answer === item.answer ? 1 : 0);
    recordQuiz(id, finalScore, items.length);
    completeLesson(id, 10);
    setDone(true);
  }
  if (done) return <div className="quiz-result"><span className="result-icon">✦</span><div><b>Lesson complete</b><p>You scored {score} of {items.length}. +10 lesson XP and {quizScoreToXp(score, items.length)} quiz XP added.</p></div><Link className="text-link" href="/map/">Back to the path ↗</Link></div>;
  return <section className="quiz-card" aria-labelledby="quiz-title">
    <div className="quiz-heading"><div><span className="section-kicker">QUICK CHECK · {String(step + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</span><h2 id="quiz-title">Let’s lock it in.</h2></div><span className="quiz-count">{step + 1}<i> / {items.length}</i></span></div>
    <p className="quiz-question">{item.question}</p>
    <div className="quiz-options">{item.choices.map((choice, index) => <button key={choice} className={`quiz-option ${answer === index ? (index === item.answer ? 'correct' : 'incorrect') : ''}`} onClick={() => choose(index)} disabled={answer !== null}><span className="option-letter">{String.fromCharCode(65 + index)}</span>{choice}<span className="option-check">{answer === index ? (index === item.answer ? '✓' : '×') : '↗'}</span></button>)}</div>
    {answer !== null && <div className={`answer-note ${answer === item.answer ? 'good' : 'try-again'}`} role="status"><b>{answer === item.answer ? 'That’s it.' : 'Not quite.'}</b> {item.explanation}<button onClick={next}>{step === items.length - 1 ? 'Finish lesson' : 'Next question'} <span>→</span></button></div>}
  </section>;
}
