'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback } from 'react';

const baseItem =
  'flex-1 flex flex-col items-center justify-center gap-1 text-[11px] font-medium tracking-wide transition-colors';

export function BottomNav() {
  const pathname = usePathname();

  const focusSearch = useCallback(() => {
    const input = document.getElementById('note-search');
    if (input instanceof HTMLInputElement) {
      input.focus();
      input.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }, []);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-800 bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-around px-6 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <Link href="/" className={`${baseItem} ${pathname === '/' ? 'text-accent' : 'text-slate-400'}`}>
          <span className="text-lg">🏠</span>
          <span>ホーム</span>
        </Link>
        <button type="button" className={`${baseItem} text-slate-400`} onClick={focusSearch}>
          <span className="text-lg">🔍</span>
          <span>検索</span>
        </button>
        <Link
          href="/notes/new"
          className={`${baseItem} ${pathname.startsWith('/notes/new') ? 'text-accent' : 'text-slate-400'}`}
        >
          <span className="text-lg">✏️</span>
          <span>新規</span>
        </Link>
      </div>
    </nav>
  );
}
