'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useAccount } from '@/components/AccountProvider';
import { getSupabaseBrowserClient } from '@/lib/supabase';

const avatarOptions = [
  { value: 'spark', glyph: '✦', label: 'Spark' },
  { value: 'compass', glyph: '↗', label: 'Compass' },
  { value: 'orbit', glyph: '◌', label: 'Orbit' },
  { value: 'bolt', glyph: 'ϟ', label: 'Bolt' },
] as const;

const colorOptions = [
  { value: 'blue', label: 'Blue' },
  { value: 'gold', label: 'Gold' },
  { value: 'teal', label: 'Teal' },
  { value: 'violet', label: 'Violet' },
] as const;

const focusOptions = [
  'Customer engineering',
  'AI and automation',
  'APIs and integrations',
  'Full-stack foundations',
  'Exploring the field',
] as const;

type AvatarValue = typeof avatarOptions[number]['value'];
type ColorValue = typeof colorOptions[number]['value'];
type ProfileDetails = {
  displayName: string;
  about: string;
  focus: string;
  avatar: AvatarValue;
  color: ColorValue;
};

const defaultProfile: ProfileDetails = {
  displayName: '', about: '', focus: 'Exploring the field', avatar: 'spark', color: 'blue',
};

const localProfileKey = 'fde-public-profile';
const profileFields = {
  displayName: 'fde_display_name',
  about: 'fde_about',
  focus: 'fde_focus',
  avatar: 'fde_avatar',
  color: 'fde_color',
} as const;

function validAvatar(value: unknown): AvatarValue {
  return avatarOptions.some((option) => option.value === value) ? value as AvatarValue : 'spark';
}

function validColor(value: unknown): ColorValue {
  return colorOptions.some((option) => option.value === value) ? value as ColorValue : 'blue';
}

function fromStored(value: unknown): ProfileDetails | null {
  if (!value || typeof value !== 'object') return null;
  const record = value as Record<string, unknown>;
  return {
    displayName: typeof record.displayName === 'string' ? record.displayName.slice(0, 40) : '',
    about: typeof record.about === 'string' ? record.about.slice(0, 120) : '',
    focus: typeof record.focus === 'string' && focusOptions.includes(record.focus as typeof focusOptions[number]) ? record.focus : defaultProfile.focus,
    avatar: validAvatar(record.avatar),
    color: validColor(record.color),
  };
}

function readLocalProfile(): ProfileDetails | null {
  try {
    const value = localStorage.getItem(localProfileKey);
    return value ? fromStored(JSON.parse(value)) : null;
  } catch {
    return null;
  }
}

export function ProfileCustomizer() {
  const account = useAccount();
  const [profile, setProfile] = useState<ProfileDetails>(defaultProfile);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (account.loading) return;
    const stored = readLocalProfile();
    const metadata = account.user?.user_metadata as Record<string, unknown> | undefined;
    setProfile({
      displayName: typeof metadata?.[profileFields.displayName] === 'string'
        ? (metadata[profileFields.displayName] as string).slice(0, 40)
        : stored?.displayName ?? '',
      about: typeof metadata?.[profileFields.about] === 'string'
        ? (metadata[profileFields.about] as string).slice(0, 120)
        : stored?.about ?? '',
      focus: typeof metadata?.[profileFields.focus] === 'string'
        && focusOptions.includes(metadata[profileFields.focus] as typeof focusOptions[number])
        ? metadata[profileFields.focus] as string
        : stored?.focus ?? defaultProfile.focus,
      avatar: validAvatar(metadata?.[profileFields.avatar] ?? stored?.avatar),
      color: validColor(metadata?.[profileFields.color] ?? stored?.color),
    });
    setMessage('');
  }, [account.loading, account.user?.id, account.user?.user_metadata]);

  const selectedAvatar = avatarOptions.find((option) => option.value === profile.avatar) ?? avatarOptions[0];
  const initials = profile.displayName.trim().slice(0, 1).toUpperCase()
    || account.user?.email?.slice(0, 1).toUpperCase()
    || '?';

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    const normalized = { ...profile, displayName: profile.displayName.trim(), about: profile.about.trim() };
    try {
      if (account.user) {
        const client = getSupabaseBrowserClient();
        if (!client) throw new Error('Account service is not connected.');
        const { error } = await client.auth.updateUser({ data: {
          [profileFields.displayName]: normalized.displayName,
          [profileFields.about]: normalized.about,
          [profileFields.focus]: normalized.focus,
          [profileFields.avatar]: normalized.avatar,
          [profileFields.color]: normalized.color,
        } });
        if (error) throw error;
        setMessage('Profile saved to your account.');
      } else {
        setMessage('Profile saved on this device. Sign in to keep it with your account.');
      }
      localStorage.setItem(localProfileKey, JSON.stringify(normalized));
      setProfile(normalized);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Profile could not be saved. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return <section className="profile-customizer" aria-labelledby="profile-customizer-title">
    <div className="profile-customizer-intro">
      <div className={`profile-custom-avatar profile-color-${profile.color}`} aria-hidden="true">
        <span>{selectedAvatar.glyph}</span><small>{initials}</small>
      </div>
      <div><span className="section-kicker">MAKE IT YOURS</span><h2 id="profile-customizer-title">Your profile.</h2><p>Choose how you show up in your learning space.</p></div>
    </div>
    <form className="profile-customizer-form" onSubmit={(event) => void saveProfile(event)}>
      <label>Display name<input maxLength={40} value={profile.displayName} onChange={(event) => setProfile({ ...profile, displayName: event.target.value })} placeholder="What should we call you?" /></label>
      <label>Learning focus<select value={profile.focus} onChange={(event) => setProfile({ ...profile, focus: event.target.value })}>{focusOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
      <label className="profile-about-field">A little about you <small>{profile.about.length}/120</small><textarea maxLength={120} rows={2} value={profile.about} onChange={(event) => setProfile({ ...profile, about: event.target.value })} placeholder="What are you hoping to build?" /></label>
      <fieldset className="profile-choice-field"><legend>Avatar symbol</legend><div className="profile-choice-row">{avatarOptions.map((option) => <button key={option.value} type="button" className={`profile-symbol-choice ${profile.avatar === option.value ? 'selected' : ''}`} aria-label={option.label} aria-pressed={profile.avatar === option.value} onClick={() => setProfile({ ...profile, avatar: option.value })}>{option.glyph}</button>)}</div></fieldset>
      <fieldset className="profile-choice-field"><legend>Accent color</legend><div className="profile-choice-row">{colorOptions.map((option) => <button key={option.value} type="button" className={`profile-color-choice profile-color-${option.value} ${profile.color === option.value ? 'selected' : ''}`} aria-label={option.label} aria-pressed={profile.color === option.value} onClick={() => setProfile({ ...profile, color: option.value })}/>)}</div></fieldset>
      <div className="profile-save-row"><button className="button button-blue" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save profile'} <span>↗</span></button>{message && <span role="status" className="profile-save-message">{message}</span>}</div>
    </form>
  </section>;
}
