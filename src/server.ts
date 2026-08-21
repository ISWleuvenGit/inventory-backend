import 'dotenv/config';
import cors from 'cors';
import express from 'express';

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(cors());
app.use(express.json());

app.get('/health', (_request, response) => {
  response.json({
    status: 'ok',
    service: 'inventory-backend'
  });
});

app.get('/ready', (_request, response) => {
  response.json({
    status: 'ready'
  });
});

app.listen(port, () => {
  console.log(`Inventory backend listening on http://localhost:${port}`);
});