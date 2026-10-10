import { Request, Response } from 'express';
import { ApiError } from '../../shared/utils/ApiError';
import * as tutorService from './tutor.service';

export async function updateMyProfile(req: Request, res: Response) {
  res.status(200).json({ tutor: await tutorService.updateMyProfile(req.user!.sub, req.body) });
}

export async function list(req: Request, res: Response) {
  const subject = typeof req.query.subject === 'string' ? req.query.subject : undefined;
  if (subject && !/^[a-f\d]{24}$/i.test(subject)) throw ApiError.badRequest('El parámetro subject no es válido');
  res.status(200).json({ tutors: await tutorService.list(subject) });
}
