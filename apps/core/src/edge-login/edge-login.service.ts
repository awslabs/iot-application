import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { Agent } from 'https';
import { EdgeCredentials } from './entities/edge-credentials.entity';
import { EdgeLoginBody } from './entities/edge-login-body.entity';
import { Result, err, ok } from '../types';
import { isAxiosError } from '@nestjs/terminus/dist/utils';

@Injectable()
export class EdgeLoginService {
  constructor(private readonly httpService: HttpService) {}

  public async login(
    body: EdgeLoginBody,
  ): Promise<Result<Error, EdgeCredentials>> {
    const httpsAgent = new Agent({ rejectUnauthorized: false });

    try {
      const result = await this.httpService.axiosRef.post<EdgeCredentials>(
        `https://${body.edgeEndpoint}/authenticate`,
        {
          username: body.username,
          password: body.password,
          authMechanism: body.authMechanism,
        },
        {
          httpsAgent,
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
      if (isAxiosError(error)) {
        // If response field, server responded with status code thats not 2xx
        if (error.response) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          if (error.response.status && error.response.status === 401) {
            return err(
              new UnauthorizedException('Incorrect username or password'),
            );
          }
        } else if (error.request) {
          // If request field, no response from server
          return err(new RequestTimeoutException('Request timed out'));
        }
      }
      return error instanceof Error
        ? err(error)
        : err(new Error('Error getting edge credentials'));
    }
  }
}
