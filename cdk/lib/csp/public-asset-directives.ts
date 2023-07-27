import {
  getCognitoIdenityPoolEndpoint,
  getCognitoUserPoolEndpoint,
  getEventsControlPlaneEndpoint,
  getEventsDataPlaneEndpoint,
  getSiteWiseControlPlaneEndpoint,
  getSiteWiseDataPlaneEndpoint,
} from '../endpoints/aws-endpoints';

export function getServicesEndpoints(region: string): string[] {
  return [
    getCognitoIdenityPoolEndpoint(region),
    getCognitoUserPoolEndpoint(region),
    getEventsControlPlaneEndpoint(region),
    getEventsDataPlaneEndpoint(region),
    getSiteWiseControlPlaneEndpoint(region),
    getSiteWiseDataPlaneEndpoint(region),
  ];
}
