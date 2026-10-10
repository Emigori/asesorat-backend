import { z } from 'zod';
import { objectId } from '../../shared/utils/objectId';

export const createSessionSchema = z.object({
  tutorId: objectId,
  subjectId: objectId,
  startsAt: z.iso.datetime({ offset: true, message: 'Fecha ISO 8601 inválida' }),
  durationMin: z.number().int().refine((n) => [30, 60, 90, 120].includes(n), 'Duración permitida: 30, 60, 90 o 120 min'),
  topic: z.string().trim().max(200).optional(),
});

export const updateStatusSchema = z.object({
  status: z.enum(['confirmed', 'cancelled', 'completed']),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;
