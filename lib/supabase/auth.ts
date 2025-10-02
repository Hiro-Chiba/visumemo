import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '../types';

export const getServerSupabaseClient = () => {
  const cookieStore = cookies();
  return createServerComponentClient<Database>({
    cookies: () => cookieStore
  });
};

export const getAuthenticatedUser = async () => {
  const supabase = getServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  return user;
};
