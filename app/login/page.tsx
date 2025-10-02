'use client';

import { useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const supabase = getSupabaseBrowserClient();
    setLoading(true);
    setMessage('');
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin }
    });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('メールを確認してログインを完了してください。');
    }
    setLoading(false);
  };

  return (
    <main className="mx-auto max-w-md space-y-6 rounded-xl bg-surfaceLight p-8 shadow-card">
      <h1 className="text-2xl font-bold text-slate-100">サインイン</h1>
      <p className="text-sm text-slate-400">登録済みのメールアドレスにログインリンクを送信します。</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm font-medium text-slate-300">
          メールアドレス
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="mt-2 w-full rounded-lg bg-slate-900 px-4 py-2"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-sky-300 disabled:opacity-60"
        >
          {loading ? '送信中...' : 'ログインリンクを送信'}
        </button>
      </form>
      {message ? <p className="text-sm text-slate-300">{message}</p> : null}
    </main>
  );
}
