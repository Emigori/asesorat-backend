import { createApp } from './app';
import { connectDatabase } from './config/database';
import { env } from './config/env';

async function bootstrap() {
  await connectDatabase();
  createApp().listen(env.port, () => {
    console.log(`[api] AsesoraT escuchando en http://localhost:${env.port}`);
  });
}

bootstrap().catch((err) => {
  console.error('[api] No se pudo iniciar el servidor:', err);
  process.exit(1);
});
