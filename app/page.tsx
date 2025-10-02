import Link from 'next/link';
import { Masonry } from '@/components/Masonry';
import { NoteCard } from '@/components/NoteCard';
import { SearchBar } from '@/components/SearchBar';
import { getUserId } from '@/src/lib/auth';
import { prisma } from '@/src/lib/prisma';
import { toNoteDTO } from '@/src/lib/notes';

type PageProps = {
  searchParams?: {
    q?: string;
  };
};

export const dynamic = 'force-dynamic';

export default async function HomePage({ searchParams }: PageProps) {
  const userId = getUserId();
  if (!userId) {
    return (
      <main className="space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold">VisuMemo</h1>
          <p className="text-sm text-slate-400">
            ヘッダーに <code className="rounded bg-slate-800 px-2 py-1">x-user-id</code> を設定するとメモにアクセスできます。
          </p>
        </header>
        <div className="rounded-2xl border border-dashed border-slate-700 p-8 text-center text-slate-400">
          ローカル開発時は <code>DEFAULT_USER_ID</code> 環境変数でデフォルトユーザーを指定できます。
        </div>
      </main>
    );
  }

  const query = searchParams?.q?.trim() ?? '';

  const notes = await prisma.note.findMany({
    where: {
      userId,
      isDeleted: false,
      ...(query
        ? {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { previewText: { contains: query, mode: 'insensitive' } }
            ]
          }
        : {})
    },
    orderBy: { contentUpdatedAt: 'desc' }
  });

  const noteList = notes.map(toNoteDTO);

  return (
    <main className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Welcome back</p>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">VisuMemo</h1>
            <p className="text-sm text-slate-400">写真アプリのようなサムネイルでメモを俯瞰できます。</p>
          </div>
          <Link
            href="/notes/new"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-sm font-semibold text-slate-900 shadow-lg"
          >
            ✏️ 新規メモ
          </Link>
        </div>
      </header>

      <SearchBar />

      {noteList.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-700 p-10 text-center text-slate-400">
          まだメモがありません。右下の「新規」から作成してみましょう。
        </div>
      ) : (
        <Masonry>
          {noteList.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </Masonry>
      )}
    </main>
  );
}
