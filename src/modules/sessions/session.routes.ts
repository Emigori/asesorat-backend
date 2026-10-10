import { Router } from 'express';
import { authenticate, authorize } from '../../shared/middlewares/auth.middleware';
import { validateBody } from '../../shared/middlewares/validate.middleware';
import * as controller from './session.controller';
import { createSessionSchema, updateStatusSchema } from './session.schemas';

export const sessionRouter = Router();

sessionRouter.use(authenticate);
sessionRouter.post('/', authorize('student'), validateBody(createSessionSchema), controller.create);
sessionRouter.get('/me', authorize('student', 'tutor'), controller.listMine);
sessionRouter.patch('/:id/status', authorize('student', 'tutor'), validateBody(updateStatusSchema), controller.updateStatus);
