import 'dotenv/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generated/prisma/client.js';

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST ?? '127.0.0.1',
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? 'inventory_user',
  password: process.env.DB_PASSWORD ?? 'change-me',
  database: process.env.DB_NAME ?? 'inventory',
  connectionLimit: 5
});

export const prisma = new PrismaClient({ adapter });
