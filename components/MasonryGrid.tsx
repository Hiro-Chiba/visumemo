import type { ReactNode } from 'react';

type MasonryGridProps = {
  children: ReactNode;
};

const columnStyles =
  'columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 [&>*]:mb-4';

export function MasonryGrid({ children }: MasonryGridProps) {
  return <div className={columnStyles}>{children}</div>;
}
