import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'VisuMemo',
  description: 'サムネ付きメモを写真アプリ風に管理'
};

export default function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <html lang="ja" className="bg-surface">
      <body className="min-h-screen bg-surface text-slate-100">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8">{children}</div>
      </body>
    </html>
  );
}
