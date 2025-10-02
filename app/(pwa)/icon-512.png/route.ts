import { createIconResponse } from '@/src/lib/pwa-icon';

export const runtime = 'edge';
export function GET() {
  return createIconResponse(512);
}
