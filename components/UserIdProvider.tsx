'use client';

import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

const UserIdContext = createContext<string | null>(null);

export function UserIdProvider({
  value,
  children
}: {
  value: string | null;
  children: ReactNode;
}) {
  return <UserIdContext.Provider value={value}>{children}</UserIdContext.Provider>;
}

export function useUserId() {
  return useContext(UserIdContext);
}
