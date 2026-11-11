import { ReviewRepository } from '../repositories/reviewRepository.ts';
import { StallRepository } from '../repositories/stallRepository.ts';
import { AppError } from '../errors/AppError.ts';
import { NotFoundError } from '../errors/NotFoundError.ts';
import { ForbiddenError } from '../errors/ForbiddenError.ts';
import type { AuthUser } from './tokenService.ts';
import type { CreateReviewInput } from '../schemas/reviewSchema.ts';

export class ReviewService {
  private reviewRepository: ReviewRepository;
  private stallRepository: StallRepository;

  constructor(
    reviewRepository: ReviewRepository = new ReviewRepository(),
    stallRepository: StallRepository = new StallRepository(),
  ) {
    this.reviewRepository = reviewRepository;
    this.stallRepository = stallRepository;
  }

  // JOIN dengan USERS (userName) dan STALLS (stallName), tetap dari Tugas 2.
  async getAllReviews(stallId?: number) {
    return this.reviewRepository.findAllWithUser(stallId);
  }

  async getReviewById(id: number) {
    const row = await this.reviewRepository.findByIdWithUser(id);
    if (!row) throw new NotFoundError('Review tidak ditemukan');
    return row;
  }

  // userId datang dari token (diteruskan controller), bukan dari body.
  async createReview(stallId: number, userId: number, input: CreateReviewInput) {
    const stall = await this.stallRepository.findById(stallId);
    if (!stall) throw new NotFoundError('Warung tidak ditemukan');

    const existing = await this.reviewRepository.findByUserAndStall(userId, stallId);
    if (existing) throw new AppError(409, 'Kamu sudah pernah memberi review untuk warung ini');

    const row = await this.reviewRepository.create({
      stallId,
      userId,
      rating: input.rating,
      comment: input.comment ?? null,
    });
    if (!row) throw new AppError(500, 'Review gagal disimpan');

    await this.reviewRepository.recalcStallStats(stallId); // rating warung ikut diperbarui
    return this.getReviewById(row.id);
  }

  // Hanya penulis review atau admin yang boleh menghapus.
  async deleteReview(id: number, user: AuthUser) {
    const existing = await this.getReviewById(id); // 404 bila tidak ada
    if (user.role !== 'admin' && existing.userId !== user.id) {
      throw new ForbiddenError('Kamu hanya bisa menghapus review milikmu sendiri');
    }

    await this.reviewRepository.remove(id); // LIKES & FLAGS ikut terhapus (cascade)
    await this.reviewRepository.recalcStallStats(existing.stallId);
    return existing;
  }
}