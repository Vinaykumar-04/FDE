import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BossChallenge } from '@/components/BossChallenge';
import { bosses } from '@/lib/bosses';
import { levels } from '@/lib/content';

export const dynamicParams = false;
export function generateStaticParams() { return bosses.map((boss) => ({ id: boss.id })); }

export default async function BossPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const boss = bosses.find((entry) => entry.id === id);
  if (!boss) notFound();
  const level = levels.find((entry) => entry.id === boss.levelId)!;
  return <div className="page-wrap boss-page"><Link href={`/level/${level.id}/`} className="back-link">← {level.code} · {level.rank}</Link><div className="boss-intro-banner"><span className="boss-emblem">◎</span><span className="section-kicker">FINAL MISSION · 300 XP</span><h1>{level.rank} <em>field test.</em></h1><p>{boss.intro}</p></div><BossChallenge boss={boss}/></div>;
}
