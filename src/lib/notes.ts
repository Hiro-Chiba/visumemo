import type { Note } from '@prisma/client';
import type { NoteDTO } from '../types';

export const buildPreviewText = (body: string): string =>
  body
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80);

export const toNoteDTO = (note: Note): NoteDTO => ({
  id: note.id,
  userId: note.userId,
  title: note.title,
  body: note.body,
  previewText: note.previewText,
  thumbUrl: note.thumbUrl,
  contentUpdatedAt: note.contentUpdatedAt.toISOString(),
  thumbUpdatedAt: note.thumbUpdatedAt ? note.thumbUpdatedAt.toISOString() : null,
  isDeleted: note.isDeleted
});
