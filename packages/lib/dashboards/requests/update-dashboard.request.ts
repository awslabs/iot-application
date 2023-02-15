import { UpdateDashboardParams, UpdateDashboardDto } from 'core/src/types';
import type { HttpService } from '../../http/http.service';
import type { DashboardsValidator } from '../dashboards.validator';
import type { DashboardsDeserializer } from '../dashboards.deserializer';

export class UpdateDashboardRequest {
  constructor(
    private readonly put: HttpService['put'],
    private readonly deserialize: DashboardsDeserializer['deserialize'],
    private readonly validate: DashboardsValidator['validate'],
  ) {}

  public async request(params: UpdateDashboardParams, dto: UpdateDashboardDto) {
    const response = await this.send(params, dto);
    const dashboard = this.deserialize(response);
    await this.validate(dashboard);

    return dashboard;
  }

  private async send(params: UpdateDashboardParams, dto: UpdateDashboardDto) {
    return this.put(params.id, { json: dto }).json();
  }
}
