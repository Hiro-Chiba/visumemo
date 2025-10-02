const moduleName = '@vercel/blob';

const buildMissingModuleError = () =>
  new Error(`依存パッケージ "${moduleName}" がインストールされていません。npm install ${moduleName} を実行してください。`);

type PutArgs = [string, Blob | ArrayBuffer | BufferSource | AsyncIterable<Uint8Array> | NodeJS.ReadableStream, Record<string, unknown>?];

type PutReturn = Promise<{ url: string }>;

export const put = (..._args: PutArgs): PutReturn => {
  return Promise.reject(buildMissingModuleError());
};
