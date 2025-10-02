# VisuMemo PWA

VisuMemo は「開かなくても内容がわかる」サムネイル付きメモアプリです。Next.js 14 (App Router) と Prisma + Neon(Postgres) を採用し、保存時に DOM を JPEG 化して Vercel Blob へ保存します。PWA 対応により iOS / Android のホーム画面からネイティブアプリのように起動できます。

## 主な特徴
- 2〜4 列レスポンシブ Masonry グリッドでサムネイルとプレビューを一覧表示
- メモ保存時に html-to-image でプレビュー DOM を JPEG 化し、Vercel Blob にアップロード
- Prisma + Neon(Postgres) による永続化、`x-user-id` ヘッダーでユーザーを簡易分離
- PWA (Web App Manifest + カスタム Service Worker) によるオフライン閲覧・A2HS 対応
- Tailwind CSS ベースのモバイル優先 UI、safe-area 対応ボトムナビゲーション

## ディレクトリ構成
- `app/` — App Router 構成。`page.tsx` が一覧、`app/notes/*` が作成・編集ページ、`app/api/*` が API ルートです。
- `components/` — UI コンポーネント（Masonry、NoteCard、NoteEditor など）。
- `src/lib/` — Prisma クライアントやヘッダー認証ユーティリティ、プレビュー文字列生成など。
- `public/` — PWA マニフェスト、アイコン、Service Worker。
- `prisma/` — Prisma schema。`Note` モデルが Neon(Postgres) 上のテーブルになります。

## 必須環境変数
| 変数名 | 用途 |
| --- | --- |
| `POSTGRES_URL` | Neon(Postgres) への接続文字列 |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob の Read/Write トークン |
| `DEFAULT_USER_ID` | ローカル開発用のデフォルトユーザー ID（任意） |

API・ページは `x-user-id` ヘッダーでユーザーを判別します。ローカル開発でヘッダーを付与できない場合は、`DEFAULT_USER_ID` を設定すると同値が利用されます。

## セットアップ
```bash
pnpm install
pnpm dlx prisma generate
pnpm dev
```

`.env.local` に上記環境変数を設定し、Neon に対して `prisma db push` でテーブルを作成してください。

## Lint / 型チェック / ビルド
```bash
pnpm lint
pnpm build
```

TypeScript は `strict` モード。ESLint では `no-explicit-any` などを禁止しています。

## PWA について
- `public/manifest.webmanifest` と `public/sw.js` で A2HS・オフライン表示に対応
- オフライン時は `/offline` ページを返すよう Service Worker が制御
- サムネイル・API レスポンスは Stale-While-Revalidate 戦略、ナビゲーションは Network-First 戦略

## サムネイル生成フロー
1. NoteEditor で保存ボタン押下
2. `html-to-image` でプレビュー DOM を JPEG へ変換
3. `/api/blob/put` にバイナリ POST → Vercel Blob の公開 URL を取得
4. `/api/notes/:id` に PATCH して `thumbUrl` を保存
5. 一覧画面では `next/image` でサムネイルを表示

## ライセンス
MIT License
