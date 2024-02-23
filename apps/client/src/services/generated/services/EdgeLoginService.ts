/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
import { EdgeCredentials } from '../models/EdgeCredentials';
import { EdgeLoginBody } from '../models/EdgeLoginBody';

export class EdgeLoginService {
  /**
   * @returns void
   * @throws ApiError
   */
  public static edgeLogin(requestBody: EdgeLoginBody): CancelablePromise<EdgeCredentials> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/edge-login',
      body: requestBody,
    });
  }
}
