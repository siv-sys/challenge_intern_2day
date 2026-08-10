import 'reflect-metadata';
import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { AppDataSource } from './config/data-source';
import routes from './routes';
import { notFoundMiddleware } from './middlewares/not-found.middleware';
import { errorMiddleware } from './middlewares/error.middleware';

function createApp(): Express {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.corsOrigin, credentials: true }));
  app.use(cookieParser());
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.status(200).json({ success: true, data: { status: 'ok' }, message: 'Service healthy' });
  });

  app.use('/api', routes);

  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}

async function bootstrap(): Promise<void> {
  await AppDataSource.initialize();
  console.log('Database connection established');

  const app = createApp();
  app.listen(env.port, () => {
    console.log(`Server listening on port ${env.port} (${env.nodeEnv})`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
