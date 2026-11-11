import { Router } from 'express';
import { UserController } from '../controllers/userController.ts';
import { authenticate } from '../middlewares/auth.ts';
import { authorize } from '../middlewares/authorize.ts';

const userRouter = Router();
const userController = new UserController();

// Kelola user hanya untuk admin. Pendaftaran mandiri lewat POST /auth/register.
userRouter.get('/', authenticate, authorize('admin'), (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = 'Daftar user (tanpa password) - admin'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['role'] = { in: 'query', type: 'string', enum: ['admin', 'owner', 'customer'], description: 'Filter berdasarkan role' }
  // #swagger.responses[200] = { description: 'Daftar user' }
  // #swagger.responses[401] = { description: 'Token tidak ada atau tidak valid' }
  // #swagger.responses[403] = { description: 'Hanya admin' }
  return userController.getUsers(req, res);
});

userRouter.post('/', authenticate, authorize('admin'), (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = 'Tambah user dengan role tertentu - admin'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/UserInput' } }
  // #swagger.responses[201] = { description: 'User dibuat' }
  // #swagger.responses[401] = { description: 'Token tidak ada atau tidak valid' }
  // #swagger.responses[403] = { description: 'Hanya admin' }
  // #swagger.responses[409] = { description: 'Email sudah terdaftar' }
  return userController.createUser(req, res);
});

export { userRouter };