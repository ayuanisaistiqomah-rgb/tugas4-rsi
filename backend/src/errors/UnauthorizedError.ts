import { AppError } from './AppError.ts';

/**
 * Belum terautentikasi: token tidak ada, salah format, signature salah,
 * atau kedaluwarsa. HTTP 401 ("kamu siapa?" belum terjawab).
 */
export class UnauthorizedError extends AppError {
  constructor(message = 'Token tidak ada atau tidak valid') {
    super(401, message);
    this.name = 'UnauthorizedError';
  }
}