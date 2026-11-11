/**
 * Error dasar aplikasi yang membawa status code HTTP.
 * Error lain (NotFound, Validation, Unauthorized, Forbidden) menurun dari sini.
 */
export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'AppError';
  }
}