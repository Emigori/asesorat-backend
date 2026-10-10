import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Mínimo 2 caracteres'),
  email: z.email('Correo inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  // El registro público sólo permite student o tutor; admin se crea con el script seed.
  role: z.enum(['student', 'tutor']).default('student'),
  career: z.string().trim().optional(),
});

export const loginSchema = z.object({
  email: z.email('Correo inválido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
