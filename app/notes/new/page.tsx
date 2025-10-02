import { redirect } from 'next/navigation';
import { NoteEditor } from '@/components/NoteEditor';
import { getUserId } from '@/src/lib/auth';

export const dynamic = 'force-dynamic';

export default function NewNotePage() {
  const userId = getUserId();
  if (!userId) {
    redirect('/');
  }
  return <NoteEditor mode="create" />;
}
