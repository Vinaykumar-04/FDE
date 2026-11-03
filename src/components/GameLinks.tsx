import Link from 'next/link';
import { gameIdByTitle } from '@/lib/content';
import { gameById } from '@/lib/games';

export function GameLinks({ games }: { games: readonly string[] }) {
  return <div className="game-grid">{games.map((title, index) => {
    const id = gameIdByTitle[title];
    const game = gameById[id];
    return <Link className="game-card" href={`/play/${id}/`} key={title}><span className="game-card-top"><span className="game-code">LAB / {String(index + 1).padStart(2, '0')}</span><span className="game-mark">{['↗', '⌘', '{}', '◎'][index % 4]}</span></span><b>{title}</b><p>{game?.description ?? 'Solve a practical field challenge.'}</p><span className="game-card-foot"><span>UP TO 100 XP</span><span className="game-arrow">↗</span></span></Link>;
  })}</div>;
}
