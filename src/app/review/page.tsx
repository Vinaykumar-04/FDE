import Link from 'next/link';
import { lessonIds } from '@/lib/content';
import { lessonModules } from '@/lib/lesson-modules';
import { ReviewDeck } from '@/components/ReviewDeck';

export default async function ReviewPage() {
  const cards = (await Promise.all(lessonIds.map(async (slug) => (await lessonModules[slug as keyof typeof lessonModules]()).lesson.cards))).flat();
  return <div className="page-wrap review-page"><Link href="/map/" className="back-link">← Learning path</Link><div className="page-heading"><div><span className="section-kicker">DAILY FIELD DRILL · 3 CARDS</span><h1>Keep it <em>close.</em></h1></div><span className="review-emblem">✦</span></div><p className="review-intro">Bring key ideas back to mind. Say your answer before revealing the card.</p><ReviewDeck cards={cards.slice(0, 3)} /></div>;
}
