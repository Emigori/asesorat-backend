import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../../config/env';
import { ApiError } from '../../shared/utils/ApiError';
import { User, toPublicUser } from '../users/user.model';
import { LoginInput, RegisterInput } from './auth.schemas';

function signToken(userId: string, role: string) {
  return jwt.sign({ sub: userId, role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'],
  });
}

export async function register(input: RegisterInput) {
  const exists = await User.exists({ email: input.email.toLowerCase() });
  if (exists) throw ApiError.conflict('Ya existe una cuenta con ese correo');

  const password = await bcrypt.hash(input.password, 10);
  const user = await User.create({
    ...input,
    password,
    tutorProfile: input.role === 'tutor' ? { bio: '', subjects: [], availability: [] } : undefined,
  });
  return { user: toPublicUser(user), token: signToken(String(user._id), user.role) };
}

export async function login(input: LoginInput) {
  const user = await User.findOne({ email: input.email.toLowerCase() }).select('+password');
  // Mismo mensaje en ambos casos para no revelar qué correos existen.
  if (!user || !(await bcrypt.compare(input.password, user.password))) {
    throw ApiError.unauthorized('Credenciales incorrectas');
  }
  return { user: toPublicUser(user), token: signToken(String(user._id), user.role) };
}

export async function me(userId: string) {
  const user = await User.findById(userId).populate('tutorProfile.subjects', 'code name');
  if (!user) throw ApiError.notFound('Usuario no encontrado');
  return toPublicUser(user);
}
