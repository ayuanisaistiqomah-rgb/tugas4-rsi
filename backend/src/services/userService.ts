import bcrypt from 'bcryptjs';
import { UserRepository, type UserRole } from '../repositories/userRepository.ts';

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository = new UserRepository()) {
    this.userRepository = userRepository;
  }

  async getAllUsers(role?: UserRole) {
    return this.userRepository.findAll(role);
  }

  async createUser(input: CreateUserInput) {
    const email = input.email.trim().toLowerCase();

    const existing = await this.userRepository.findByEmail(email);
    if (existing) throw new Error('EMAIL_EXISTS');

    // bcrypt, sama seperti register, supaya user ini juga bisa login.
    const passwordHash = await bcrypt.hash(input.password, Number(process.env.BCRYPT_SALT_ROUNDS ?? 10));

    const row = await this.userRepository.create({
      name: input.name.trim(),
      email,
      passwordHash,
      role: input.role ?? 'customer',
    });
    if (!row) throw new Error('USER_CREATE_FAILED');

    // Ambil ulang lewat kolom publik supaya password_hash tidak ikut terkirim.
    return this.userRepository.findById(row.id);
  }
}