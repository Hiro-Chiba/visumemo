-- Storage(thumbs) バケット用の RLS 相当ポリシー（storage.objects テーブルに対するポリシー）
-- 想定パス: name = '{user_id}/{note_id}.jpg'
-- 先頭フォルダを user_id にすることでユーザーごとに完全分離する

-- バケットが未作成なら作成（ダッシュボードで作成済みならスキップ可）
-- 注: Supabase CLI 環境でバケット作成はストレージAPI経由となるため、
--     ここではポリシーのみ定義し、バケット作成はコンソール/CLIで行う運用を推奨。
-- 例: バケット名 'thumbs' を private で作成

-- 既存ポリシーをクリア（再実行に備える）
drop policy if exists "read own thumbs" on storage.objects;
drop policy if exists "write own thumbs" on storage.objects;
drop policy if exists "update own thumbs" on storage.objects;
drop policy if exists "delete own thumbs" on storage.objects;

-- 自分のファイルだけ閲覧（サインドURL生成に必要）
create policy "read own thumbs"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'thumbs'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- 自分のフォルダ配下にだけアップロード可能
create policy "write own thumbs"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'thumbs'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- 自分のフォルダ配下にだけ更新可能
create policy "update own thumbs"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'thumbs'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- 自分のファイルだけ削除可能（必要に応じて）
create policy "delete own thumbs"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'thumbs'
  and (storage.foldername(name))[1] = auth.uid()::text
);
