import fastifyCookie from '@fastify/cookie';
import fastifyCsrf from '@fastify/csrf-protection';
import helmet from '@fastify/helmet';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { envVarRequiredMsg } from '../config/environment';
import { isDefined } from '../types/environment';
import invariant from 'tiny-invariant';

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
  const { SERVICE_ENDPOINTS, NODE_ENV } = process.env;

  // Split the space separated service endpoints
  invariant(
    isDefined(SERVICE_ENDPOINTS),
    envVarRequiredMsg('SERVICE_ENDPOINTS'),
  );
  const serviceEndpoints = SERVICE_ENDPOINTS.split(' ');

  // Upgrade insecure requests for all non DEV environment
  const upgradeInsecureRequests = NODE_ENV === 'development' ? null : [];

  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'none'`],
        connectSrc: [`'self'`, ...serviceEndpoints],
        fontSrc: [`'self'`, 'data:'],
        imgSrc: [`'self'`, 'data:'],
        scriptSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        upgradeInsecureRequests,
      },
    },
  });
  await app.register(fastifyCookie);
  await app.register(fastifyCsrf);
};
