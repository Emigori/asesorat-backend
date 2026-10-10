import cors from 'cors';
import express from 'express';
import { authRouter } from './modules/auth/auth.routes';
import { sessionRouter } from './modules/sessions/session.routes';
import { subjectRouter } from './modules/subjects/subject.routes';
import { tutorRouter } from './modules/tutors/tutor.routes';
import { errorHandler, notFoundHandler } from './shared/middlewares/error.middleware';

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'asesorat-api', timestamp: new Date().toISOString() });
  });

  app.use('/api/auth', authRouter);
  app.use('/api/subjects', subjectRouter);
  app.use('/api/tutors', tutorRouter);
  app.use('/api/sessions', sessionRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
