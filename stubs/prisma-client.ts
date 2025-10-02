const buildMissingModuleError = (moduleName: string) =>
  new Error(
    `依存パッケージ "${moduleName}" がインストールされていません。npm install ${moduleName} を実行して依存関係を準備してください。`
  );

type AsyncMethod = (...args: unknown[]) => Promise<never>;

const createAsyncMethod = (moduleName: string): AsyncMethod => {
  return async () => {
    throw buildMissingModuleError(moduleName);
  };
};

class PrismaNoteDelegate {
  findFirst = createAsyncMethod('@prisma/client');
  findMany = createAsyncMethod('@prisma/client');
  create = createAsyncMethod('@prisma/client');
  update = createAsyncMethod('@prisma/client');
  updateMany = createAsyncMethod('@prisma/client');
}

class PrismaClient {
  note: PrismaNoteDelegate;

  constructor() {
    this.note = new PrismaNoteDelegate();
  }

  $disconnect = createAsyncMethod('@prisma/client');
}

const Prisma = {} as const;

export { PrismaClient, Prisma };
