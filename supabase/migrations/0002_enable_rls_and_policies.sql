-- Row Level Security（RLS）を有効化し、自分の行だけ読み書きできるようにする

-- RLS 有効化
alter table public.notes enable row level security;

-- 既存ポリシーがある場合に備えて削除（再適用のため）
drop policy if exists "select own notes" on public.notes;
drop policy if exists "insert own notes" on public.notes;
drop policy if exists "update own notes" on public.notes;
drop policy if exists "delete own notes" on public.notes;

-- 自分のノートだけ読める
create policy "select own notes"
on public.notes
for select
to authenticated
using (user_id = auth.uid());

-- 自分のノートだけ挿入できる（auth.uid() が既定値だが、明示指定でもチェック）
create policy "insert own notes"
on public.notes
for insert
to authenticated
with check (user_id = auth.uid());

-- 自分のノートだけ更新できる
create policy "update own notes"
on public.notes
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- 必要なら削除も制御（論理削除のみなら不要）
create policy "delete own notes"
on public.notes
for delete
to authenticated
using (user_id = auth.uid());
