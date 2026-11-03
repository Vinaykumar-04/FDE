import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GameLinks } from '@/components/GameLinks';
import { LevelGate } from '@/components/LevelGate';
import { LevelProgress } from '@/components/LevelProgress';
import { lessonIdsByLevel, lessonSchema, levels, type LevelId } from '@/lib/content';
import { lessonModules } from '@/lib/lesson-modules';

export const dynamicParams = false;
export function generateStaticParams() { return levels.map((level) => ({ id: level.id })); }

export default async function LevelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const levelIndex = levels.findIndex((entry) => entry.id === id);
  const level = levels[levelIndex];
  if (!level) notFound();
  const levelId = level.id as LevelId;
  const lessons = await Promise.all(lessonIdsByLevel[levelId].map(async (slug) => {
    const lessonModule = await lessonModules[slug as keyof typeof lessonModules]();
    return lessonSchema.parse(lessonModule.lesson);
  }));
  const bossUrl = `/boss/${level.bossId}/`;

  return <div className="page-wrap level-page">
    <Link href="/map/" className="back-link">← Learning path</Link>
    <div className={`level-hero level-hero-${level.code.toLowerCase()}`}>
      <div className="level-hero-top"><span className="level-orbit">{level.code}</span><span className="section-kicker">FIELD LEVEL {levelIndex} · {level.rank.toUpperCase()}</span><span className="level-chip">{levelIndex === 0 ? 'OPEN FOR EXPLORATION' : 'UNLOCKS AFTER PRIOR BOSS'}</span></div>
      <h1>{level.title}<br/><em>{levelIndex === 5 ? 'The field leader.' : 'Build the next skill.'}</em></h1><p>{level.topics}</p>
      <div className="level-hero-bottom"><span>6 LESSONS · {level.games.length} LABS · 1 BOSS</span><span>~45 MIN TOTAL</span></div>
    </div>
    <LevelProgress lessons={lessons} label={`${level.code} · ${level.rank.toUpperCase()} STATUS`} />
    <div className="content-section-heading"><div><span className="section-kicker">01 — LEARN</span><h2>Build the <em>foundations.</em></h2></div><span className="muted-copy">Short lessons. Real field context.</span></div>
    <div className="lesson-list">{lessons.map((lesson, index) => <Link key={lesson.id} className="lesson-row" href={`/lesson/${lesson.id}/`}><span className="lesson-serial">{String(index + 1).padStart(2, '0')}</span><span className="lesson-symbol">◌</span><span className="lesson-main"><b>{lesson.title}</b><small>{lesson.minutes} MIN · {lesson.quiz.length} QUESTION CHECK · {lesson.cards.length} REVIEW CARDS</small></span><span className="lesson-xp">+{lesson.xp} XP</span><span className="row-arrow">↗</span></Link>)}</div>
    <div className="content-section-heading games-heading"><div><span className="section-kicker">02 — PRACTICE</span><h2>Step into the <em>lab.</em></h2></div><span className="muted-copy">Try. Learn. Try again.</span></div>
    <GameLinks games={level.games} />
    <div className="content-section-heading games-heading"><div><span className="section-kicker">03 — PROVE IT</span><h2>Check your <em>field notes.</em></h2></div></div>
    <LevelGate levelId={levelId} items={lessons.map((lesson) => lesson.quiz[0])} />
    <div className="content-section-heading boss-heading"><div><span className="section-kicker">04 — CLEAR THE LEVEL</span><h2>Your field <em>mission.</em></h2></div></div>
    <div className="boss-preview"><div className="boss-preview-icon">◎</div><div><span className="section-kicker">BOSS CHALLENGE · 300 XP</span><h3>{level.boss}</h3><p>Use what you learned to make careful decisions and deliver a clear customer handover.</p></div><Link href={bossUrl} className="button button-blue">Open mission <span>↗</span></Link></div>
  </div>;
}
