'use client';

import Link from 'next/link';
import { useState } from 'react';
import { gameById } from '@/lib/games';
import { useProgressStore } from '@/lib/progress';
import { scoreToXp } from '@/lib/rank';

export function FieldLab({ gameId }: { gameId: string }) {
  const game = gameById[gameId];
  const [step, setStep] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [paused, setPaused] = useState(false);
  const recordGame = useProgressStore((state) => state.recordGame);
  if (!game) return <div className="lab-result"><h2>Lab not found.</h2><Link href="/map/">Return to the map</Link></div>;
  const item = game.prompts[step];
  const xp = scoreToXp(score, game.prompts.length);
  const finish = () => { recordGame(game.id, xp); setDone(true); };
  function answer(index: number) { if (choice !== null) return; setChoice(index); if (index === item.answer) setScore((value) => value + 1); }
  function next() { if (step === game.prompts.length - 1) finish(); else { setStep((value) => value + 1); setChoice(null); } }
  if (done) return <div className="lab-result"><span className="result-icon">✦</span><span className="section-kicker">FIELD LAB COMPLETE</span><h2>Good work in the field.</h2><p>You scored {score} of {game.prompts.length}. That’s <b>{xp} XP potential.</b></p><Link className="button button-blue" href={`/level/${game.levelId}/`}>Back to your level <span>↗</span></Link></div>;
  if (paused) return <div className="lab-result"><span className="section-kicker">LAB PAUSED</span><h2>Take a breath.</h2><p>Your current clue is still here when you return.</p><div className="hero-buttons"><button className="button button-blue" onClick={() => setPaused(false)}>Resume lab <span>→</span></button><Link className="button button-outline" href={`/level/${game.levelId}/`}>Exit to level</Link></div></div>;
  return <section className="lab-interaction"><div className="lab-progress"><span>CHALLENGE {String(step + 1).padStart(2, '0')} / {String(game.prompts.length).padStart(2, '0')}</span><button className="pause-button" onClick={() => setPaused(true)}>Ⅱ Pause</button></div><h2>{item.text}</h2><div className="quiz-options">{item.choices.map((text, index) => <button key={text} className={`quiz-option ${choice === index ? (index === item.answer ? 'correct' : 'incorrect') : ''}`} onClick={() => answer(index)} disabled={choice !== null}><span className="option-letter">{String.fromCharCode(65 + index)}</span>{text}<span className="option-check">{choice === index ? (index === item.answer ? '✓' : '×') : '↗'}</span></button>)}</div>{choice !== null && <div className={`answer-note ${choice === item.answer ? 'good' : 'try-again'}`} role="status"><b>{choice === item.answer ? 'Correct.' : 'Keep the clue.'}</b> {item.why}<button onClick={next}>{step === game.prompts.length - 1 ? 'Finish lab' : 'Next clue'} <span>→</span></button></div>}<div className="lab-score"><span>YOUR SCORE</span><b>{scoreToXp(score, game.prompts.length)} <small>XP POTENTIAL</small></b></div></section>;
}
