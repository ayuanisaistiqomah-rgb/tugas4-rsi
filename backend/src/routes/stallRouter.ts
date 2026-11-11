import { Router } from 'express';
import { StallController } from '../controllers/stallController.ts';
import { ReviewController } from '../controllers/reviewController.ts';
import { validate } from '../middlewares/validate.ts';
import { authenticate } from '../middlewares/auth.ts';
import { authorize } from '../middlewares/authorize.ts';
import {
  createStallSchema,
  idParamSchema,
  stallQuerySchema,
  updateStallSchema,
} from '../schemas/stallSchema.ts';
import { createReviewSchema } from '../schemas/reviewSchema.ts';

const stallRouter = Router();
const stallController = new StallController();
const reviewController = new ReviewController();

// ---------------------------------------------------------------- publik
stallRouter.get('/', validate(stallQuerySchema, 'query'), (req, res) => {
  // #swagger.tags = ['Stalls']
  // #swagger.summary = 'Daftar warung (filter + pagination) - publik'
  // #swagger.parameters['search'] = { in: 'query', type: 'string', description: 'Cari nama warung' }
  // #swagger.parameters['category'] = { in: 'query', type: 'string', description: 'Filter kategori' }
  // #swagger.parameters['page'] = { in: 'query', type: 'integer', description: 'Halaman (default 1)' }
  // #swagger.parameters['limit'] = { in: 'query', type: 'integer', description: 'Data per halaman (default 10, maks 100)' }
  // #swagger.responses[200] = { description: 'Daftar warung + meta pagination' }
  // #swagger.responses[400] = { description: 'Query tidak valid' }
  return stallController.getStalls(req, res);
});

stallRouter.get('/:id', validate(idParamSchema, 'params'), (req, res) => {
  // #swagger.tags = ['Stalls']
  // #swagger.summary = 'Detail warung - publik'
  // #swagger.responses[200] = { description: 'Detail warung' }
  // #swagger.responses[400] = { description: 'id tidak valid' }
  // #swagger.responses[404] = { description: 'Warung tidak ditemukan' }
  return stallController.getStallById(req, res);
});

stallRouter.get('/:id/menus', validate(idParamSchema, 'params'), (req, res) => {
  // #swagger.tags = ['Stalls']
  // #swagger.summary = 'Menu sebuah warung - publik'
  // #swagger.responses[200] = { description: 'Daftar menu' }
  // #swagger.responses[404] = { description: 'Warung tidak ditemukan' }
  return stallController.getStallMenus(req, res);
});

// ----------------------------------------------------------- terlindungi
stallRouter.post(
  '/',
  authenticate,
  authorize('owner', 'admin'),
  validate(createStallSchema, 'body'),
  (req, res) => {
    // #swagger.tags = ['Stalls']
    // #swagger.summary = 'Tambah warung - owner, admin (ownerId dari token)'
    // #swagger.security = [{ "bearerAuth": [] }]
    // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/StallInput' } }
    // #swagger.responses[201] = { description: 'Warung dibuat' }
    // #swagger.responses[400] = { description: 'Validasi gagal' }
    // #swagger.responses[401] = { description: 'Token tidak ada atau tidak valid' }
    // #swagger.responses[403] = { description: 'Role tidak diizinkan' }
    return stallController.createStall(req, res);
  },
);

stallRouter.put(
  '/:id',
  authenticate,
  authorize('owner', 'admin'),
  validate(idParamSchema, 'params'),
  validate(updateStallSchema, 'body'),
  (req, res) => {
    // #swagger.tags = ['Stalls']
    // #swagger.summary = 'Update warung - owner (hanya miliknya), admin'
    // #swagger.security = [{ "bearerAuth": [] }]
    // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/StallUpdate' } }
    // #swagger.responses[200] = { description: 'Warung ter-update' }
    // #swagger.responses[400] = { description: 'Validasi gagal' }
    // #swagger.responses[401] = { description: 'Token tidak ada atau tidak valid' }
    // #swagger.responses[403] = { description: 'Bukan pemilik warung / role tidak diizinkan' }
    // #swagger.responses[404] = { description: 'Warung tidak ditemukan' }
    return stallController.updateStall(req, res);
  },
);

stallRouter.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  validate(idParamSchema, 'params'),
  (req, res) => {
    // #swagger.tags = ['Stalls']
    // #swagger.summary = 'Hapus warung - admin saja'
    // #swagger.security = [{ "bearerAuth": [] }]
    // #swagger.responses[200] = { description: 'Warung terhapus' }
    // #swagger.responses[401] = { description: 'Token tidak ada atau tidak valid' }
    // #swagger.responses[403] = { description: 'Hanya admin' }
    // #swagger.responses[404] = { description: 'Warung tidak ditemukan' }
    return stallController.deleteStall(req, res);
  },
);

stallRouter.post(
  '/:id/reviews',
  authenticate,
  validate(idParamSchema, 'params'),
  validate(createReviewSchema, 'body'),
  (req, res) => {
    // #swagger.tags = ['Stalls']
    // #swagger.summary = 'Tambah review untuk warung - login (userId dari token)'
    // #swagger.security = [{ "bearerAuth": [] }]
    // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/ReviewInput' } }
    // #swagger.responses[201] = { description: 'Review dibuat' }
    // #swagger.responses[400] = { description: 'Validasi gagal' }
    // #swagger.responses[401] = { description: 'Token tidak ada atau tidak valid' }
    // #swagger.responses[404] = { description: 'Warung tidak ditemukan' }
    // #swagger.responses[409] = { description: 'Sudah pernah memberi review' }
    return reviewController.createReview(req, res);
  },
);

export { stallRouter };