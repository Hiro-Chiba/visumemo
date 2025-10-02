import { createIconResponse } from '@/src/lib/pwa-icon';

export const runtime = 'edge';
export const size = { width: 512, height: 512 };
export const contentType = 'image/png';

export function GET() {
  return createIconResponse(512);
}
