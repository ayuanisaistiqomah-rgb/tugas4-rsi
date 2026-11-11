import { Router } from 'express';
import { AuthController } from '../controllers/authController.ts';
import { validate } from '../middlewares/validate.ts';
import { authenticate } from '../middlewares/auth.ts';
import { loginSchema, registerSchema } from '../schemas/authSchema.ts';

const authRouter = Router();
const authController = new AuthController();

authRouter.post('/register', validate(registerSchema, 'body'), (req, res) => {
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Daftar akun baru (role otomatis customer)'
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/RegisterInput' } }
  // #swagger.responses[201] = { description: 'Akun berhasil dibuat' }
  // #swagger.responses[400] = { description: 'Validasi gagal' }
  // #swagger.responses[409] = { description: 'Email sudah terdaftar' }
  return authController.register(req, res);
});

authRouter.post('/login', validate(loginSchema, 'body'), (req, res) => {
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Login dan terima token JWT'
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/LoginInput' } }
  // #swagger.responses[200] = { description: 'Login berhasil, token dikembalikan' }
  // #swagger.responses[400] = { description: 'Validasi gagal' }
  // #swagger.responses[401] = { description: 'Email atau password salah' }
  return authController.login(req, res);
});

authRouter.get('/me', authenticate, (req, res) => {
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Data user dari token'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.responses[200] = { description: 'Data user yang sedang login' }
  // #swagger.responses[401] = { description: 'Token tidak ada atau tidak valid' }
  return authController.getMe(req, res);
});

export { authRouter };