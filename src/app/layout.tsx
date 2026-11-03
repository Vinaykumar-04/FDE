import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Shell } from '@/components/Shell';

export const metadata: Metadata = {
  title: 'FDE Hero Academy — Learn to ship in the real world',
  description: 'A practical, game-based learning path from beginner to Forward Deployed Engineer.',
  manifest: '/manifest.webmanifest',
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#080a0d' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-theme="dark"><body><Shell>{children}</Shell></body></html>;
}
