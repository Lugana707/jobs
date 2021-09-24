import * as express from 'express';
import * as compression from 'compression';
import * as helmet from 'helmet';
import { getPackage } from './package';

/**
 * Bootstrap the application framework
 */
export function createApp() {
  const app = express();

  app.use(compression()).use(helmet()).use(express.json());

  app.get('/package/:name/:version', getPackage);

  return app;
}
