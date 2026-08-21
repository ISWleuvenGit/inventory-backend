import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { prisma } from './lib/prisma.js';

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(cors());
app.use(express.json());

app.get('/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.get('/ready', async (_request, response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    response.json({
      status: 'ready',
      database: 'connected'
    });
  } catch {
    response.status(503).json({
      status: 'not-ready',
      database: 'unavailable'
    });
  }
});

app.get('/api/products', async (_request, response) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });

    response.json(products);
  } catch {
    response.status(500).json({
      error: 'Failed to fetch products'
    });
  }
});

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
