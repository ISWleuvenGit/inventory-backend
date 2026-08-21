import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'repository/prisma/schema.prisma',
  migrations: {
    path: 'repository/prisma/migrations'
  },
  datasource: {
    url: env('DATABASE_URL')
  }
});
