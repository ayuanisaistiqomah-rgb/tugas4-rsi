import type { Request, Response } from 'express';
import { ReviewService } from '../services/reviewService.ts';
import { getUser } from '../middlewares/auth.ts';
import { getValidated } from '../middlewares/validate.ts';
import type { IdParam } from '../schemas/stallSchema.ts';
import type { CreateReviewInput, ReviewQuery } from '../schemas/reviewSchema.ts';

export class ReviewController {
  private reviewService: ReviewService;

  constructor(reviewService: ReviewService = new ReviewService()) {
    this.reviewService = reviewService;
  }

  getReviews = async (_req: Request, res: Response): Promise<void> => {
    const { stallId } = getValidated<ReviewQuery>(res, 'query');
    const data = await this.reviewService.getAllReviews(stallId);
    res.status(200).json({ status: 'success', data });
  };

  // POST /stalls/:id/reviews -> id di URL adalah id warung.
  createReview = async (req: Request, res: Response): Promise<void> => {
    const { id: stallId } = getValidated<IdParam>(res, 'params');
    const body = getValidated<CreateReviewInput>(res, 'body');
    const { id: userId } = getUser(req); // penulis = user dari token
    const data = await this.reviewService.createReview(stallId, userId, body);
    res.status(201).json({ status: 'success', data });
  };

  deleteReview = async (req: Request, res: Response): Promise<void> => {
    const { id } = getValidated<IdParam>(res, 'params');
    const data = await this.reviewService.deleteReview(id, getUser(req));
    res.status(200).json({ status: 'success', data });
  };
}