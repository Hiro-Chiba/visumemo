import { createIconResponse } from '@/src/lib/pwa-icon';

export const runtime = 'edge';
export const size = { width: 192, height: 192 };
export const contentType = 'image/png';

export function GET() {
  return createIconResponse(192);
}
