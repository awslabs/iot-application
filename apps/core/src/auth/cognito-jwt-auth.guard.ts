import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { jwtConfig } from '../config/jwt.config';
import { Reflector } from '@nestjs/core';
import { isPublicMetadataKey } from './public.decorator';

interface HttpRequest {
  headers?: { authorization?: string };
  url: string;
}

/**
 * Authorization guard to verify the request bearer token against the Cognito user pool client.
 * It supports exemption by adding a `@Public()` decorated at the controller class or handler,
 * see pattern explain here: https://github.com/nestjs/nest/issues/964#issuecomment-480834786
 */
@Injectable()
export class CognitoJwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(CognitoJwtAuthGuard.name);

  constructor(
    @Inject(jwtConfig.KEY) private config: ConfigType<typeof jwtConfig>,
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
      const httpRequest = context.switchToHttp().getRequest<HttpRequest>();
      const { url } = httpRequest;

      const { sub } = await this.config.cognitoJwtVerifier.verify(
        this.getBearerToken(httpRequest),
      );
      this.logger.log(
        `User ID "${sub}" authorized to ${controllerName}.${handlerName} (url: "${url}")`,
      );

      return true;
    } catch (e) {
      this.logger.warn(
        `Request unauthorized to ${controllerName}.${handlerName}`,
      );
      this.logger.warn(e);

      throw new UnauthorizedException();
    }
  }

  private getBearerToken(httpRequest: HttpRequest): string {
    const authorization = httpRequest.headers?.authorization ?? '';

    return authorization.replace(/^Bearer /, '');
  }
}
