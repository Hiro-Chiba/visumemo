import fs from 'node:fs';
import path from 'node:path';

const resolveModulePath = (moduleName) =>
  path.join(process.cwd(), 'node_modules', ...moduleName.split('/'));

const fallbackAliases = {};

if (!fs.existsSync(resolveModulePath('@prisma/client'))) {
  fallbackAliases['@prisma/client'] = path.join(process.cwd(), 'stubs', 'prisma-client.ts');
}

if (!fs.existsSync(resolveModulePath('@vercel/blob'))) {
  fallbackAliases['@vercel/blob'] = path.join(process.cwd(), 'stubs', 'vercel-blob.ts');
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.blob.vercel-storage.com'
      }
    ]
  },
  webpack: (config) => {
    if (Object.keys(fallbackAliases).length > 0) {
      config.resolve = config.resolve ?? {};
      config.resolve.alias = {
        ...(config.resolve.alias ?? {}),
        ...fallbackAliases
      };
    }

    return config;
  }
};

export default nextConfig;
