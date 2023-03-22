export * from './generated';
export { intl } from './intl';

import { OpenAPI, DashboardsService } from './generated';

// put token here
OpenAPI.TOKEN =
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkNvZ25pdG9Mb2NhbCJ9.eyJhdXRoX3RpbWUiOjE2NzkzNTE3MTIsImNsaWVudF9pZCI6IjljZWhsaTYycXhta2k5bWc1YWRqbXVjdXEiLCJldmVudF9pZCI6IjNlNjg5ZWNhLWIwMjgtNGM1OC1iZWFlLTExMzExNzg0ZTVjMSIsImlhdCI6MTY3OTM1MTcxMiwianRpIjoiYWE0ZTRlN2ItZDliYy00ZDM4LTljMDItNTRjNDk0MWY2MzU2Iiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiIsInN1YiI6ImM0NDNhZjM3LTJlYWItNDQ2NS1hYzk0LTdlYzhiODE0YWJhZCIsInRva2VuX3VzZSI6ImFjY2VzcyIsInVzZXJuYW1lIjoidGVzdC11c2VyIiwiZXhwIjoxNjc5NDM4MTEyLCJpc3MiOiJodHRwczovL2NvZ25pdG8taWRwLnVzLXdlc3QtMi5hbWF6b25hd3MuY29tL3VzLXdlc3QtMl9oMjNUSmpRUjkifQ.IfJ58-KHi9piVAZFSYdrdJq-8t10WZmCQ61rxhCZct0FOZEhsYVoY-9PYlyjEniRseL7-YBhqbgtIogY3tiiSsurE7DySQPVzTkpX2BqFVaVc4GPKyDggnAGvNvyXgwOMhmo9EVTUM3rvkRuj4JGiTV_Y1EJUZnSsdcNAy4qlnkrtn4pyCodzBedusieC6LQMw6cEIRD9xlDSqXwhWL09vKedGzPmcZ_XZc_GMGeGPJBoxUgcqJQ7iAhxv4eDPW1_AiNXtik21T6Pv6Ytrt2ZRvflcbmf1PP89j0Wf20V-PnNTbRn2Spqkt5kNQ653UvuBkWvcx5Wj9yiMyZJ7hGKA';

OpenAPI.BASE = 'http://localhost:3000';

export type ListDashboards = typeof DashboardsService.dashboardsControllerList;
export type CreateDashboard =
  typeof DashboardsService.dashboardsControllerCreate;
export type ReadDashboard = typeof DashboardsService.dashboardsControllerRead;
export type UpdateDashboard =
  typeof DashboardsService.dashboardsControllerUpdate;
export type DeleteDashboard =
  typeof DashboardsService.dashboardsControllerDelete;

export const listDashboards: ListDashboards = () =>
  DashboardsService.dashboardsControllerList();
export const createDashboard: CreateDashboard = (dto) =>
  DashboardsService.dashboardsControllerCreate(dto);
export const readDashboard: ReadDashboard = (id) =>
  DashboardsService.dashboardsControllerRead(id);
export const updateDashboard: UpdateDashboard = (id, dto) =>
  DashboardsService.dashboardsControllerUpdate(id, dto);
export const deleteDashboard: DeleteDashboard = (id) =>
  DashboardsService.dashboardsControllerDelete(id);
