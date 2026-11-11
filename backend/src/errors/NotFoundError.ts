import { AppError } from './AppError.ts';

/** Data yang dicari tidak ada. HTTP 404. */
export class NotFoundError extends AppError {
  constructor(message = 'Data tidak ditemukan') {
    super(404, message);
    this.name = 'NotFoundError';
  }
}