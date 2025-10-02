# VisuMemo Web

“開かなくても内容がだいたい分かる”——iPhoneの写真アプリ風グリッドで並ぶ**サムネ付きメモ**のWebアプリ。
Next.js (App Router) + Supabase を採用し、保存時にメモビューを画像化してサムネを自動生成。  
Vercel にワンクリックでデプロイ可能、型安全な TypeScript・ESLint/Prettier 付き。

## 主な特徴
- 写真アプリ風の**Masonryグリッド**でメモを一覧表示（サムネ＋タイトル＋プレビュー1行）
- メモ保存時に**html-to-image**でビューをJPEG化→Supabase Storageに保存
- タイトル/先頭文で軽量検索、並び替え（更新順）
- 認証・DB・Storageは**Supabase**（Postgres/Storage）
- すべて**TypeScript strict**、`any`禁止

## スタック
- Next.js 14 (App Router) / React 18 / TypeScript
- Supabase (Auth, Postgres, Storage)
- html-to-image, next/image
- Tailwind CSS（軽量UI）
- Vercel（デプロイ）

## 環境変数（Vercel Project Settings）
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`  # RSC/Server Actions 用（安全にServerのみで使用）

## セットアップ
```bash
pnpm i
pnpm dev
