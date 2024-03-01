import { Get, Controller, Render, Inject, Header } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Public } from '../auth/public.decorator';
import { authConfig } from '../config/auth.config';
import { edgeConfig } from '../config/edge.config';
import { globalConfig } from '../config/global.config';

// Responds with the index page for all of the client routes.
const CLIENT_ROUTES = ['', 'dashboards', 'dashboards/*'];

@Controller()
export class MvcController {
  constructor(
    @Inject(authConfig.KEY) private auth: ConfigType<typeof authConfig>,
    @Inject(edgeConfig.KEY) private edge: ConfigType<typeof edgeConfig>,
    @Inject(globalConfig.KEY) private global: ConfigType<typeof globalConfig>,
  ) {}

  @Public()
  @Get(CLIENT_ROUTES)
  @Header('Cache-Control', 'no-store') // Cache-Control: no-store
  @Render('index.html')
  root() {
    const {
      authenticationFlowType,
      authMode,
      clientAwsAccessKeyId,
      clientAwsSecretAccessKey,
      clientAwsSessionToken,
      cognitoEndpoint,
      domainName,
      identityPoolId,
      region,
      userPoolId,
      userPoolWebClientId,
    } = this.auth;

    const { edgeEndpoint } = this.edge;

    const { applicationName, logMode, metricsMode } = this.global;

    return {
      applicationName,
      authenticationFlowType,
      authMode,
      clientAwsAccessKeyId,
      clientAwsSecretAccessKey,
      clientAwsSessionToken,
      cognitoEndpoint,
      domainName,
      edgeEndpoint,
      identityPoolId,
      logMode,
      metricsMode,
      region,
      userPoolId,
      userPoolWebClientId,
    };
  }
}
