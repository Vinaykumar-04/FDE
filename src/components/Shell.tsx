'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useProgressStore } from '@/lib/progress';
import { AccountProvider } from '@/components/AccountProvider';

export function Shell({ children }: { children: React.ReactNode }) {
  const xp = useProgressStore((state) => state.xp);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  useEffect(() => {
    const saved = localStorage.getItem('fde-theme') === 'light' ? 'light' : 'dark';
    setTheme(saved); document.documentElement.dataset.theme = saved;
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => undefined);
  }, []);
  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next); document.documentElement.dataset.theme = next; localStorage.setItem('fde-theme', next);
  }

  return <AccountProvider><>
    <div className="announcement"><span>YOUR FIELD GUIDE TO CUSTOMER-CENTERED ENGINEERING</span><span className="announcement-dot" /> FREE TO LEARN · BUILT FOR THE FIELD</div>
    <header className="site-header">
      <Link className="brand" href="/" aria-label="FDE Hero Academy home"><span className="brand-mark"><i /><i /><i /></span><span>FDE <b>HERO</b> ACADEMY</span></Link>
      <nav className="nav-links" aria-label="Main navigation">
        <Link href="/map/">Learning path</Link><Link href="/review/">Daily drill</Link><Link href="/interview/">Interview & jobs</Link><Link href="/account/">Account</Link>
      </nav>
      <div className="header-actions"><Link href="/profile/" className="xp-pill"><span>✦</span> {xp} XP</Link><button className="theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>{theme === 'dark' ? '☼' : '◐'}</button><Link href="/map/" className="header-cta">Open academy <span>↗</span></Link></div>
    </header>
    <main>{children}</main>
    <footer className="site-footer"><Link className="brand footer-brand" href="/"><span className="brand-mark"><i /><i /><i /></span><span>FDE <b>HERO</b> ACADEMY</span></Link><span>Learn in the lab. Grow in the field.</span><Link href="/interview/">Career guide ↗</Link></footer>
  </></AccountProvider>;
}

export function ProgressBar({ value, max, label }: { value: number; max: number; label?: string }) {
  const percent = Math.min(100, Math.round((value / Math.max(max, 1)) * 100));
  return <div className="progress-wrap" aria-label={label ?? 'Progress'}><div className="progress-track"><span style={{ width: `${percent}%` }} /></div><small>{percent}%</small></div>;
}
