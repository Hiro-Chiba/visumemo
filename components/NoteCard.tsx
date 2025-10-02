import Image from 'next/image';
import Link from 'next/link';
import type { NoteDTO } from '@/src/types';

const formatter = new Intl.DateTimeFormat('ja-JP', {
  month: 'short',
  day: 'numeric'
});

export function NoteCard({ note }: { note: NoteDTO }) {
  const updatedAt = formatter.format(new Date(note.contentUpdatedAt));

  return (
    <Link href={`/notes/${note.id}`} className="group mb-4 block break-inside-avoid">
      <article className="relative overflow-hidden rounded-3xl bg-surfaceLight shadow-card">
        <div className="relative aspect-[3/4]">
          {note.thumbUrl ? (
            <Image
              src={note.thumbUrl}
              alt={`${note.title || '無題'}のサムネイル`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover"
              priority={false}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-black text-4xl">
              📝
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4">
            <h3 className="truncate text-base font-semibold text-white">{note.title || '無題のメモ'}</h3>
            <p className="line-clamp-2 text-xs text-slate-200">{note.previewText || 'プレビューはまだありません。'}</p>
          </div>
          <div className="absolute left-0 top-0 rounded-br-3xl bg-black/40 px-3 py-2 text-xs text-white">{updatedAt}</div>
        </div>
      </article>
    </Link>
  );
}
