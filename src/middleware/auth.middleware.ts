import type { NextFunction, Request, Response } from 'express';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '../lib/auth.js';

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session?.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Valid session required',
      });
    }

    (req as Request & { user?: typeof session.user; session?: typeof session.session }).user = session.user;
    (req as Request & { user?: typeof session.user; session?: typeof session.session }).session = session.session;

    return next();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid or expired session';
    return res.status(401).json({
      error: 'Unauthorized',
      message,
    });
  }
};

export const optionalAuth = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (session?.user) {
      (req as Request & { user?: typeof session.user; session?: typeof session.session }).user = session.user;
      (req as Request & { user?: typeof session.user; session?: typeof session.session }).session = session.session;
    }

    return next();
  } catch {
    return next();
  }
};
