import fastifyCookie from '@fastify/cookie';
import fastifyCsrf from '@fastify/csrf-protection';
import helmet from '@fastify/helmet';
import { NestFastifyApplication } from '@nestjs/platform-fastify';

/**
 * Security bootup script
 *
 * @regards
 *
 * @see {@link https://docs.nestjs.com/security/cors | CORS}
 * @see {@link https://docs.nestjs.com/security/helmet | Helmet}
 * @see {@link https://docs.nestjs.com/security/csrf | CSRF Protection}
 */
export const bootstrapSecurity = async (app: NestFastifyApplication) => {
  app.enableCors({ origin: 'http://localhost:3001' });
  await app.register(helmet);
  await app.register(fastifyCookie);
  await app.register(fastifyCsrf);
};
