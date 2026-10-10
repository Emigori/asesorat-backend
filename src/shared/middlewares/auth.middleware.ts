import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { ApiError } from '../utils/ApiError';
import { Role } from '../../modules/users/user.model';

export interface AuthPayload {
  sub: string;
  role: Role;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

/** Verifica el JWT enviado en el header Authorization: Bearer <token>. */
export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return next(ApiError.unauthorized('Token no proporcionado'));
  try {
    const payload = jwt.verify(header.slice(7), env.jwtSecret) as AuthPayload;
    req.user = { sub: payload.sub, role: payload.role };
    next();
  } catch {
    next(ApiError.unauthorized('Token inválido o expirado'));
  }
}

/** Permite el acceso sólo a los roles indicados. Debe usarse después de authenticate. */
export const authorize =
  (...roles: Role[]) => (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(ApiError.unauthorized());
    if (!roles.includes(req.user.role)) return next(ApiError.forbidden());
    next();
  };
