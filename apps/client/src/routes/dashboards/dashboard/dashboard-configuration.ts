import { type DashboardClientConfiguration } from '@iot-app-kit/dashboard';
import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { IoTEventsClient } from '@aws-sdk/client-iot-events';
import { IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';
import { getAuthMode } from '~/helpers/authMode';

import { authService } from '~/auth/auth-service';

export function getDashboardClientConfiguration(): DashboardClientConfiguration {
  if (getAuthMode() === 'edge') {
    return getEdgeClientConfig();
  }

  return getCloudClientConfig();
}

function getCloudClientConfig(): DashboardClientConfiguration {
  return {
    awsCredentials: () => authService.getAwsCredentials(),
    awsRegion: authService.awsRegion,
  };
}

function getEdgeClientConfig(): DashboardClientConfiguration {
  const clientConfig = {
    endpoint: authService.getEdgeEndpoint(),
    credentials: () => authService.getAwsCredentials(),
    region: authService.awsRegion,
    disableHostPrefix: true,
  };

  const iotSiteWiseClient = new IoTSiteWiseClient(clientConfig);
  const iotEventsClient = new IoTEventsClient(clientConfig);
  const iotTwinMakerClient = new IoTTwinMakerClient(clientConfig);

  const clients = {
    iotSiteWiseClient,
    iotEventsClient,
    iotTwinMakerClient,
  };

  return clients;
}
