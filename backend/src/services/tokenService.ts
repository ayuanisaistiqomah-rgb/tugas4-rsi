import jwt, { type SignOptions } from 'jsonwebtoken';
import type { UserRole } from '../repositories/userRepository.ts';

/** Data user yang dibawa token dan nanti tersedia di req.user. */
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

/** Kunci rahasia dari .env. Sengaja tanpa nilai default supaya lupa set langsung ketahuan. */
export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET belum diset di .env');
  }
  return secret;
}

function getExpiresIn(): SignOptions['expiresIn'] {
  return (process.env.JWT_EXPIRES_IN ?? '2h') as SignOptions['expiresIn'];
}

/**
 * Membuat token. Payload hanya di-encode (bisa dibaca siapa pun),
 * jadi JANGAN pernah memasukkan password ke dalamnya.
 */
export function signToken(user: AuthUser): string {
  return jwt.sign(
    { sub: String(user.id), name: user.name, email: user.email, role: user.role },
    getJwtSecret(),
    { algorithm: 'HS256', expiresIn: getExpiresIn() },
  );
}

/** Memeriksa signature + masa berlaku token, lalu mengembalikan data user. */
export function verifyToken(token: string): AuthUser {
  const payload = jwt.verify(token, getJwtSecret(), { algorithms: ['HS256'] });

  if (typeof payload === 'string') {
    throw new jwt.JsonWebTokenError('Payload token bukan objek JSON');
  }

  const id = Number(payload.sub);
  const { name, email, role } = payload as { name?: string; email?: string; role?: UserRole };

  if (!Number.isInteger(id) || !name || !email || !role) {
    throw new jwt.JsonWebTokenError('Payload token tidak lengkap');
  }

  return { id, name, email, role };
}