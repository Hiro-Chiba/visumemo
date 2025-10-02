declare module '@prisma/client' {
  export type Note = {
    id: string;
    userId: string;
    title: string;
    body: string;
    previewText: string;
    thumbUrl: string | null;
    contentUpdatedAt: Date;
    thumbUpdatedAt: Date | null;
    isDeleted: boolean;
  };

  class PrismaNoteDelegate {
    findFirst: (..._args: unknown[]) => Promise<Note | null>;
    findMany: (..._args: unknown[]) => Promise<Note[]>;
    create: (..._args: unknown[]) => Promise<Note>;
    update: (..._args: unknown[]) => Promise<Note>;
    updateMany: (..._args: unknown[]) => Promise<{ count: number }>;
  }

  export class PrismaClient {
    note: PrismaNoteDelegate;
    constructor(..._args: unknown[]);
    $disconnect: (..._args: unknown[]) => Promise<void>;
  }

  export const Prisma: Record<string, unknown>;
}

declare module '@vercel/blob' {
  export type PutOptions = {
    access?: 'public' | 'private';
    contentType?: string;
    token?: string;
    cacheControlMaxAge?: number;
  } & Record<string, unknown>;

  export const put: (
    _pathname: string,
    _data: ArrayBuffer | BufferSource | Blob | AsyncIterable<Uint8Array> | NodeJS.ReadableStream,
    _options?: PutOptions
  ) => Promise<{ url: string }>;
}
