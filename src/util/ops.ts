import type { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'node:crypto';
import { prisma } from '../lib/prisma.js';

export const addRequestId = (req: Request, _res: Response, next: NextFunction) => {
  (req as Request & { requestId?: string }).requestId = randomUUID();
  next();
};

export const logRequest = (req: Request, _res: Response, next: NextFunction) => {
  const requestId = (req as Request & { requestId?: string }).requestId ?? 'unknown';
  console.log(`[${requestId}] ${req.method} ${req.originalUrl}`);
  next();
};

export const requestTimer = (req: Request, _res: Response, next: NextFunction) => {
  const requestId = (req as Request & { requestId?: string }).requestId ?? 'unknown';
  const start = Date.now();

  _res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${requestId}] ${req.method} ${req.originalUrl} ${_res.statusCode} ${duration}ms`);
  });

  next();
};

export const checkDatabase = async () => {
  const startedAt = Date.now();

  try {
    await prisma.$queryRaw`SELECT 1`;
    return {
      ok: true,
      latency: Date.now() - startedAt,
      error: undefined,
    };
  } catch (error) {
    return {
      ok: false,
      latency: Date.now() - startedAt,
      error: error instanceof Error ? error.message : 'Database unavailable',
    };
  }
};

export const checkReadiness = async () => {
  const database = await checkDatabase();

  return {
    ready: database.ok && Boolean(process.env.DATABASE_URL) && Boolean(process.env.BETTER_AUTH_SECRET),
    database,
    environment: {
      databaseUrl: Boolean(process.env.DATABASE_URL),
      authSecret: Boolean(process.env.BETTER_AUTH_SECRET),
    },
    services: {
      auth: Boolean(process.env.BETTER_AUTH_SECRET),
    },
  };
};
