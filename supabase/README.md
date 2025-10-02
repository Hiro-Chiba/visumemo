# Supabase セットアップ手順（VisuMemo）

このフォルダの SQL を **上から順に** 実行してください。
- 0001_create_notes.sql
- 0002_enable_rls_and_policies.sql
- 0003_storage_thumbs_policies.sql

## 事前準備
1) Supabase プロジェクトを作成  
2) Storage バケット `thumbs` を private で作成（ダッシュボード）  
3) 右上「SQL Editor」で上記 3 ファイルを順に実行

## 動作の考え方
- RLS により、`public.notes` は **自分の user_id の行だけ**読める/書ける/更新できる/削除できる
- Storage は `name = '{user_id}/{note_id}.jpg'` の規約を課すことで、
  `storage.objects` のポリシーが「最初のフォルダ = 自分の UID」の場合だけ許可する

## クライアント側の保存例（擬似コード）
```ts
// 1) Note を作成（user_id は default auth.uid() で自動）
const { data: note } = await sb.from('notes')
  .insert({ title, body, preview_text })
  .select('id')
  .single();

// 2) サムネ JPEG を生成し、ユーザーID/ノートID でアップロード
const uid = (await sb.auth.getUser()).data.user?.id!;
const key = `${uid}/${note.id}.jpg`;
await sb.storage.from('thumbs').upload(key, blob, { upsert: true });

// 3) notes.thumb_path をキーで更新
await sb.from('notes').update({
  thumb_path: key,
  thumb_updated_at: new Date().toISOString()
}).eq('id', note.id);
```
