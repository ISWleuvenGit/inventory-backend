import { betterAuth } from 'better-auth';
import { prismaAdapter } from '@better-auth/prisma-adapter';
import { prisma } from './prisma.js';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'mysql',
  }),
  secret: process.env.BETTER_AUTH_SECRET ?? 'dev-secret-key-change-me-in-production-123456',
  baseURL: process.env.BACKEND_URL ?? 'http://localhost:3000',
  trustedOrigins: [
    process.env.FRONTEND_URL,
    'http://localhost:8080',
    'http://127.0.0.1:8080',
    'http://localhost:3000',
  ].filter((value): value is string => Boolean(value)),
  emailAndPassword: {
    enabled: true,
  },
});
