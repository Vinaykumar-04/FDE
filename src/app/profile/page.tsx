'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { useAccount } from '@/components/AccountProvider';
import { levels } from '@/lib/content';
import { useProgressStore } from '@/lib/progress';
import { ProfileCustomizer } from '@/components/ProfileCustomizer';

export default function ProfilePage() {
  const state = useProgressStore();
  const account = useAccount();
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState('');
  const rank = state.xp >= 8000 ? 'FDE Hero' : state.xp >= 5000 ? 'Field Operator' : state.xp >= 3000 ? 'AI Engineer' : state.xp >= 1500 ? 'Integrator' : state.xp >= 500 ? 'Builder' : 'Recruit';

  function exportFile() {
    const blob = new Blob([state.exportProgress()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url; anchor.download = 'fde-hero-progress.json'; anchor.click();
    URL.revokeObjectURL(url); setMessage('Your progress file is ready.');
  }

  async function importFile(file?: File) {
    if (!file) return;
    const imported = state.importProgress(await file.text());
    setMessage(imported ? 'Progress restored on this device.' : 'That file is not a valid academy progress export.');
  }

  return <div className="page-wrap profile-page">
    <Link href="/map/" className="back-link">← Learning path</Link>
    <div className="page-heading"><div><span className="section-kicker">YOUR FIELD RECORD</span><h1>Profile & <em>progress.</em></h1></div></div>
    <section className="profile-account"><div><span className="section-kicker">{account.user ? 'ACCOUNT SYNC' : 'BACK UP YOUR PROGRESS'}</span><b>{account.user ? account.user.email : 'Keep learning on any device.'}</b><small>{account.user ? account.syncMessage : 'Create a free account to sync lessons, scores, and XP.'}</small></div><Link className="button button-outline" href="/account/">{account.user ? 'Account settings' : 'Create an account'} <span>↗</span></Link></section>
    <ProfileCustomizer />
    <div className="profile-card"><span className="profile-rank-mark">✦</span><div><span className="section-kicker">CURRENT RANK</span><h2>{rank}</h2><p>{state.xp} experience points · {state.completedLessons.length} lessons complete</p></div><span className="profile-xp">{state.xp}<small>XP</small></span></div>
    <div className="profile-stats"><div><small>LESSONS COMPLETE</small><b>{state.completedLessons.length}</b></div><div><small>FIELD CHALLENGES</small><b>{Object.keys(state.gameBest).length}</b></div><div><small>BOSSES CLEARED</small><b>{state.bossPassed.length}</b></div><div><small>BADGES EARNED</small><b>{state.badges.length}</b></div></div>
    <section className="profile-levels"><span className="section-kicker">THE PATH AHEAD</span>{levels.map((level, index) => { const unlocked = index === 0 || state.bossPassed.includes(levels[index - 1].id); return <div className="profile-level-row" key={level.id}><span>{level.code}</span><b>{level.rank}</b><small>{state.bossPassed.includes(level.id) ? 'CLEARED' : unlocked ? 'OPEN' : 'LOCKED'}</small></div>; })}</section>
    <section className="data-tools"><div><span className="section-kicker">YOUR DATA STAYS HERE</span><h2>Take progress<br/><em>with you.</em></h2><p>Progress saves in this browser. Export a backup or import one you already have. Sign in to sync it across devices.</p></div><div className="data-actions"><button className="button button-blue" onClick={exportFile}>Export progress ↓</button><button className="button button-outline" onClick={() => fileRef.current?.click()}>Import progress ↑</button><input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={(event) => void importFile(event.target.files?.[0])}/>{message && <span role="status">{message}</span>}</div></section>
  </div>;
}
