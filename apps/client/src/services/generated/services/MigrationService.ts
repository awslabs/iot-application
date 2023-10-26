/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
import { MigrationStatus } from '../models/MigrationStatus';

export class MigrationService {
  /**
   * @returns void
   * @throws ApiError
   */
  public static migrationControllerMigration() {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/migration',
    });
  }

  /**
   * @returns MigrationStatus
   * @throws ApiError
   */
  public static migrationControllerGetMigrationStatus(): CancelablePromise<MigrationStatus> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/migration',
    });
  }
}
