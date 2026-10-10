import { Request, Response } from 'express';
import * as authService from './auth.service';

export async function register(req: Request, res: Response) {
  res.status(201).json(await authService.register(req.body));
}

export async function login(req: Request, res: Response) {
  res.status(200).json(await authService.login(req.body));
}

export async function me(req: Request, res: Response) {
  res.status(200).json({ user: await authService.me(req.user!.sub) });
}
