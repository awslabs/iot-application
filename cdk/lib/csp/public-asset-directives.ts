import {
  getCloudWatchEndpoint,
  getCloudWatchLogsEndpoint,
  getCognitoIdenityPoolEndpoint,
  getCognitoUserPoolEndpoint,
  getEventsControlPlaneEndpoint,
  getEventsDataPlaneEndpoint,
  getSiteWiseControlPlaneEndpoint,
  getSiteWiseDataPlaneEndpoint,
  getTwinMakerControlPlaneEndpoint,
  getTwinMakerDataPlaneEndpoint,
} from '../endpoints/aws-endpoints';

export function getServicesEndpoints(region: string): string[] {
  return [
    getCloudWatchEndpoint(region),
    getCloudWatchLogsEndpoint(region),
    getCognitoIdenityPoolEndpoint(region),
    getCognitoUserPoolEndpoint(region),
    getEventsControlPlaneEndpoint(region),
    getEventsDataPlaneEndpoint(region),
    getSiteWiseControlPlaneEndpoint(region),
    getSiteWiseDataPlaneEndpoint(region),
    getTwinMakerControlPlaneEndpoint(region),
    getTwinMakerDataPlaneEndpoint(region),
  ];
}
