import type { AuthUser } from '../services/tokenService.ts';

// Menambahkan properti user ke Request Express supaya req.user dikenali
// di semua file. Opsional (?) karena route publik tidak menjalankan authenticate.
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export {};