'use server';

import dayjs from 'dayjs';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getAuthenticatedUser } from '@/lib/supabase/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { buildPreviewText } from '@/lib/utils/preview';

const createSchema = z.object({
  title: z.string().max(200),
  body: z.string(),
});

const updateSchema = createSchema.extend({
  id: z.string().uuid(),
});

export const createNoteAction = async (input: { title: string; body: string }) => {
  const parsed = createSchema.parse(input);
  const user = await getAuthenticatedUser();
  if (!user) {
    throw new Error('認証が必要です');
  }
  const supabase = createSupabaseServerClient();
  const now = dayjs().toISOString();
  const { data, error } = await supabase
    .from('notes')
    .insert({
      user_id: user.id,
      title: parsed.title,
      body: parsed.body,
      preview_text: buildPreviewText(parsed.body),
      content_updated_at: now,
      is_deleted: false,
    })
    .select('id')
    .single();
  if (error || !data) {
    throw error ?? new Error('ノートの作成に失敗しました');
  }
  revalidatePath('/');
  return data.id;
};

export const updateNoteAction = async (input: { id: string; title: string; body: string }) => {
  const parsed = updateSchema.parse(input);
  const user = await getAuthenticatedUser();
  if (!user) {
    throw new Error('認証が必要です');
  }
  const supabase = createSupabaseServerClient();
  const now = dayjs().toISOString();
  const { error } = await supabase
    .from('notes')
    .update({
      title: parsed.title,
      body: parsed.body,
      preview_text: buildPreviewText(parsed.body),
      content_updated_at: now,
    })
    .eq('id', parsed.id)
    .eq('user_id', user.id);
  if (error) {
    throw error;
  }
  revalidatePath('/');
  revalidatePath(`/notes/${parsed.id}`);
};

export const updateNoteThumbnailAction = async (input: { id: string; path: string }) => {
  const schema = z.object({ id: z.string().uuid(), path: z.string() });
  const parsed = schema.parse(input);
  const user = await getAuthenticatedUser();
  if (!user) {
    throw new Error('認証が必要です');
  }
  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from('notes')
    .update({
      thumb_path: parsed.path,
      thumb_updated_at: dayjs().toISOString(),
    })
    .eq('id', parsed.id)
    .eq('user_id', user.id);
  if (error) {
    throw error;
  }
  revalidatePath('/');
  revalidatePath(`/notes/${parsed.id}`);
};
