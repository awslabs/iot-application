// Endpoint from: https://docs.aws.amazon.com/general/latest/gr/cw_region.html
export function getCloudWatchEndpoint(region: string): string {
  return `https://monitoring.${region}.amazonaws.com`;
}

// Endpoint from: https://docs.aws.amazon.com/general/latest/gr/cognito_identity.html
export function getCognitoIdenityPoolEndpoint(region: string): string {
  return `https://cognito-identity.${region}.amazonaws.com`;
}

// Endpoint from: https://docs.aws.amazon.com/general/latest/gr/cognito_identity.html
export function getCognitoUserPoolEndpoint(region: string): string {
  return `https://cognito-idp.${region}.amazonaws.com`;
}

// Endpoint from: https://docs.aws.amazon.com/general/latest/gr/iot-events.html
export function getEventsControlPlaneEndpoint(region: string): string {
  return `https://iotevents.${region}.amazonaws.com`;
}

// Endpoint from: https://docs.aws.amazon.com/general/latest/gr/iot-events.html
export function getEventsDataPlaneEndpoint(region: string): string {
  return `https://data.iotevents.${region}.amazonaws.com`;
}

// Endpoint from: https://docs.aws.amazon.com/iot-sitewise/latest/userguide/enpoints.html
export function getSiteWiseControlPlaneEndpoint(region: string): string {
  return `https://api.iotsitewise.${region}.amazonaws.com`;
}

// Endpoint from: https://docs.aws.amazon.com/iot-sitewise/latest/userguide/enpoints.html
export function getSiteWiseDataPlaneEndpoint(region: string): string {
  return `https://data.iotsitewise.${region}.amazonaws.com`;
}

// Endpoint from: https://docs.aws.amazon.com/general/latest/gr/iot-twinmaker.html
export function getTwinMakerControlPlaneEndpoint(region: string): string {
  return `api.iottwinmaker.${region}.amazonaws.com`;
}

// Endpoint from: https://docs.aws.amazon.com/general/latest/gr/iot-twinmaker.html
export function getTwinMakerDataPlaneEndpoint(region: string): string {
  return `data.iottwinmaker.${region}.amazonaws.com`;
}
