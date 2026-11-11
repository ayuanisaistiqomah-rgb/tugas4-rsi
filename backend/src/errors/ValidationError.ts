import { AppError } from './AppError.ts';

export interface ValidationIssue {
  field: string;
  message: string;
}

/** Input tidak lolos validasi zod. HTTP 400, membawa daftar { field, message }. */
export class ValidationError extends AppError {
  constructor(public readonly issues: ValidationIssue[]) {
    super(400, 'Validasi gagal', issues);
    this.name = 'ValidationError';
  }
}