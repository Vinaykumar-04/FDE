'use client';

import Link from 'next/link';
import { lessonIdsByLevel, levels } from '@/lib/content';
import { useProgressStore } from '@/lib/progress';
import { ProgressBar } from '@/components/Shell';

export default function MapPage() {
  const { xp, bossPassed, completedLessons } = useProgressStore();
  const currentRank = xp >= 8000 ? 'FDE Hero' : xp >= 5000 ? 'Field Operator' : xp >= 3000 ? 'AI Engineer' : xp >= 1500 ? 'Integrator' : xp >= 500 ? 'Builder' : 'Recruit';
  return <div className="page-wrap map-page">
    <div className="page-heading"><div><span className="section-kicker">YOUR FIELD GUIDE · 6 LEVELS</span><h1>Learning <em>path</em></h1></div><div className="rank-summary"><span className="rank-emblem">✦</span><div><small>CURRENT RANK</small><b>{currentRank}</b></div><span className="xp-total">{xp} XP</span></div></div>
    <div className="map-progress"><div><span className="section-kicker">FIELD PROGRESS</span><p>One mission at a time. Your progress saves on this device.</p></div><ProgressBar value={completedLessons.length} max={Object.values(lessonIdsByLevel).flat().length} label="Academy lesson progress"/></div>
    <div className="roadmap">{levels.map((level, index) => {
      const unlocked = index === 0 || bossPassed.includes(levels[index - 1].id);
      return <article key={level.id} className={`road-node ${unlocked ? 'is-open' : 'is-locked'}`}><div className="road-marker"><span>{unlocked ? level.code : '⌑'}</span></div><div className="road-content"><div className="road-meta"><span>{level.code} · {level.rank.toUpperCase()}</span><span className={unlocked ? 'open-status' : 'locked-status'}>{unlocked ? (index === 0 ? 'OPEN NOW' : 'UNLOCKED') : 'LOCKED'}</span></div><h2>{level.title}</h2><p>{level.topics}</p><div className="road-bottom"><div className="road-chips"><span>6 lessons</span><span>{level.games.length} field labs</span><span>1 boss challenge</span></div>{unlocked ? <Link href={`/level/${level.id}/`} className="round-link small-round" aria-label={`Open ${level.rank}`}>↗</Link> : <span className="lock-hint">Pass previous boss to unlock</span>}</div></div><div className="road-index">0{index + 1}</div></article>;
    })}</div>
    <div className="map-footer-note"><span className="saffron-dot"/> Every level opens after you complete the boss challenge before it.</div>
  </div>;
}
