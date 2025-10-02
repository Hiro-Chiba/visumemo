'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState, useTransition } from 'react';

const SEARCH_PARAM = 'q';

export function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const q = searchParams.get(SEARCH_PARAM) ?? '';
    setQuery(q);
  }, [searchParams]);

  const updateQuery = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(SEARCH_PARAM, value);
      } else {
        params.delete(SEARCH_PARAM);
      }
      const queryString = params.toString();
      startTransition(() => {
        router.replace(queryString ? `${pathname}?${queryString}` : pathname);
      });
    },
    [pathname, router, searchParams]
  );

  return (
    <div className="relative">
      <input
        id="note-search"
        type="search"
        value={query}
        onChange={(event) => {
          const value = event.target.value;
          setQuery(value);
          updateQuery(value);
        }}
        placeholder="タイトルやプレビューで検索"
        className="w-full rounded-2xl border border-slate-700 bg-surfaceLight px-4 py-3 text-base shadow-inner"
        aria-label="メモを検索"
        autoComplete="off"
      />
      {isPending ? (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
          検索中...
        </span>
      ) : null}
    </div>
  );
}
