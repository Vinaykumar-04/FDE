import Link from 'next/link';
import { notFound } from 'next/navigation';
import { lessonIds, lessonIdsByLevel, lessonSchema, levels } from '@/lib/content';
import { lessonModules } from '@/lib/lesson-modules';
import { LessonQuiz } from '@/components/LessonQuiz';

export const dynamicParams = false;
export function generateStaticParams() { return lessonIds.map((slug) => ({ slug })); }

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const load = lessonModules[slug as keyof typeof lessonModules];
  if (!load) notFound();
  const lessonModule = await load();
  const lesson = lessonSchema.parse(lessonModule.lesson);
  const levelIndex = levels.findIndex((level) => lessonIdsByLevel[level.id as keyof typeof lessonIdsByLevel].includes(slug as never));
  const level = levels[levelIndex];
  const levelLessons = lessonIdsByLevel[level.id as keyof typeof lessonIdsByLevel];
  const lessonNumber = levelLessons.indexOf(slug as never);
  const LessonContent = lessonModule.default;
  return <div className="page-wrap lesson-page">
    <Link href={`/level/${level.id}/`} className="back-link">← {level.code} · {level.rank}</Link>
    <div className="lesson-hero"><div className="lesson-topline"><span className="section-kicker">FIELD LESSON · {lesson.minutes} MIN</span><span className="lesson-earn">+{lesson.xp} XP</span></div><span className="lesson-serial-big">{String(lessonNumber + 1).padStart(2, '0')}<i>/06</i></span><h1>{lesson.title}<em>.</em></h1><div className="lesson-progress-line"><span>{level.code} / {level.rank.toUpperCase()}</span><span>{lesson.quiz.length} QUICK CHECKS · {lesson.cards.length} FLASHCARDS</span></div></div>
    <div className="lesson-layout"><article className="lesson-body prose"><LessonContent /></article><aside className="lesson-aside"><span className="section-kicker">FIELD NOTE</span><b>Learn it, then use it.</b><p>Each idea connects to work an FDE may do with a real customer team.</p><div className="aside-rule"/><span className="section-kicker">THIS LESSON</span><span>01 &nbsp; Why it matters</span><span>02 &nbsp; The idea</span><span>03 &nbsp; Worked example</span><span>04 &nbsp; Common mistakes</span><span>05 &nbsp; Quick check</span></aside></div>
    <LessonQuiz id={lesson.id} items={lesson.quiz} />
    <div className="flashcard-note"><span>✦</span><div><b>3 review cards added to your deck</b><p>They’ll come back in your Daily Drill to help you remember the key ideas.</p></div><Link href="/review/">View review deck ↗</Link></div>
  </div>;
}
