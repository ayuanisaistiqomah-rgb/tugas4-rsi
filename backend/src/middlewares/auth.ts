import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { verifyToken, type AuthUser } from '../services/tokenService.ts';
import { UnauthorizedError } from '../errors/UnauthorizedError.ts';

const BEARER_PREFIX = 'Bearer ';

/** Ambil token dari header "Authorization: Bearer <token>". */
function extractToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header || !header.startsWith(BEARER_PREFIX)) return null;
  const token = header.slice(BEARER_PREFIX.length).trim();
  return token.length > 0 ? token : null;
}

/** Memastikan request membawa token valid, lalu menyimpan datanya di req.user. */
export const authenticate: RequestHandler = (req: Request, _res: Response, next: NextFunction) => {
  const token = extractToken(req);
  if (!token) {
    return next(new UnauthorizedError('Header Authorization dengan token Bearer wajib dikirim'));
  }

  try {
    req.user = verifyToken(token);
    return next();
  } catch {
    return next(new UnauthorizedError());
  }
};

/** Pembaca req.user yang aman: melempar 401 kalau authenticate lupa dipasang. */
export function getUser(req: Request): AuthUser {
  if (!req.user) {
    throw new UnauthorizedError('Endpoint ini harus dipakai setelah middleware authenticate');
  }
  return req.user;
}