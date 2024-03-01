import { HttpService } from '@nestjs/axios';
import {
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { isAxiosError } from '@nestjs/terminus/dist/utils';
import { Agent } from 'https';

import { EdgeCredentials } from './entities/edge-credentials.entity';
import { EdgeLoginBody } from './entities/edge-login-body.entity';
import { edgeConfig } from '../config/edge.config';
import { Result, err, ok } from '../types';
import { isStringWithValue } from '../types/strings/is-string-with-value';

@Injectable()
export class EdgeLoginService {
  constructor(
    @Inject(edgeConfig.KEY) private edge: ConfigType<typeof edgeConfig>,
    private readonly httpService: HttpService,
  ) {}

  public async login(
    body: EdgeLoginBody,
  ): Promise<Result<Error, EdgeCredentials>> {
    const httpsAgent = new Agent({ rejectUnauthorized: false });

    try {
      const { edgeEndpoint } = this.edge;
      if (!isStringWithValue(edgeEndpoint)) {
        throw new Error();
      }

      const result = await this.httpService.axiosRef.post<EdgeCredentials>(
        `${edgeEndpoint}/authenticate`,
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
