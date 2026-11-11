import { Router } from 'express';
import { ReviewController } from '../controllers/reviewController.ts';
import { validate } from '../middlewares/validate.ts';
import { authenticate } from '../middlewares/auth.ts';
import { idParamSchema } from '../schemas/stallSchema.ts';
import { reviewQuerySchema } from '../schemas/reviewSchema.ts';

const reviewRouter = Router();
const reviewController = new ReviewController();

reviewRouter.get('/', validate(reviewQuerySchema, 'query'), (req, res) => {
  // #swagger.tags = ['Reviews']
  // #swagger.summary = 'Daftar review + nama user (JOIN) - publik'
  // #swagger.parameters['stallId'] = { in: 'query', type: 'integer', description: 'Filter berdasarkan ID warung' }
  // #swagger.responses[200] = { description: 'Daftar review' }
  // #swagger.responses[400] = { description: 'Query tidak valid' }
  return reviewController.getReviews(req, res);
});

reviewRouter.delete('/:id', authenticate, validate(idParamSchema, 'params'), (req, res) => {
  // #swagger.tags = ['Reviews']
  // #swagger.summary = 'Hapus review - penulisnya sendiri atau admin'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.responses[200] = { description: 'Review terhapus' }
  // #swagger.responses[401] = { description: 'Token tidak ada atau tidak valid' }
  // #swagger.responses[403] = { description: 'Bukan penulis review' }
  // #swagger.responses[404] = { description: 'Review tidak ditemukan' }
  return reviewController.deleteReview(req, res);
});

export { reviewRouter };