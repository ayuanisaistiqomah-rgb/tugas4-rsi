import { AppError } from './AppError.ts';

/**
 * Sudah login (token valid) tetapi tidak punya akses: role tidak cocok
 * atau bukan pemilik data. HTTP 403 ("kami tahu kamu siapa, tapi tidak boleh").
 */
export class ForbiddenError extends AppError {
  constructor(message = 'Kamu tidak punya akses ke resource ini') {
    super(403, message);
    this.name = 'ForbiddenError';
  }
}