import { CreateDashboardDto } from 'core/src/types';
import type { HttpService } from '../../http/http.service';
import type { DashboardsValidator } from '../dashboards.validator';
import type { DashboardsDeserializer } from '../dashboards.deserializer';

export class CreateDashboardRequest {
  constructor(
    private readonly post: HttpService['post'],
    private readonly deserialize: DashboardsDeserializer['deserialize'],
    private readonly validate: DashboardsValidator['validate'],
  ) {}

  public async request(dto: CreateDashboardDto) {
    const response = await this.send(dto);
    const dashboard = this.deserialize(response);
    await this.validate(dashboard);

    return dashboard;
  }

  private async send(dto: CreateDashboardDto) {
    return this.post('', { json: dto }).json();
  }
}
