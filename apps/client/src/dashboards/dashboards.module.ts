import axios from 'axios';
import { DashboardsHttp } from './dashboards.http';

/** Client Dashboards Module */
export class DashboardsModule {
  public readonly http = new DashboardsHttp(axios);
}
