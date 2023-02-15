import { ReadDashboardParams } from 'core/src/types';
import type { HttpService } from '../../http/http.service';
import type { DashboardsValidator } from '../dashboards.validator';
import type { DashboardsDeserializer } from '../dashboards.deserializer';

export class ReadDashboardRequest {
  constructor(
    private readonly get: HttpService['get'],
    private readonly deserialize: DashboardsDeserializer['deserialize'],
    private readonly validate: DashboardsValidator['validate'],
  ) {}

  public async request(params: ReadDashboardParams) {
    const response = await this.send(params);
    const dashboard = this.deserialize(response);
    await this.validate(dashboard);

    return dashboard;
  }

  private async send(params: ReadDashboardParams) {
    return this.get(params.id).json();
  }
}
