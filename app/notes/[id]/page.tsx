import { notFound } from 'next/navigation';
import { NoteEditor } from '@/components/NoteEditor';
import { requireUserId } from '@/src/lib/auth';
import { prisma } from '@/src/lib/prisma';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: {
    id: string;
  };
};

export default async function NoteDetailPage({ params }: PageProps) {
  const userId = requireUserId();
  const note = await prisma.note.findFirst({
    where: {
      id: params.id,
      userId,
      isDeleted: false
    }
  });

  if (!note) {
    notFound();
  }

  return <NoteEditor mode="edit" noteId={note.id} initialTitle={note.title} initialBody={note.body} />;
}
