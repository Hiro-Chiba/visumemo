import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getUserId } from '@/src/lib/auth';
import { prisma } from '@/src/lib/prisma';
import { buildPreviewText, toNoteDTO } from '@/src/lib/notes';

const updateSchema = z.object({
  title: z.string().max(200).optional(),
  body: z.string().optional(),
  previewText: z.string().max(200).optional(),
  thumbUrl: z.string().url().nullable().optional()
});

type RouteContext = {
  params: {
    id: string;
  };
};

export async function GET(_request: Request, { params }: RouteContext) {
  const userId = getUserId();
  if (!userId) {
    return NextResponse.json({ message: 'unauthorized' }, { status: 401 });
  }
  const note = await prisma.note.findFirst({
    where: {
      id: params.id,
      userId,
      isDeleted: false
    }
  });

  if (!note) {
    return NextResponse.json({ message: 'not found' }, { status: 404 });
  }

  return NextResponse.json(toNoteDTO(note));
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const userId = getUserId();
  if (!userId) {
    return NextResponse.json({ message: 'unauthorized' }, { status: 401 });
  }
  const json = await request.json();
  const parsed = updateSchema.parse(json);

  const existing = await prisma.note.findFirst({
    where: {
      id: params.id,
      userId,
      isDeleted: false
    }
  });

  if (!existing) {
    return NextResponse.json({ message: 'not found' }, { status: 404 });
  }

  const data: {
    contentUpdatedAt: Date;
    title?: string;
    body?: string;
    previewText?: string;
    thumbUrl?: string | null;
    thumbUpdatedAt?: Date | null;
  } = {
    contentUpdatedAt: new Date()
  };

  if (parsed.title !== undefined) {
    data.title = parsed.title;
  }
  if (parsed.body !== undefined) {
    data.body = parsed.body;
    data.previewText = buildPreviewText(parsed.body ?? '');
  }
  if (parsed.previewText !== undefined) {
    data.previewText = parsed.previewText ? parsed.previewText.slice(0, 80) : '';
  }
  if (parsed.thumbUrl !== undefined) {
    data.thumbUrl = parsed.thumbUrl;
    data.thumbUpdatedAt = parsed.thumbUrl ? new Date() : null;
  }

  await prisma.note.update({
    where: { id: existing.id },
    data
  });

  return NextResponse.json(null, { status: 204 });
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const userId = getUserId();
  if (!userId) {
    return NextResponse.json({ message: 'unauthorized' }, { status: 401 });
  }
  await prisma.note.updateMany({
    where: {
      id: params.id,
      userId
    },
    data: {
      isDeleted: true,
      contentUpdatedAt: new Date()
    }
  });
  return NextResponse.json(null, { status: 204 });
}
