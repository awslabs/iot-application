import { NestFastifyApplication } from '@nestjs/platform-fastify';

import { bootstrapDocs } from './docs.bootstrap';
import { bootstrapHmr } from './hmr.bootstrap';
import { bootstrapLogger } from './logger.bootstrap';
import { bootstrapMvc } from './mvc.bootstrap';
import { bootstrapSecurity } from './security.bootstrap';
import { bootstrapServer } from './server.bootstrap';
import { bootstrapValidation } from './validation.bootstrap';

/** Core bootup script */
export const bootstrap = async (app: NestFastifyApplication) => {
  bootstrapLogger(app);
  await bootstrapSecurity(app);
  bootstrapValidation(app);
  bootstrapDocs(app);
  bootstrapMvc(app);
  await bootstrapServer(app);
  bootstrapHmr(app);
};
