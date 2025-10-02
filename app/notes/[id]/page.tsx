'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { NoteEditor } from '@/components/NoteEditor';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export default function NoteDetailPage() {
  const params = useParams<{ id: string }>();
  const noteIdParam = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [initialTitle, setInitialTitle] = useState('');
  const [initialBody, setInitialBody] = useState('');

  useEffect(() => {
    const id = noteIdParam;
    if (!id) {
      setError('ノートIDが無効です');
      setLoading(false);
      return;
    }
    const supabase = getSupabaseBrowserClient();
    const fetchNote = async () => {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('notes')
        .select('title, body')
        .eq('id', id)
        .single();
      if (fetchError || !data) {
        setError(fetchError?.message ?? 'メモが見つかりません');
      } else {
        setInitialTitle(data.title);
        setInitialBody(data.body);
        setError('');
      }
      setLoading(false);
    };
    fetchNote();
  }, [noteIdParam]);

  if (loading) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center text-slate-400">
        読み込み中...
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center text-red-400">
        {error}
      </main>
    );
  }

  if (!noteIdParam) {
    return null;
  }

  return <NoteEditor mode="edit" noteId={noteIdParam} initialTitle={initialTitle} initialBody={initialBody} />;
}
