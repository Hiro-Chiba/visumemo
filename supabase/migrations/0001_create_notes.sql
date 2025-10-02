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

