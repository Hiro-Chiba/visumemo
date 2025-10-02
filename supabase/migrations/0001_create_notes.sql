-- notes テーブル作成（ユーザー所有）
-- ポイント: user_id は auth.users を参照し、既定値を auth.uid() にする
create extension if not exists pgcrypto; -- gen_random_uuid 用（環境により不要）

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default '',
  body text not null default '',
  preview_text text not null default '',
  thumb_path text,
  content_updated_at timestamptz not null default now(),
  thumb_updated_at timestamptz,
  is_deleted boolean not null default false
);

create index if not exists notes_user_idx on public.notes(user_id);

-- 既存データに対して user_id の既定値を設定（今後の insert を簡略化）
alter table public.notes
  alter column user_id set default auth.uid();

comment on table public.notes is 'ユーザー単位のメモ本体';
comment on column public.notes.thumb_path is 'Storage 上のサムネイルパス（例: {user_id}/{note_id}.jpg）';
