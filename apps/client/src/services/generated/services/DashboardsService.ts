/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BulkDeleteDashboardDto } from '../models/BulkDeleteDashboardDto';
import type { CreateDashboardDto } from '../models/CreateDashboardDto';
import type { Dashboard } from '../models/Dashboard';
import type { DashboardSummary } from '../models/DashboardSummary';
import type { UpdateDashboardDto } from '../models/UpdateDashboardDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class DashboardsService {
  /**
   * @param id
   * @returns Dashboard
   * @throws ApiError
   */
  public static dashboardsControllerRead(
    id: string,
  ): CancelablePromise<Dashboard> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/dashboards/{id}',
      path: {
        id: id,
      },
    });
  }

  /**
   * @param id
   * @param requestBody
   * @returns Dashboard
   * @throws ApiError
   */
  public static dashboardsControllerUpdate(
    id: string,
    requestBody: UpdateDashboardDto,
  ): CancelablePromise<Dashboard> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/dashboards/{id}',
      path: {
        id: id,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }

  /**
   * @param id
   * @returns void
   * @throws ApiError
   */
  public static dashboardsControllerDelete(
    id: string,
  ): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/dashboards/{id}',
      path: {
        id: id,
      },
    });
  }

  /**
   * @returns DashboardSummary
   * @throws ApiError
   */
  public static dashboardsControllerList(): CancelablePromise<
    Array<DashboardSummary>
  > {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/dashboards',
    });
  }

  /**
   * @param requestBody
   * @returns Dashboard
   * @throws ApiError
   */
  public static dashboardsControllerCreate(
    requestBody: CreateDashboardDto,
  ): CancelablePromise<Dashboard> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/dashboards',
      body: requestBody,
      mediaType: 'application/json',
    });
  }

  /**
   * @param requestBody
   * @returns any
   * @throws ApiError
   */
  public static dashboardsControllerBulkDelete(
    requestBody: BulkDeleteDashboardDto,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/dashboards/bulk',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
}
