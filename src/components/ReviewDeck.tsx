'use client';

import { useState } from 'react';
import Link from 'next/link';

type Card = { front: string; back: string };
export function ReviewDeck({ cards }: { cards: Card[] }) {
  const [index, setIndex] = useState(0); const [revealed, setRevealed] = useState(false); const [complete, setComplete] = useState(false);
  const card = cards[index];
  function next() { if (index >= cards.length - 1) { setComplete(true); return; } setIndex((n) => n + 1); setRevealed(false); }
  if (complete) return <div className="review-complete"><span className="result-icon">✦</span><span className="section-kicker">DRILL COMPLETE</span><h2>Good recall.</h2><p>You reviewed three field notes. Come back tomorrow to keep them fresh.</p><Link className="button button-blue" href="/map/">Return to your path ↗</Link></div>;
  return <div className="review-session"><div className="review-card-meta"><span>CARD {String(index + 1).padStart(2, '0')} / {String(cards.length).padStart(2, '0')}</span><span>LEVEL 0 · RECRUIT</span></div><button className={`flashcard ${revealed ? 'revealed' : ''}`} onClick={() => setRevealed(true)} aria-label={revealed ? 'Answer revealed' : 'Reveal answer'}><span className="flashcard-symbol">{revealed ? '✦' : '?'}</span><span className="section-kicker">{revealed ? 'THE FIELD NOTE' : 'PAUSE. RECALL. THEN REVEAL.'}</span><b>{revealed ? card.back : card.front}</b><small>{revealed ? 'TAKE A BREATH. LET IT SETTLE.' : 'CLICK TO REVEAL'}</small></button>{revealed && <button className="button button-blue review-next" onClick={next}>{index === cards.length - 1 ? 'Finish drill' : 'Next card'} <span>→</span></button>}</div>;
}
