import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FieldLab } from '@/components/FieldLab';
import { gameById, games } from '@/lib/games';
import { levels } from '@/lib/content';

export const dynamicParams = false;
export function generateStaticParams() { return games.map((game) => ({ gameId: game.id })); }

export default async function PlayPage({ params }: { params: Promise<{ gameId: string }> }) {
  const { gameId } = await params; const game = gameById[gameId]; if (!game) notFound();
  const level = levels.find((item) => item.id === game.levelId);
  return <div className="page-wrap play-page"><Link href={`/level/${game.levelId}/`} className="back-link">← Exit to {level?.rank ?? 'level'}</Link><div className="play-header"><span className="section-kicker">FIELD LAB · {level?.rank.toUpperCase()}</span><h1>{game.title}<em>.</em></h1><p>{game.description}</p></div><FieldLab gameId={gameId} /></div>;
}
