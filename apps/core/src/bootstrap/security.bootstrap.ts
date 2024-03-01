import fastifyCookie from '@fastify/cookie';
import fastifyCsrf from '@fastify/csrf-protection';
import helmet from '@fastify/helmet';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { envVarRequiredMsg } from '../config/environment';
import { isDefined, isDevEnv } from '../types/environment';
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
  const { EDGE_ENDPOINT, SERVICE_ENDPOINTS } = process.env;

  const edge_endpoint = isDefined(EDGE_ENDPOINT) ? [EDGE_ENDPOINT] : [];

  // Split the space separated service endpoints
  invariant(
    isDefined(SERVICE_ENDPOINTS),
    envVarRequiredMsg('SERVICE_ENDPOINTS'),
  );
  const serviceEndpoints = [...SERVICE_ENDPOINTS.split(' '), ...edge_endpoint];

  // Upgrade insecure requests for all non DEV environment
  const upgradeInsecureRequests = isDevEnv() ? null : [];

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
    // X-Content-Type-Options: nosniff
    noSniff: true,
    // X-Frame-Options: DENY
    xFrameOptions: {
      action: 'deny',
    },
    // strict-transport-security: max-age=47304000; includeSubDomains
    strictTransportSecurity: {
      maxAge: 47304000,
      includeSubDomains: true,
    },
  });
  await app.register(fastifyCookie);
  await app.register(fastifyCsrf);
};
