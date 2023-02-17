import type { HttpService } from '../../http/http.service';
import { DeleteDashboardParams } from 'types';

export class DeleteDashboardRequest {
  constructor(private readonly del: HttpService['delete']) {}

  public async request(params: DeleteDashboardParams) {
    await this.send(params);
  }

  private async send(params: DeleteDashboardParams) {
    await this.del(params.id);
  }
}
