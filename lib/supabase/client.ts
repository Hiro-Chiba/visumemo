import { createBrowserClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '../types';

let client: ReturnType<typeof createBrowserClient<Database>> | null = null;

export const getSupabaseBrowserClient = () => {
  if (client) {
    return client;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error('Supabase の公開URLとAnon Keyが設定されていません');
  }

  client = createBrowserClient<Database>(url, anonKey);
  return client;
};
