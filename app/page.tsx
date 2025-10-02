import Link from 'next/link';
import { MasonryGrid } from '@/components/MasonryGrid';
import { NoteCard } from '@/components/NoteCard';
import { SearchBar } from '@/components/SearchBar';
import { getAuthenticatedUser } from '@/lib/supabase/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { Note } from '@/lib/types';

type PageProps = {
  searchParams?: {
    q?: string;
  };
};

const THUMB_BUCKET = 'thumbs';

const buildPublicThumbUrl = (path: string): string => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL が設定されていません');
  }
  return `${url}/storage/v1/object/public/${THUMB_BUCKET}/${path}`;
};

export default async function HomePage({ searchParams }: PageProps) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return (
      <main className="space-y-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-100">VisuMemo</h1>
            <p className="text-sm text-slate-400">サインインするとメモにアクセスできます</p>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-sky-300"
          >
            サインイン
          </Link>
        </header>
        <div className="rounded-lg border border-dashed border-slate-700 p-10 text-center text-slate-400">
          Supabase Auth でログインしてください。
        </div>
      </main>
    );
  }

  const supabase = createSupabaseServerClient();
  const query = searchParams?.q?.trim() ?? '';

  let builder = supabase
    .from('notes')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_deleted', false)
    .order('content_updated_at', { ascending: false });

  if (query) {
    builder = builder.or(
      `title.ilike.%${query.replace(/%/g, '\\%').replace(/_/g, '\\_')}%,preview_text.ilike.%${query
        .replace(/%/g, '\\%')
        .replace(/_/g, '\\_')}%`
    );
  }

  const { data, error } = await builder;
  if (error) {
    throw error;
  }

  const notesWithThumb = await Promise.all(
    (data ?? []).map(async (note) => {
      let thumbUrl: string | null = null;
      if (note.thumb_path) {
        const { data: signed, error: signedError } = await supabase
          .storage
          .from(THUMB_BUCKET)
          .createSignedUrl(note.thumb_path, 60);
        if (!signedError && signed?.signedUrl) {
          thumbUrl = signed.signedUrl;
        } else {
          thumbUrl = buildPublicThumbUrl(note.thumb_path);
        }
      }
      const enriched: Note = { ...note, thumb_url: thumbUrl };
      return enriched;
    })
  );

  return (
    <main className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">VisuMemo</h1>
          <p className="text-sm text-slate-400">写真アプリ風にサムネ付きメモを管理</p>
        </div>
        <Link
          href="/notes/new"
          className="inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-sky-300"
        >
          新規メモ
        </Link>
      </header>

      <SearchBar />

      {notesWithThumb.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-700 p-10 text-center text-slate-400">
          まだメモがありません。新規メモを作成してください。
        </div>
      ) : (
        <MasonryGrid>
          {notesWithThumb.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </MasonryGrid>
      )}
    </main>
  );
}
