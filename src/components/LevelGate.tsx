'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { QuizItem } from '@/lib/content';
import { gateKey, lessonIdsByLevel, levels } from '@/lib/content';
import { useProgressStore } from '@/lib/progress';
import { quizScoreToXp } from '@/lib/rank';

export function LevelGate({ levelId, items }: { levelId: keyof typeof lessonIdsByLevel; items: QuizItem[] }) {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState<number | null>(null);
  const completed = useProgressStore((state) => state.completedLessons);
  const quizBest = useProgressStore((state) => state.quizBest);
  const recordQuiz = useProgressStore((state) => state.recordQuiz);
  const levelIndex = levels.findIndex((level) => level.id === levelId);
  const allLessonsDone = lessonIdsByLevel[levelId].every((id) => completed.includes(id));
  const gatePassed = (quizBest[gateKey(levelId)] ?? 0) >= 5;
  const item = items[step];

  function choose(index: number) {
    if (choice !== null) return;
    setChoice(index);
    if (index === item.answer) setScore((value) => value + 1);
  }
  function next() {
    if (step < items.length - 1) { setStep((value) => value + 1); setChoice(null); return; }
    const finalScore = score + (choice === item.answer ? 1 : 0);
    recordQuiz(gateKey(levelId), finalScore, items.length);
    setResult(finalScore);
  }
  function retry() { setStep(0); setChoice(null); setScore(0); setResult(null); setStarted(true); }

  return <section id="quiz-gate" className="gate-card"><div className="gate-heading"><div><span className="section-kicker">02 — QUIZ GATE · {levelIndex + 1} OF 6</span><h2>Check your <em>field notes.</em></h2></div><span className="gate-emblem">⌑</span></div>
    {!allLessonsDone && !gatePassed ? <div className="gate-locked"><p>Complete all {lessonIdsByLevel[levelId].length} lessons to open this quiz. <b>{lessonIdsByLevel[levelId].filter((id) => completed.includes(id)).length} complete so far.</b></p><div className="gate-progress"><span style={{ width: `${(lessonIdsByLevel[levelId].filter((id) => completed.includes(id)).length / lessonIdsByLevel[levelId].length) * 100}%` }}/></div></div>
      : gatePassed && result === null ? <div className="gate-passed"><span>✓</span><div><b>QUIZ GATE CLEARED</b><p>Your best score is {quizBest[gateKey(levelId)]} of 6. The boss challenge is open.</p></div><Link className="button button-blue" href={`/boss/${levels[levelIndex].bossId}/`}>Enter boss challenge <span>↗</span></Link></div>
      : result !== null ? <div className={`gate-result ${result >= 5 ? 'passed' : ''}`}><span className="section-kicker">YOUR SCORE · {result} / 6</span><b>{result >= 5 ? 'Gate cleared.' : 'Not quite yet.'}</b><p>{result >= 5 ? 'You scored at least 5 of 6. The boss challenge is now open.' : 'Review the lesson notes and try again. You need 5 correct answers to pass.'} {quizScoreToXp(result, items.length)} quiz XP earned.</p>{result >= 5 ? <Link className="button button-blue" href={`/boss/${levels[levelIndex].bossId}/`}>Enter boss challenge <span>↗</span></Link> : <button className="button button-outline" onClick={retry}>Retry the quiz <span>↻</span></button>}</div>
      : started ? <><div className="gate-question-meta"><span>QUESTION {String(step + 1).padStart(2, '0')} / 06</span><span>PASS WITH 5 CORRECT</span></div><p className="quiz-question">{item.question}</p><div className="quiz-options">{item.choices.map((text, index) => <button key={text} className={`quiz-option ${choice === index ? (index === item.answer ? 'correct' : 'incorrect') : ''}`} disabled={choice !== null} onClick={() => choose(index)}><span className="option-letter">{String.fromCharCode(65 + index)}</span>{text}<span className="option-check">{choice === index ? (index === item.answer ? '✓' : '×') : '↗'}</span></button>)}</div>{choice !== null && <div className={`answer-note ${choice === item.answer ? 'good' : 'try-again'}`} role="status"><b>{choice === item.answer ? 'That’s it.' : 'Not quite.'}</b> {item.explanation}<button onClick={next}>{step === items.length - 1 ? 'Finish quiz' : 'Next question'} <span>→</span></button></div>}<button className="gate-exit" onClick={() => setStarted(false)}>Pause quiz and return later</button></>
      : <div className="gate-start"><p>Six questions, one from each lesson. Score at least 5 to unlock your boss challenge.</p><button className="button button-blue" onClick={() => { setStep(0); setScore(0); setChoice(null); setStarted(true); }}>Start level quiz <span>↗</span></button></div>}
  </section>;
}
