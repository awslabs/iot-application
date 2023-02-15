import type { HttpService } from '../../http/http.service';
import type { DashboardsValidator } from '../dashboards.validator';
import type { DashboardsDeserializer } from '../dashboards.deserializer';

export class ListDashboardsRequest {
  constructor(
    private readonly get: HttpService['get'],
    private readonly deserialize: DashboardsDeserializer['deserializeList'],
    private readonly validate: DashboardsValidator['validateList'],
  ) {}

  public async request() {
    const response = await this.send();
    const dashboards = this.deserialize(response);
    await this.validate(dashboards);

    return dashboards;
  }

  private async send() {
    return this.get('').json<unknown[]>();
  }
}
