import { headers } from 'next/headers';

const HEADER_KEY = 'x-user-id';

const fallbackUserId = () => process.env['DEFAULT_USER_ID'] ?? null;

type Options = {
  required?: boolean;
};

export function getUserId(options: Options = {}): string | null {
  const requestHeaders = headers();
  const headerValue = requestHeaders.get(HEADER_KEY);
  const value = headerValue?.trim() || fallbackUserId();
  if (!value && options.required) {
    throw new Error('x-user-id ヘッダが必要です');
  }
  return value ?? null;
}

export function requireUserId(): string {
  const value = getUserId({ required: true });
  if (!value) {
    throw new Error('x-user-id ヘッダが必要です');
  }
  return value;
}
