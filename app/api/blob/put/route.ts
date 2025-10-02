import { Buffer } from 'node:buffer';
import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { z } from 'zod';
import { getUserId } from '@/src/lib/auth';

export const runtime = 'nodejs';

const searchSchema = z.object({
  noteId: z.string().uuid()
});

export async function POST(request: Request) {
  const userId = getUserId();
  if (!userId) {
    return NextResponse.json({ message: 'unauthorized' }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const parsed = searchSchema.safeParse({ noteId: searchParams.get('noteId') });

  if (!parsed.success) {
    return NextResponse.json({ message: 'noteId is required' }, { status: 400 });
  }

  const buffer = await request.arrayBuffer();
  if (buffer.byteLength === 0) {
    return NextResponse.json({ message: 'empty body' }, { status: 400 });
  }

  const token = process.env['BLOB_READ_WRITE_TOKEN'];
  if (!token) {
    return NextResponse.json({ message: 'BLOB_READ_WRITE_TOKEN is not configured' }, { status: 500 });
  }

  const fileName = `thumbs/${userId}/${parsed.data.noteId}-${Date.now()}.jpg`;
  const response = await put(fileName, Buffer.from(buffer), {
    access: 'public',
    contentType: 'image/jpeg',
    token,
    cacheControlMaxAge: 60 * 60 * 24
  });

  return NextResponse.json({ url: response.url });
}
