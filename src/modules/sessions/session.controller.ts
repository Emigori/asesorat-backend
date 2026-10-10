import { Request, Response } from 'express';
import { ApiError } from '../../shared/utils/ApiError';
import { SESSION_STATUS } from './session.model';
import * as sessionService from './session.service';

export async function create(req: Request, res: Response) {
  res.status(201).json({ session: await sessionService.create(req.user!.sub, req.body) });
}

export async function listMine(req: Request, res: Response) {
  const status = typeof req.query.status === 'string' ? req.query.status : undefined;
  if (status && !SESSION_STATUS.includes(status as any)) throw ApiError.badRequest('Estado inválido');
  res.status(200).json({ sessions: await sessionService.listMine(req.user!.sub, req.user!.role, status) });
}

export async function updateStatus(req: Request, res: Response) {
  const session = await sessionService.updateStatus(String(req.params.id), req.user!.sub, req.user!.role, req.body.status);
  res.status(200).json({ session });
}
