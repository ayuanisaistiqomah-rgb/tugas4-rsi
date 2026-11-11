import express, { type Application } from 'express';
import cors from 'cors';
import { sql } from 'drizzle-orm';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './docs/swagger-output.json' with { type: 'json' };
import { getDb } from './db/index.ts';
import { authRouter } from './routes/authRouter.ts';
import { stallRouter } from './routes/stallRouter.ts';
import { menuItemRouter } from './routes/menuItemRouter.ts';
import { userRouter } from './routes/userRouter.ts';
import { reviewRouter } from './routes/reviewRouter.ts';
import { likeRouter } from './routes/likeRouter.ts';
import { flagRouter } from './routes/flagRouter.ts';
import { auditLogRouter } from './routes/auditLogRouter.ts';
import { notFoundHandler } from './middlewares/notFound.ts';
import { errorHandler } from './middlewares/errorHandler.ts';

const app: Application = express();
const PORT: number = 3000;

app.use(cors({ origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173' }));
app.use(express.json());

// Dokumentasi API (Swagger UI).
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Tanpa try/catch: Express 5 meneruskan error handler async ke errorHandler.
app.get('/health', async (_req, res) => {
  const db = await getDb();
  await db.execute(sql`SELECT 1 AS ok`);
  res.status(200).json({ status: 'success', message: 'Server dan database terhubung' });
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/stalls', stallRouter);
app.use('/api/v1/menu-items', menuItemRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/likes', likeRouter);
app.use('/api/v1/flags', flagRouter);
app.use('/api/v1/audit-logs', auditLogRouter);

// 404 untuk rute tak dikenal, lalu error handler terpusat (WAJIB paling akhir).
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});