import { DashboardsCoreClient } from './dashboards.client';
import { ListDashboardsRequest } from './requests/list-dashboards.request';
import { CreateDashboardRequest } from './requests/create-dashboard.request';
import { ReadDashboardRequest } from './requests/read-dashboard.request';
import { UpdateDashboardRequest } from './requests/update-dashboard.request';
import { DeleteDashboardRequest } from './requests/delete-dashboard.request';
import { DashboardsDeserializer } from './dashboards.deserializer';
import { DashboardsValidator } from './dashboards.validator';
import http from '../http';

const { deserialize, deserializeList } = new DashboardsDeserializer();
const { validate, validateList } = new DashboardsValidator();

// singleton
export default new DashboardsCoreClient(
  new ListDashboardsRequest(http.get, deserializeList, validateList),
  new CreateDashboardRequest(http.post, deserialize, validate),
  new ReadDashboardRequest(http.get, deserialize, validate),
  new UpdateDashboardRequest(http.put, deserialize, validate),
  new DeleteDashboardRequest(http.delete),
);
