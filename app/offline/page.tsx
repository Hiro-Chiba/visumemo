export const metadata = {
  title: 'オフライン - VisuMemo'
};

export default function OfflinePage() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-2xl font-semibold">オフラインです</h1>
      <p className="max-w-sm text-sm text-slate-400">
        ネットワークに再接続すると、メモの最新情報が自動的に同期されます。保存済みの一覧とサムネイルは表示できます。
      </p>
    </main>
  );
}
