import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { authConfig } from '../config/auth.config';

@Injectable()
export class CognitoJwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(CognitoJwtAuthGuard.name);

  constructor(
    @Inject(authConfig.KEY) private config: ConfigType<typeof authConfig>,
  ) {}

  async canActivate(context: ExecutionContext) {
    this.logger.log(
      `Authorizating request belongs to ${context.getClass().name}`,
    );

    try {
      await this.config.cognitoJwtVerifier.verify(this.getBearerToken(context));
      this.logger.log(`Request authorized to ${context.getClass().name}`);

      return true;
    } catch (e) {
      this.logger.warn(`Request unauthorized to ${context.getClass().name}`);
      this.logger.warn(e);

      throw new UnauthorizedException();
    }
  }

  private getBearerToken(context: ExecutionContext): string {
    const { headers: { authorization = '' } = { authorization: '' } } = context
      .switchToHttp()
      .getRequest<{
        headers: { authorization: string | undefined } | undefined;
      }>();

    return authorization.replace(/^Bearer /, '');
  }
}
