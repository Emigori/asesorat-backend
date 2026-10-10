import { z } from 'zod';
import { objectId } from '../../shared/utils/objectId';

const hhmm = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Formato HH:mm');

export const updateTutorProfileSchema = z.object({
  bio: z.string().trim().max(500).optional(),
  subjects: z.array(objectId).min(1, 'Indica al menos una materia'),
  availability: z
    .array(
      z
        .object({ dayOfWeek: z.number().int().min(0).max(6), from: hhmm, to: hhmm })
        .refine((s) => s.from < s.to, { message: '"from" debe ser menor que "to"' }),
    )
    .default([]),
});

export type UpdateTutorProfileInput = z.infer<typeof updateTutorProfileSchema>;
