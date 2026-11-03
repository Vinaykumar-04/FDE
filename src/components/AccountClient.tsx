'use client';

import Link from 'next/link';
import { type FormEvent, useEffect, useState } from 'react';
import { useAccount } from './AccountProvider';
import { getSupabaseBrowserClient } from '@/lib/supabase';

type Mode = 'sign-in' | 'sign-up' | 'forgot' | 'new-password';

export function AccountClient() {
  const { user, configured, loading, syncMessage, signOut } = useAccount();
  const [mode, setMode] = useState<Mode>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const client = getSupabaseBrowserClient();
    if (!client) return;
    const { data } = client.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setMode('new-password');
    });
    return () => data.subscription.unsubscribe();
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const client = getSupabaseBrowserClient();
    if (!client) return;
    setBusy(true); setMessage('');
    try {
      if (mode === 'sign-up') {
        const { data, error } = await client.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/account/` },
        });
        if (error) throw error;
        setMessage(data.session ? 'Account created. Your progress is syncing.' : 'Check your email to confirm your account, then sign in here.');
      } else if (mode === 'sign-in') {
        const { error } = await client.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setMessage('Signed in. Loading your saved progress…');
      } else if (mode === 'forgot') {
        const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/account/` });
        if (error) throw error;
        setMessage('If that email has an account, a password reset link is on its way.');
      } else {
        const { error } = await client.auth.updateUser({ password });
        if (error) throw error;
        setMode('sign-in'); setPassword(''); setMessage('Password updated. You can keep learning.');
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'That request did not work. Please try again.');
    } finally { setBusy(false); }
  }

  const title = mode === 'sign-up' ? 'Create your account.' : mode === 'forgot' ? 'Reset your password.' : mode === 'new-password' ? 'Choose a new password.' : 'Welcome back.';
  const submitLabel = mode === 'sign-up' ? 'Create account' : mode === 'forgot' ? 'Send reset link' : mode === 'new-password' ? 'Update password' : 'Sign in';

  return <div className="page-wrap account-page">
    <div className="page-heading"><div><span className="section-kicker">YOUR FIELD RECORD · CLOUD SYNC</span><h1>Progress that <em>travels.</em></h1></div><span className="review-emblem">✦</span></div>
    <div className="account-layout">
      <section className="account-panel">
        {loading ? <div className="account-message" role="status">Checking your account…</div> : !configured ? <>
          <span className="section-kicker">ONE-TIME CONNECTION</span><h2>Connect the account service.</h2>
          <p>Account sync is ready in the app, but it needs a Supabase project URL, publishable key, and the progress table. Follow <b>ACCOUNT_SETUP.md</b> to switch it on.</p>
          <div className="account-setup-status"><span className="account-status-dot"/> Local progress is working. Cloud accounts are not configured yet.</div>
          <Link href="/profile/" className="button button-outline">Back to your profile <span>↗</span></Link>
        </> : user ? <>
          <span className="section-kicker">SIGNED IN</span><h2>Your progress is backed up.</h2>
          <p className="account-email">{user.email}</p>
          <div className="account-sync-status"><span className="account-status-dot"/>{syncMessage || 'Account connected.'}</div>
          <p>Lessons, quiz scores, field labs, review cards, and cleared levels sync to this account. Sign in on another device to continue there.</p>
          <div className="account-actions"><Link href="/map/" className="button button-blue">Continue learning <span>↗</span></Link><button className="button button-outline" onClick={() => void signOut()}>Sign out</button></div>
        </> : <>
          <div className="account-tabs" aria-label="Account actions">
            <button className={mode === 'sign-in' ? 'active' : ''} onClick={() => { setMode('sign-in'); setMessage(''); }}>Sign in</button>
            <button className={mode === 'sign-up' ? 'active' : ''} onClick={() => { setMode('sign-up'); setMessage(''); }}>Create account</button>
          </div>
          <span className="section-kicker">YOUR LEARNING, SAVED</span><h2>{title}</h2>
          <p>Use the same email on each device. Your local progress will merge into your account the first time you connect.</p>
          <form className="account-form" onSubmit={submit}>
            {mode !== 'new-password' && <label>Email address<input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com"/></label>}
            {mode !== 'forgot' && <label>{mode === 'new-password' ? 'New password' : 'Password'}<input type="password" autoComplete={mode === 'sign-up' ? 'new-password' : mode === 'new-password' ? 'new-password' : 'current-password'} minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters"/></label>}
            <button className="button button-blue" type="submit" disabled={busy}>{busy ? 'Please wait…' : submitLabel} <span>↗</span></button>
          </form>
          {mode === 'sign-in' && <button className="account-forgot" onClick={() => { setMode('forgot'); setMessage(''); }}>Forgot password?</button>}
          {mode === 'forgot' && <button className="account-forgot" onClick={() => { setMode('sign-in'); setMessage(''); }}>Back to sign in</button>}
          {message && <p className="account-message" role="status">{message}</p>}
          <div className="account-privacy"><b>Private by default.</b> Your progress record is protected so only your signed-in account can read or change it.</div>
        </>}
      </section>
      <aside className="account-side-note"><span className="section-kicker">WHAT SYNCS</span><b>One account.<br/><em>Any device.</em></b><ul><li>Lessons and quiz results</li><li>Field lab best scores</li><li>Boss clears and XP</li><li>Review card schedule</li></ul><p>Guest mode still works. Sign in when you want a cloud backup.</p></aside>
    </div>
  </div>;
}
