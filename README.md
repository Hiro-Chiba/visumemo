# VisuMemo Web

“開かなくても内容がだいたい分かる”——iPhoneの写真アプリ風グリッドで並ぶ**サムネ付きメモ**の Web アプリです。Next.js (App Router) + Supabase を採用し、保存時にメモビューを画像化してサムネを自動生成します。Vercel にワンクリックでデプロイ可能で、TypeScript strict / ESLint / Prettier による型安全な開発体験を提供します。

## 主な特徴
- Masonry 風グリッドでサムネ・タイトル・プレビューを一覧表示
- メモ保存時に html-to-image でビューを JPEG 化し、Supabase Storage に保存
- タイトル / プレビューの部分一致検索と更新日時降順ソート
- Supabase Auth / Postgres / Storage と連携し、ユーザーごとのメモを管理
- TypeScript strict・`any` 禁止、ESLint/Prettier を同梱

## 技術スタック
- Next.js 14 (App Router) / React 18 / TypeScript
- Supabase (Auth, Postgres, Storage)
- html-to-image, next/image
- Tailwind CSS
- dayjs, zod

## ディレクトリ構成
- `app/` — App Router 構成。`page.tsx` が一覧、`app/notes/*` が作成・編集ページです。
- `components/` — UI コンポーネント（NoteCard, MasonryGrid, NoteEditor など）。
- `lib/` — Supabase クライアントやユーティリティ（preview 生成、サムネキャプチャ）。
- `styles/` — Tailwind を適用したグローバルスタイル。

## 環境変数
Vercel やローカルで以下を設定してください。

| 変数名 | 用途 |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase プロジェクト URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 公開 anon key（ブラウザ向け） |
| `SUPABASE_SERVICE_ROLE_KEY` | Server Actions / RSC で使用する service role key（クライアントには露出させない） |

## セットアップ
```bash
pnpm install
pnpm dev
```

- `http://localhost:3000` にアクセスして動作確認
- Supabase Auth を使うため、メールリンク認証などを有効化してください（サンプルの `/login` で OTP メールを送信できます）

## Lint / 型チェック / ビルド
```bash
pnpm lint
pnpm build
```

TypeScript は strict モード。ESLint では `no-explicit-any` などを強制しています。

## デプロイ
1. リポジトリを GitHub にプッシュ
2. Vercel で **New Project** → リポジトリを選択
3. 上記の環境変数を **Project Settings → Environment Variables** に設定
4. 追加設定なしで Deploy（ビルドコマンドは `pnpm build`）

## Supabase 側のセットアップ
- Postgres: `notes` テーブルを以下スキーマで作成
  ```sql
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
  ```
- Storage: `thumbs` バケットを作成し、`{noteId}.jpg` 形式で保存できるようポリシーを設定

## ライセンス
MIT License
