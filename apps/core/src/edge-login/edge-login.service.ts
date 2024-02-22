import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { EdgeCredentials } from './entities/edge-credentials.entity';
import { EdgeLoginBody } from './entities/edge-login-body.entity';
import { Result, err, ok } from '../types';

@Injectable()
export class EdgeLoginService {
  constructor(private readonly httpService: HttpService) {}

  public async login(
    body: EdgeLoginBody,
  ): Promise<Result<Error, EdgeCredentials>> {
    try {
      const result = await this.httpService.axiosRef.post<EdgeCredentials>(
        `${body.edgeEndpoint}/authenticate`,
        {
          username: body.username,
          password: body.password,
          authMechanism: body.authMechanism,
        },
      );

      const { accessKeyId, secretAccessKey, sessionToken, sessionExpiryTime } =
        result.data;

      return ok({
        accessKeyId,
        secretAccessKey,
        sessionToken,
        sessionExpiryTime,
      });
    } catch (error) {
      return error instanceof Error
        ? err(error)
        : err(new Error('Error getting edge credentials'));
    }
  }
}
