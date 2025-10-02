import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';
import type { Note } from '@/lib/types';

type NoteCardProps = {
  note: Note;
};

export function NoteCard({ note }: NoteCardProps) {
  const formattedDate = dayjs(note.content_updated_at).format('YYYY/MM/DD HH:mm');

  return (
    <Link
      href={`/notes/${note.id}`}
      className="block break-inside-avoid rounded-xl bg-surfaceLight shadow-card transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="overflow-hidden rounded-t-xl bg-slate-900">
        {note.thumb_url ? (
          <Image
            src={note.thumb_url}
            alt={`${note.title} のサムネイル`}
            width={640}
            height={480}
            className="h-auto w-full object-cover"
            sizes="(max-width: 640px) 100vw, 640px"
            priority={false}
          />
        ) : (
          <div className="flex h-48 items-center justify-center text-sm text-slate-500">
            No Preview
          </div>
        )}
      </div>
      <div className="space-y-2 px-4 py-3">
        <div className="text-sm text-slate-400">{formattedDate}</div>
        <h3 className="truncate text-lg font-semibold text-slate-100">{note.title || '無題のメモ'}</h3>
        <p className="truncate text-sm text-slate-300">
          {note.preview_text || '内容がまだありません'}
        </p>
      </div>
    </Link>
  );
}
