/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class MigrationService {
  /**
   * @returns any
   * @throws ApiError
   */
  public static migrationControllerMigration(): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/migration',
    });
  }
}
