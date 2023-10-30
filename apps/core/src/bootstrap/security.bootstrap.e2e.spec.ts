import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { configureTestProcessEnv } from '../testing/aws-configuration';
import { bootstrap } from '.';

describe('SecurityBootstrap', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    configureTestProcessEnv(process.env);

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    await bootstrap(app);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET / HTTP/1.1', () => {
    test('responds with security CSP headers', async () => {
      const response = await app.inject({
        headers: {},
        method: 'GET',
        url: '/',
      });

      const {
        headers: { ['content-security-policy']: csp },
      } = response;

      expect(csp).toContain("default-src 'none'");
      expect(csp).toContain(
        "connect-src 'self' ws://localhost:3001 http://localhost:9229 http://localhost:8000",
      );
      expect(csp).toContain("font-src 'self' data:");
      expect(csp).toContain("img-src 'self' data:");
      expect(csp).toContain("script-src 'self'");
      expect(csp).toContain("style-src 'self' 'unsafe-inline'");
      expect(csp).toContain('upgrade-insecure-requests');
      expect(csp).toContain("object-src 'none'");
      expect(csp).toContain("script-src-attr 'none'");
    });

    test('responds with security headers', async () => {
      const response = await app.inject({
        headers: {},
        method: 'GET',
        url: '/',
      });

      const { headers } = response;

      expect(headers['x-content-type-options']).toBe('nosniff');
      expect(headers['x-frame-options']).toBe('DENY');
      expect(headers['strict-transport-security']).toBe(
        'max-age=47304000; includeSubDomains',
      );
    });
  });
});
