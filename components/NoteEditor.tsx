'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { captureElementToJpeg } from '@/src/lib/capture';
import { buildPreviewText } from '@/src/lib/notes';
import { useUserId } from './UserIdProvider';

type NoteEditorProps = {
  mode: 'create' | 'edit';
  noteId?: string;
  initialTitle?: string;
  initialBody?: string;
};

const dateFormatter = new Intl.DateTimeFormat('ja-JP', {
  hour: '2-digit',
  minute: '2-digit',
  month: 'short',
  day: 'numeric'
});

export function NoteEditor({ mode, noteId, initialTitle = '', initialBody = '' }: NoteEditorProps) {
  const router = useRouter();
  const userId = useUserId();
  const previewRef = useRef<HTMLDivElement | null>(null);
  const [title, setTitle] = useState(initialTitle);
  const [body, setBody] = useState(initialBody);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const previewText = useMemo(() => buildPreviewText(body), [body]);
  const timestampLabel = dateFormatter.format(new Date());

  const handleSave = useCallback(async () => {
    if (!userId) {
      setError('ユーザーIDがヘッダーに含まれていません');
      return;
    }
    setIsSaving(true);
    setError('');

    try {
      const payload = {
        title,
        body,
        previewText
      };

      let currentId = noteId ?? '';

      if (mode === 'create') {
        const response = await fetch('/api/notes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': userId
          },
          body: JSON.stringify(payload)
        });
        if (!response.ok) {
          throw new Error('ノートの作成に失敗しました');
        }
        const created = await response.json();
        currentId = created.id as string;
      } else if (mode === 'edit' && currentId) {
        const response = await fetch(`/api/notes/${currentId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': userId
          },
          body: JSON.stringify(payload)
        });
        if (!response.ok) {
          throw new Error('ノートの更新に失敗しました');
        }
      }

      if (!currentId) {
        throw new Error('ノートIDの取得に失敗しました');
      }

      if (previewRef.current) {
        const blob = await captureElementToJpeg(previewRef.current, { width: 960, quality: 0.9 });
        const uploadResponse = await fetch(`/api/blob/put?noteId=${currentId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'image/jpeg',
            'x-user-id': userId
          },
          body: blob
        });
        if (!uploadResponse.ok) {
          throw new Error('サムネイルのアップロードに失敗しました');
        }
        const { url } = (await uploadResponse.json()) as { url: string };
        const finalizeResponse = await fetch(`/api/notes/${currentId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': userId
          },
          body: JSON.stringify({ ...payload, thumbUrl: url })
        });
        if (!finalizeResponse.ok) {
          throw new Error('サムネイルURLの保存に失敗しました');
        }
      }

      router.push('/');
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : '保存に失敗しました';
      setError(message);
    } finally {
      setIsSaving(false);
    }
  }, [body, mode, noteId, previewText, router, title, userId]);

  return (
    <div className="space-y-6 pb-16">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">
            {mode === 'create' ? '新規メモ' : 'メモを編集'}
          </h1>
          <p className="text-sm text-slate-400">保存すると一覧のサムネイルが自動生成されます。</p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-slate-900 shadow-lg disabled:opacity-60"
        >
          {isSaving ? '保存中…' : '保存'}
        </button>
      </header>
      {error ? <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-200">{error}</p> : null}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)]">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-300">
            タイトル
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={120}
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-surfaceLight px-4 py-3 text-base shadow-inner"
              placeholder="タイトルを入力"
            />
          </label>
          <label className="block text-sm font-medium text-slate-300">
            内容
            <textarea
              value={body}
              onChange={(event) => setBody(event.target.value)}
              className="mt-2 h-72 w-full rounded-2xl border border-slate-700 bg-surfaceLight px-4 py-3 text-base shadow-inner"
              placeholder="本文を入力"
            />
          </label>
        </div>
        <div>
          <div
            ref={previewRef}
            className="flex h-full flex-col justify-between rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-black p-6 shadow-card"
          >
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-wide text-slate-500">Preview</span>
              <h2 className="text-xl font-semibold text-white">{title || '無題のメモ'}</h2>
              <p className="line-clamp-3 text-sm text-slate-300">{previewText || '本文の要約がここに表示されます。'}</p>
            </div>
            <div className="text-right text-xs text-slate-500">{timestampLabel}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
