import { z } from 'zod';

// id di URL selalu berupa teks, jadi diubah (coerce) menjadi angka.
export const idParamSchema = z.object({
  id: z.coerce
    .number({ invalid_type_error: 'id harus berupa angka' })
    .int('id harus bilangan bulat')
    .positive('id harus lebih dari 0'),
});

export const stallQuerySchema = z.object({
  search: z.string().trim().max(100, 'search maksimal 100 karakter').optional(),
  category: z.string().trim().max(50, 'category maksimal 50 karakter').optional(),
  page: z.coerce
    .number({ invalid_type_error: 'page harus berupa angka' })
    .int('page harus bilangan bulat')
    .min(1, 'page minimal 1')
    .default(1),
  limit: z.coerce
    .number({ invalid_type_error: 'limit harus berupa angka' })
    .int('limit harus bilangan bulat')
    .min(1, 'limit minimal 1')
    .max(100, 'limit maksimal 100')
    .default(10),
});


const optionalText = (max: number, field: string) =>
  z
    .string({ invalid_type_error: `${field} harus berupa teks` })
    .trim()
    .max(max, `${field} maksimal ${max} karakter`)
    .nullable()
    .optional();

// SENGAJA tidak ada ownerId: pemilik warung selalu diambil dari token.
// Kalau ownerId diterima dari body, owner bisa membuat warung atas nama orang lain.
const stallBody = z
  .object({
    name: z
      .string({
        required_error: 'name wajib diisi',
        invalid_type_error: 'name harus berupa teks',
      })
      .trim()
      .min(3, 'name minimal 3 karakter')
      .max(100, 'name maksimal 100 karakter'),

    category: optionalText(50, 'category'),
    location: optionalText(100, 'location'),
    description: optionalText(1000, 'description'),
  })
  .strict({
    message:
      'body hanya boleh berisi name, category, location, dan description',
  });

export const createStallSchema = stallBody;

// PUT = versi parsial dari POST (semua field opsional), tapi minimal satu harus diisi.
export const updateStallSchema = stallBody
  .partial()
  .refine((body) => Object.keys(body).length > 0, {
    message: 'Minimal satu field harus diisi',
  });

export type IdParam = z.infer<typeof idParamSchema>;
export type StallQuery = z.infer<typeof stallQuerySchema>;
export type CreateStallInput = z.infer<typeof createStallSchema>;
export type UpdateStallInput = z.infer<typeof updateStallSchema>;