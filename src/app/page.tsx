import Link from 'next/link';
import { FieldHero } from '@/components/FieldHero';
import { levels, lessonIds } from '@/lib/content';

export default function HomePage() {
  return <>
    <FieldHero />
    <section className="home-intro section-pad">
      <div className="section-topline"><span className="section-kicker">THE ACADEMY</span><span>01 / 03</span></div>
      <div className="intro-grid"><div><h2>From first command<br />to <em>field-ready.</em></h2></div><div className="intro-copy"><p>Forward Deployed Engineers turn customer problems into working software. This is a practical path to learn the craft: understand the need, build the connection, and make it work where it matters.</p><Link href="/map/" className="text-link">Explore the learning path <span>↗</span></Link></div></div>
    </section>
    <section className="path-preview section-pad">
      <div className="section-topline"><span className="section-kicker">THE FIELD GUIDE</span><span>6 LEVELS · ONE JOURNEY</span></div>
      <div className="path-heading"><div><h2>Choose your<br /><em>next move.</em></h2></div><p>Each level builds on the one before it. Learn a concept, try it in a lab, and earn your next rank.</p><Link href="/map/" className="round-link" aria-label="View the full learning map">↗</Link></div>
      <div className="level-strip">{levels.map((level, index) => <Link key={level.id} href={index === 0 ? `/level/${level.id}/` : '/map/'} className={`level-tile level-${level.code.toLowerCase()} ${index > 0 ? 'locked-tile' : ''}`}><span className="tile-number">{level.code}</span><span className="tile-orbit">{index === 0 ? '◉' : '◎'}</span><b>{level.rank}</b><small>{level.topics.split(',').slice(0, 2).join(' · ')}</small><span className="tile-arrow">↗</span></Link>)}</div>
      <div className="path-caption"><span><span className="saffron-dot" /> YOUR FIRST STEP IS OPEN</span><span>{lessonIds.length} LEVEL 0 LESSONS READY</span></div>
    </section>
    <section className="daily-prompt section-pad">
      <div className="daily-card"><div className="daily-card-art"><span className="orbit orbit-one"/><span className="orbit orbit-two"/><span className="daily-center">✦</span><span className="daily-stamp">FIELD<br/>DRILL<br/>001</span></div><div className="daily-copy"><span className="section-kicker">SMALL STEPS. STRONG SIGNAL.</span><h2>Keep the signal.<br/><em>Build the habit.</em></h2><p>Three quick review cards bring important ideas back just before they fade.</p><Link className="button button-blue" href="/review/">Start today’s drill <span>↗</span></Link></div></div>
    </section>
    <section className="interview-teaser section-pad"><div><span className="section-kicker">NEXT: YOUR CAREER</span><h2>Take your skills<br />to the <em>field.</em></h2></div><p>Practice real FDE interview scenarios, explore current role listings, and learn how to present your work.</p><Link className="button button-outline" href="/interview/">Open the career guide <span>↗</span></Link></section>
  </>;
}
