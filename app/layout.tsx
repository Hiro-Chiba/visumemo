import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import '../styles/globals.css';
import { getUserId } from '@/src/lib/auth';
import { BottomNav } from '@/components/BottomNav';
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister';
import { UserIdProvider } from '@/components/UserIdProvider';

export const metadata: Metadata = {
  title: 'VisuMemo',
  description: 'サムネ付きメモを写真アプリ風に管理',
  manifest: '/manifest.webmanifest',
  themeColor: '#0b0b0d',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'VisuMemo'
  },
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: [
      { url: '/icon-192.png' }
    ]
  }
};

export default function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  const userId = getUserId();

  return (
    <html lang="ja" className="bg-surface">
      <body className="min-h-screen bg-surface text-slate-100">
        <UserIdProvider value={userId}>
          <ServiceWorkerRegister />
          <div className="flex min-h-screen flex-col">
            <div className="flex-1 pb-24">
              <div className="mx-auto w-full max-w-4xl px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))]">
                {children}
              </div>
            </div>
            <BottomNav />
          </div>
        </UserIdProvider>
      </body>
    </html>
  );
}
