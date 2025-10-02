'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import { createNoteAction, updateNoteAction, updateNoteThumbnailAction } from '@/app/notes/actions';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { buildPreviewText } from '@/lib/utils/preview';
import { captureElementToJpeg } from '@/lib/utils/thumb';

const THUMB_BUCKET = 'thumbs';

type NoteEditorProps = {
  mode: 'create' | 'edit';
  noteId?: string;
  initialTitle?: string;
  initialBody?: string;
};

export function NoteEditor({ mode, noteId, initialTitle = '', initialBody = '' }: NoteEditorProps) {
  const router = useRouter();
  const previewRef = useRef<HTMLDivElement | null>(null);
  const [title, setTitle] = useState(initialTitle);
  const [body, setBody] = useState(initialBody);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const previewText = useMemo(() => buildPreviewText(body), [body]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    setError('');
    try {
      let currentId = noteId ?? '';
      if (mode === 'create') {
        currentId = await createNoteAction({ title, body });
      } else if (mode === 'edit' && noteId) {
        await updateNoteAction({ id: noteId, title, body });
      }

      if (!currentId) {
        throw new Error('ノートIDの取得に失敗しました');
      }

      if (previewRef.current) {
        const blob = await captureElementToJpeg(previewRef.current, {
          width: 960,
          quality: 0.9,
        });
        const supabase = getSupabaseBrowserClient();
        const path = `${currentId}.jpg`;
        const { error: uploadError } = await supabase.storage
          .from(THUMB_BUCKET)
          .upload(path, blob, {
            upsert: true,
            contentType: 'image/jpeg',
            cacheControl: '3600',
          });
        if (uploadError) {
          throw uploadError;
        }
        await updateNoteThumbnailAction({ id: currentId, path });
      }

      router.push('/');
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : '保存に失敗しました';
      setError(message);
    } finally {
      setIsSaving(false);
    }
  }, [body, mode, noteId, router, title]);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">
            {mode === 'create' ? '新規メモ' : 'メモを編集'}
          </h1>
          <p className="text-sm text-slate-400">保存すると一覧のサムネイルが自動更新されます。</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-sky-300 disabled:opacity-60"
          >
            {isSaving ? '保存中...' : '保存する'}
          </button>
        </div>
      </header>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-300">
            タイトル
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="mt-2 w-full rounded-lg bg-slate-900 px-4 py-2"
              placeholder="タイトルを入力"
              maxLength={200}
            />
          </label>
          <label className="block text-sm font-medium text-slate-300">
            内容
            <textarea
              value={body}
              onChange={(event) => setBody(event.target.value)}
              className="mt-2 h-72 w-full rounded-lg bg-slate-900 px-4 py-3"
              placeholder="本文を入力"
            />
          </label>
        </div>
        <div>
          <div
            ref={previewRef}
            className="flex h-full flex-col justify-between rounded-xl bg-slate-900 p-6 shadow-card"
          >
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-wide text-slate-500">Preview</span>
              <h2 className="text-xl font-semibold text-slate-100">{title || '無題のメモ'}</h2>
              <p className="text-sm text-slate-300">{previewText || 'ここに本文の概要が表示されます'}</p>
            </div>
            <div className="text-right text-xs text-slate-500">
              {dayjs().format('YYYY/MM/DD HH:mm')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
