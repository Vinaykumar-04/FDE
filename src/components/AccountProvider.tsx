'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { mergeProgress } from '@/lib/cloud-progress';
import { parseProgressSnapshot, progressSnapshot, useProgressStore, type Progress } from '@/lib/progress';
import { getSupabaseBrowserClient, isSupabaseConfigured } from '@/lib/supabase';

type AccountContextValue = {
  user: User | null;
  configured: boolean;
  loading: boolean;
  syncMessage: string;
  signOut: () => Promise<void>;
};

const AccountContext = createContext<AccountContextValue>({
  user: null, configured: false, loading: false, syncMessage: 'Account sync is not configured.', signOut: async () => undefined,
});

const emptyProgress: Progress = {
  version: 1, xp: 0, completedLessons: [], quizBest: {}, gameBest: {}, bossPassed: [], badges: [],
  streak: { current: 0, lastDay: '' }, cards: {},
};

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncMessage, setSyncMessage] = useState('');
  const activeUserId = useRef<string | null>(null);
  const readyUserId = useRef<string | null>(null);
  const loadingUserId = useRef<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const writeQueue = useRef<Promise<void>>(Promise.resolve());
  const configured = isSupabaseConfigured();

  const saveSnapshot = useCallback((userId: string) => {
    writeQueue.current = writeQueue.current.then(async () => {
      if (activeUserId.current !== userId || readyUserId.current !== userId) return;
      const client = getSupabaseBrowserClient();
      if (!client) return;
      const local = progressSnapshot(useProgressStore.getState());
      const { data: savedRow, error: readError } = await client.from('fde_progress').select('progress').eq('user_id', userId).maybeSingle();
      if (readError) { setSyncMessage('Signed in, but cloud save failed. Check the database setup.'); return; }
      const savedProgress = parseProgressSnapshot(savedRow?.progress);
      const merged = savedProgress ? mergeProgress(local, savedProgress) : local;
      if (JSON.stringify(merged) !== JSON.stringify(local)) useProgressStore.getState().replaceProgress(merged);
      const progress = merged;
      const { error } = await client.from('fde_progress').upsert({
        user_id: userId, progress, updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });
      if (error) setSyncMessage('Signed in, but cloud save failed. Check the database setup.');
      else setSyncMessage('Progress saved to your account.');
    }).catch(() => setSyncMessage('Cloud save failed. Your progress is still saved on this device.'));
  }, []);

  const loadAccount = useCallback(async (account: User) => {
    const userId = account.id;
    const client = getSupabaseBrowserClient();
    if (!client) return;
    activeUserId.current = userId;
    loadingUserId.current = userId;
    readyUserId.current = null;
    setSyncMessage('Loading saved progress…');

    const { data, error } = await client.from('fde_progress').select('progress').eq('user_id', userId).maybeSingle();
    if (activeUserId.current !== userId) return;
    if (error) {
      loadingUserId.current = null;
      readyUserId.current = userId;
      setSyncMessage('Signed in, but cloud progress could not be loaded. Apply the database setup in ACCOUNT_SETUP.md.');
      return;
    }

    const owner = localStorage.getItem('fde-progress-owner');
    const local = progressSnapshot(useProgressStore.getState());
    const cloud = data?.progress as unknown;
    let next = emptyProgress;
    if (cloud && typeof cloud === 'object') {
      const parsed = parseProgressSnapshot(cloud);
      if (parsed) next = owner && owner !== userId ? parsed : mergeProgress(local, parsed);
    } else {
      next = owner && owner !== userId ? emptyProgress : local;
    }

    useProgressStore.getState().replaceProgress(next);
    localStorage.setItem('fde-progress-owner', userId);
    loadingUserId.current = null;
    readyUserId.current = userId;
    await saveSnapshot(userId);
  }, [saveSnapshot]);

  useEffect(() => {
    const client = getSupabaseBrowserClient();
    if (!client) { setLoading(false); setSyncMessage('Account sync is not configured yet.'); return; }

    const acceptUser = (nextUser: User | null) => {
      activeUserId.current = nextUser?.id ?? null;
      setUser(nextUser);
      if (!nextUser) {
        readyUserId.current = null;
        loadingUserId.current = null;
        setSyncMessage('Progress is saved on this device.');
        return;
      }
      if (readyUserId.current === nextUser.id || loadingUserId.current === nextUser.id) return;
      void loadAccount(nextUser);
    };

    const { data: authListener } = client.auth.onAuthStateChange((_event, session) => {
      window.setTimeout(() => acceptUser(session?.user ?? null), 0);
    });
    void client.auth.getSession().then(({ data }) => {
      acceptUser(data.session?.user ?? null);
      setLoading(false);
    }).catch(() => { setSyncMessage('Could not check your account session.'); setLoading(false); });

    const unsubscribe = useProgressStore.subscribe(() => {
      const userId = readyUserId.current;
      if (!userId || loadingUserId.current === userId) return;
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => saveSnapshot(userId), 700);
    });
    const retryCloudSave = () => {
      const userId = readyUserId.current;
      if (userId) saveSnapshot(userId);
    };
    window.addEventListener('online', retryCloudSave);

    return () => {
      authListener.subscription.unsubscribe();
      unsubscribe();
      window.removeEventListener('online', retryCloudSave);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [loadAccount, saveSnapshot]);

  const signOut = useCallback(async () => {
    const client = getSupabaseBrowserClient();
    if (client) await client.auth.signOut();
  }, []);

  return <AccountContext.Provider value={{ user, configured, loading, syncMessage, signOut }}>{children}</AccountContext.Provider>;
}

export function useAccount() { return useContext(AccountContext); }
