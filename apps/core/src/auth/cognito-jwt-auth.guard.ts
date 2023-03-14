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
import { Reflector } from '@nestjs/core';
import { isPublicMetadataKey } from './public.decorator';

/**
 * Authorization guard to verify the request bearer token against the Cognito user pool client.
 * It supports exemption by adding a `@Public()` decorated at the controller class or handler,
 * see pattern explain here: https://github.com/nestjs/nest/issues/964#issuecomment-480834786
 */
@Injectable()
export class CognitoJwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(CognitoJwtAuthGuard.name);

  constructor(
    @Inject(authConfig.KEY) private config: ConfigType<typeof authConfig>,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    const controllerClass = context.getClass();
    const controllerName = controllerClass.name;
    const handlerFunction = context.getHandler();
    const handlerName = handlerFunction.name;

    const isPublicController = this.reflector.get<boolean>(
      isPublicMetadataKey,
      controllerClass,
    );
    const isPublicHandler = this.reflector.get<boolean>(
      isPublicMetadataKey,
      handlerFunction,
    );
    if (isPublicController || isPublicHandler) {
      this.logger.log(
        `Request authorized to public ${controllerName}.${handlerName}`,
      );

      return true;
    }

    this.logger.log(
      `Authorizating request belongs to ${controllerName}.${handlerName}`,
    );

    try {
      await this.config.cognitoJwtVerifier.verify(this.getBearerToken(context));
      this.logger.log(`Request authorized to ${controllerName}.${handlerName}`);

      return true;
    } catch (e) {
      this.logger.warn(
        `Request unauthorized to ${controllerName}.${handlerName}`,
      );
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
