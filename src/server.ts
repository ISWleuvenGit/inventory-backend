import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { fromNodeHeaders, toNodeHandler } from 'better-auth/node';
import { meRouter } from './controller/me.routes.js';
import { userRouter } from './controller/user.routes.js';
import { auth } from './lib/auth.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';
import { addRequestId, checkDatabase, checkReadiness, logRequest, requestTimer } from './util/ops.js';

const app = express();
const port = Number(process.env.PORT ?? 3000);

const forwardAuthResponse = async (authResponse: Response, res: express.Response) => {
  const setCookies = (authResponse.headers as any).getSetCookie?.() as string[] | undefined;
  if (setCookies && setCookies.length > 0) {
    res.setHeader('set-cookie', setCookies);
  } else {
    const setCookie = authResponse.headers.get('set-cookie');
    if (setCookie) {
      res.setHeader('set-cookie', setCookie);
    }
  }

  const contentType = authResponse.headers.get('content-type');
  if (contentType) {
    res.setHeader('content-type', contentType);
  }

  const text = await authResponse.text();
  return res.status(authResponse.status).send(text);
};

app.set('trust proxy', 1);
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
);

app.use(addRequestId);
app.use(logRequest);
app.use(requestTimer);

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  }),
);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body ?? {};

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    const result = await auth.api.signUpEmail({
      body: {
        email: String(email),
        password: String(password),
        name: String(name),
      },
      headers: fromNodeHeaders(req.headers),
      asResponse: true,
    });

    return forwardAuthResponse(result, res);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Registration failed';
    return res.status(400).json({ error: message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body ?? {};

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await auth.api.signInEmail({
      body: {
        email: String(email),
        password: String(password),
      },
      headers: fromNodeHeaders(req.headers),
      asResponse: true,
    });

    return forwardAuthResponse(result, res);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed';
    return res.status(401).json({ error: message });
  }
});

app.get('/api/auth/session', async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    return res.status(200).json(session);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Session lookup failed';
    return res.status(401).json({ error: message });
  }
});

app.use('/api/auth', authLimiter);
app.use('/api/auth', toNodeHandler(auth));
app.use('/api', meRouter);
app.use('/users', userRouter);

app.get('/health', async (_req, res) => {
  const result = await checkDatabase();

  res.status(result.ok ? 200 : 503).json({
    status: result.ok ? 'ok' : 'not-ready',
    database: result.ok ? 'connected' : 'unavailable',
  });
});

app.get('/ready', async (_req, res) => {
  const readiness = await checkReadiness();

  res.status(readiness.ready ? 200 : 503).json(readiness);
});

app.get('/', (_req, res) => {
  res.json({
    message: 'Inventory backend',
    health: '/health',
    ready: '/ready',
    auth: '/api/auth',
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});

export default app;