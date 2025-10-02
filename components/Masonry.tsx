import type { ReactNode } from 'react';

export function Masonry({ children }: { children: ReactNode }) {
  return (
    <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
      {children}
    </div>
  );
}
