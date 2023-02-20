import {
  CreateDashboardDto,
  Dashboard,
  DeleteDashboardParams,
  ReadDashboardParams,
  UpdateDashboardDto,
  UpdateDashboardParams,
} from 'types';
import type { ListDashboardsRequest } from './requests/list-dashboards.request';
import type { CreateDashboardRequest } from './requests/create-dashboard.request';
import type { ReadDashboardRequest } from './requests/read-dashboard.request';
import type { UpdateDashboardRequest } from './requests/update-dashboard.request';
import type { DeleteDashboardRequest } from './requests/delete-dashboard.request';
import { CoreError } from '../errors';
import { Result } from '../adt';

export interface DashboardsCoreClient {
  list(): Promise<Result<Dashboard[], CoreError>>;
  create(dto: CreateDashboardDto): Promise<Result<Dashboard, CoreError>>;
  read(params: ReadDashboardParams): Promise<Result<Dashboard, CoreError>>;
  update(
    params: UpdateDashboardParams,
    dto: UpdateDashboardDto,
  ): Promise<Result<Dashboard, CoreError>>;
  delete(params: DeleteDashboardParams): Promise<Result<undefined, CoreError>>;
}
export class DashboardsClient implements DashboardsCoreClient {
  constructor(
    private readonly listRequest: ListDashboardsRequest,
    private readonly createRequest: CreateDashboardRequest,
    private readonly readRequest: ReadDashboardRequest,
    private readonly updateRequest: UpdateDashboardRequest,
    private readonly deleteRequest: DeleteDashboardRequest,
  ) {}

  public async list() {
    try {
      const dashboards = await this.listRequest.request();

      return Result.ok<Dashboard[], CoreError>(dashboards);
    } catch (error) {
      return Result.err<Dashboard[], CoreError>(new CoreError());
    }
  }

  public async create(dto: CreateDashboardDto) {
    try {
      const dashboard = await this.createRequest.request(dto);

      return Result.ok<Dashboard, CoreError>(dashboard);
    } catch (error) {
      return Result.err<Dashboard, CoreError>(new CoreError());
    }
  }

  public async read(params: ReadDashboardParams) {
    try {
      const dashboard = await this.readRequest.request(params);

      return Result.ok<Dashboard, CoreError>(dashboard);
    } catch (error) {
      return Result.err<Dashboard, CoreError>(new CoreError());
    }
  }

  public async update(params: UpdateDashboardParams, dto: UpdateDashboardDto) {
    try {
      const dashboard = await this.updateRequest.request(params, dto);

      return Result.ok<Dashboard, CoreError>(dashboard);
    } catch (error) {
      return Result.err<Dashboard, CoreError>(new CoreError());
    }
  }

  public async delete(params: DeleteDashboardParams) {
    try {
      await this.deleteRequest.request(params);

      return Result.ok<undefined, CoreError>(undefined);
    } catch (error) {
      return Result.err<undefined, CoreError>(new CoreError());
    }
  }
}
