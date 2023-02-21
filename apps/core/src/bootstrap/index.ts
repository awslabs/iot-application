import { NestFastifyApplication } from '@nestjs/platform-fastify';

import { bootstrapDocs } from './docs.bootstrap';
import { bootstrapHmr } from './hmr.bootstrap';
import { bootstrapSecurity } from './security.bootstrap';
import { bootstrapServer } from './server.bootstrap';
import { bootstrapValidation } from './validation.bootstrap';

/** Core bootup script */
export const bootstrap = async (app: NestFastifyApplication) => {
  await bootstrapSecurity(app);
  bootstrapValidation(app);
  bootstrapDocs(app);
  await bootstrapServer(app);
  bootstrapHmr(app);
};
