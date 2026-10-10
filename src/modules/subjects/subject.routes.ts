import { Router } from 'express';
import { authenticate, authorize } from '../../shared/middlewares/auth.middleware';
import { validateBody } from '../../shared/middlewares/validate.middleware';
import * as controller from './subject.controller';
import { createSubjectSchema } from './subject.schemas';

export const subjectRouter = Router();

subjectRouter.get('/', controller.list);
subjectRouter.get('/:id', controller.getById);
subjectRouter.post('/', authenticate, authorize('admin'), validateBody(createSubjectSchema), controller.create);
