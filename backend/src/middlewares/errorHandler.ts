import type { ErrorRequestHandler } from 'express';
import { AppError } from '../errors/AppError.ts';

/**
 * Mengambil kode error SQL Server. Drizzle kadang membungkus error driver,
 * sehingga number berada di dalam cause, bukan di level atas.
 */
function getSqlErrorNumber(error: unknown): number | undefined {
  let current: unknown = error;
  for (let depth = 0; depth < 5; depth += 1) {
    if (typeof current !== 'object' || current === null) return undefined;
    const code = (current as { number?: unknown }).number;
    if (typeof code === 'number') return code;
    current = (current as { cause?: unknown }).cause;
  }
  return undefined;
}

/**
 * Error handling terpusat: SATU tempat yang mengubah semua error menjadi
 * respons JSON dengan format yang sama. Didaftarkan paling akhir di index.ts.
 */
export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  // 1) Body JSON rusak (dilempar otomatis oleh express.json).
  const bodyError = error as SyntaxError & { status?: number; type?: string };
  if (error instanceof SyntaxError && bodyError.status === 400 && bodyError.type === 'entity.parse.failed') {
    res.status(400).json({ status: 'fail', message: 'JSON pada body tidak valid' });
    return;
  }

  // 2) Error aplikasi yang disengaja: Validation (400), Unauthorized (401),
  //    Forbidden (403), NotFound (404), dll. Semuanya turunan AppError.
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      status: 'fail',
      message: error.message,
      ...(error.details !== undefined ? { errors: error.details } : {}),
    });
    return;
  }

  // 3) Constraint database: 2627 = data unik bentrok, 547 = foreign key.
  const sqlNumber = getSqlErrorNumber(error);
  if (sqlNumber === 2627 || sqlNumber === 547) {
    res.status(409).json({ status: 'fail', message: 'Data bentrok dengan data yang sudah ada' });
    return;
  }

  // 4) Error tak terduga: dicatat di terminal, detailnya tidak dibocorkan ke client.
  console.error('Unhandled error:', error);
  res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server' });
};