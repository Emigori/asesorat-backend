import { Router } from 'express';
import { authenticate, authorize } from '../../shared/middlewares/auth.middleware';
import { validateBody } from '../../shared/middlewares/validate.middleware';
import * as controller from './tutor.controller';
import { updateTutorProfileSchema } from './tutor.schemas';

export const tutorRouter = Router();

tutorRouter.get('/', controller.list);
tutorRouter.put('/me/profile', authenticate, authorize('tutor'), validateBody(updateTutorProfileSchema), controller.updateMyProfile);
