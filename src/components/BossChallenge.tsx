'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Boss } from '@/lib/bosses';
import { gateKey, levels } from '@/lib/content';
import { useProgressStore } from '@/lib/progress';

export function BossChallenge({ boss }: { boss: Boss }) {
  const [step, setStep] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const passBoss = useProgressStore((state) => state.passBoss);
  const quizBest = useProgressStore((state) => state.quizBest);
  const bossPassed = useProgressStore((state) => state.bossPassed);
  const levelIndex = levels.findIndex((level) => level.id === boss.levelId);
  const previousLevel = levels[levelIndex - 1];
  const previousBossPassed = !previousLevel || bossPassed.includes(previousLevel.id);
  const gatePassed = (quizBest[gateKey(boss.levelId)] ?? 0) >= 5;
  const alreadyPassed = bossPassed.includes(boss.levelId);
  const scenario = boss.steps[step];

  function pick(index: number) {
    if (choice !== null) return;
    setChoice(index);
    if (index === scenario.answer && step === boss.steps.length - 1) passBoss(boss.levelId);
  }
  function next() {
    if (choice === scenario.answer) setStep((value) => value + 1);
    setChoice(null);
  }

  if (!previousBossPassed) return <section className="boss-card boss-locked"><span className="section-kicker">MISSION LOCKED</span><h2>Clear the previous level first.</h2><p>Pass the boss challenge in {previousLevel?.rank} to unlock this mission.</p><Link className="button button-outline" href="/map/">Return to the learning path <span>↗</span></Link></section>;
  if (!gatePassed && !alreadyPassed) return <section className="boss-card boss-locked"><span className="section-kicker">MISSION LOCKED</span><h2>Pass your level quiz first.</h2><p>Complete the lessons and score at least 5 of 6 on the level quiz to open this boss challenge.</p><Link className="button button-blue" href={`/level/${boss.levelId}/#quiz-gate`}>Go to the quiz gate <span>↗</span></Link></section>;
  if (alreadyPassed || step >= boss.steps.length) return <section className="boss-card boss-success"><span className="result-icon">✦</span><b>MISSION COMPLETE</b><h2>{boss.title}</h2><p>Level cleared. The next level is now unlocked. +300 XP earned.</p><Link className="button button-blue" href="/map/">See your progress ↗</Link></section>;

  return <section className="boss-card"><div className="boss-label"><span className="boss-sigil">◎</span><span>{boss.levelId.slice(0, 2)} · BOSS CHALLENGE · 300 XP</span></div><h2>{boss.title}</h2><p className="boss-intro">{boss.intro}</p><div className="boss-step"><span>DECISION {step + 1} / {boss.steps.length}</span><b>{scenario.prompt}</b></div><div className="quiz-options">{scenario.choices.map((text, index) => <button key={text} className={`quiz-option ${choice === index ? (index === scenario.answer ? 'correct' : 'incorrect') : ''}`} onClick={() => pick(index)} disabled={choice !== null}><span className="option-letter">{String.fromCharCode(65 + index)}</span>{text}<span className="option-check">{choice === index ? (index === scenario.answer ? '✓' : '×') : '↗'}</span></button>)}</div>{choice !== null && <div className={`answer-note ${choice === scenario.answer ? 'good' : 'try-again'}`} role="status"><b>{choice === scenario.answer ? 'Good call.' : 'Review the clue.'}</b> {scenario.why}<button onClick={next}>{choice === scenario.answer ? (step === boss.steps.length - 1 ? 'Finish mission' : 'Continue') : 'Try this decision again'} <span>→</span></button></div>}</section>;
}
