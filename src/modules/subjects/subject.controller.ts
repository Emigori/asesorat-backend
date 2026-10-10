import { Request, Response } from 'express';
import * as subjectService from './subject.service';

export async function create(req: Request, res: Response) {
  res.status(201).json({ subject: await subjectService.create(req.body) });
}

export async function list(req: Request, res: Response) {
  const search = typeof req.query.search === 'string' ? req.query.search : undefined;
  res.status(200).json({ subjects: await subjectService.list(search) });
}

export async function getById(req: Request, res: Response) {
  res.status(200).json({ subject: await subjectService.getById(String(req.params.id)) });
}
