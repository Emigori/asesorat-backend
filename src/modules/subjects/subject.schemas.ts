import { z } from 'zod';

export const createSubjectSchema = z.object({
  code: z.string().trim().min(2).max(20),
  name: z.string().trim().min(3),
  department: z.string().trim().optional(),
  description: z.string().trim().max(500).optional(),
});

export type CreateSubjectInput = z.infer<typeof createSubjectSchema>;
