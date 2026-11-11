import { z } from 'zod';

// SENGAJA tidak ada userId: penulis review selalu diambil dari token.
export const createReviewSchema = z
  .object({
    rating: z.coerce
      .number({ required_error: 'rating wajib diisi', invalid_type_error: 'rating harus berupa angka' })
      .int('rating harus bilangan bulat')
      .min(1, 'rating minimal 1')
      .max(5, 'rating maksimal 5'),
    comment: z
      .string({ invalid_type_error: 'comment harus berupa teks' })
      .trim()
      .max(1000, 'comment maksimal 1000 karakter')
      .nullable()
      .optional(),
  })
  .strict({ message: 'body hanya boleh berisi rating dan comment' });

export const reviewQuerySchema = z.object({
  stallId: z.coerce
    .number({ invalid_type_error: 'stallId harus berupa angka' })
    .int('stallId harus bilangan bulat')
    .positive('stallId harus lebih dari 0')
    .optional(),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type ReviewQuery = z.infer<typeof reviewQuerySchema>;