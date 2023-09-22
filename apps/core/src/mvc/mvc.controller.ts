import { Get, Controller, Render, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Public } from '../auth/public.decorator';
import { authConfig } from '../config/auth.config';

// Responds with the index page for all of the client routes.
const CLIENT_ROUTES = ['', 'dashboards', 'dashboards/*'];

@Controller()
export class MvcController {
  constructor(
    @Inject(authConfig.KEY) private config: ConfigType<typeof authConfig>,
  ) {}

  @Public()
  @Get(CLIENT_ROUTES)
  @Render('index.html')
  root() {
    const {
      authenticationFlowType,
      cognitoEndpoint,
      identityPoolId,
      region,
      userPoolWebClientId,
      userPoolId,
      domainName,
    } = this.config;

    return {
      authenticationFlowType,
      cognitoEndpoint,
      identityPoolId,
      region,
      userPoolId,
      userPoolWebClientId,
      domainName,
    };
  }
}
