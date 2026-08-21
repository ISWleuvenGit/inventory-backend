import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';

const meRouter = Router();

meRouter.get('/me', requireAuth, async (req, res) => {
  const user = (req as typeof req & { user?: { id: string; email: string; name?: string | null } }).user;

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  return res.status(200).json({
    id: user.id,
    email: user.email,
    name: user.name ?? null,
  });
});

export { meRouter };
