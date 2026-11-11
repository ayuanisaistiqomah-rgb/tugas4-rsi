/** Data user yang aman dikirim ke client (tanpa password_hash). */
export interface AuthUserDto {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'owner' | 'customer';
}

export interface LoginResponseDto {
  token: string;
  tokenType: 'Bearer';
  expiresIn: string;
  user: AuthUserDto;
}