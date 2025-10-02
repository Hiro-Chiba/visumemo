import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getUserId } from '@/src/lib/auth';
import { prisma } from '@/src/lib/prisma';
import { buildPreviewText, toNoteDTO } from '@/src/lib/notes';

const noteSchema = z.object({
  title: z.string().max(200).optional(),
  body: z.string().optional(),
  previewText: z.string().max(200).optional()
});

export async function GET() {
  const userId = getUserId();
  if (!userId) {
    return NextResponse.json({ message: 'unauthorized' }, { status: 401 });
  }
  const notes = await prisma.note.findMany({
    where: {
      userId,
      isDeleted: false
    },
    orderBy: { contentUpdatedAt: 'desc' }
  });

  return NextResponse.json(notes.map(toNoteDTO));
}

export async function POST(request: Request) {
  const userId = getUserId();
  if (!userId) {
    return NextResponse.json({ message: 'unauthorized' }, { status: 401 });
  }
  const json = await request.json();
  const parsed = noteSchema.parse(json);
  const now = new Date();

  const note = await prisma.note.create({
    data: {
      userId,
      title: parsed.title ?? '',
      body: parsed.body ?? '',
      previewText: parsed.previewText ? parsed.previewText.slice(0, 80) : buildPreviewText(parsed.body ?? ''),
      contentUpdatedAt: now
    }
  });

  return NextResponse.json(toNoteDTO(note));
}
