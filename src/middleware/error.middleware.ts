import type { NextFunction, Request, Response } from 'express';

export const notFoundHandler = (_req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not found',
    timestamp: new Date().toISOString(),
  });
};

export const errorHandler = (
  error: Error & { statusCode?: number; status?: number },
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const statusCode = error.statusCode ?? error.status ?? 500;

  res.status(statusCode).json({
    error: error.message ?? 'Internal server error',
    timestamp: new Date().toISOString(),
  });
};
