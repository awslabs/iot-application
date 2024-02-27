import { type DashboardClientConfiguration } from '@iot-app-kit/dashboard';
import { type EdgeMode } from '@iot-app-kit/core';
import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { IoTEventsClient } from '@aws-sdk/client-iot-events';
import { IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';

import { authService } from '~/auth/auth-service';

export function getDashboardClientConfiguration(): DashboardClientConfiguration {
  if (authService.authMode === 'edge') {
    return getEdgeClientConfig();
  }

  return getCloudClientConfig();
}

export function getDashboardEdgeMode(): EdgeMode {
  return authService.authMode === 'edge' ? 'enabled' : 'disabled';
}

// TODO: where to get?
function getEndpoint() {
  return 'https://0.0.0.0';
}

function getCloudClientConfig(): DashboardClientConfiguration {
  return {
    awsCredentials: () => authService.getAwsCredentials(),
    awsRegion: authService.awsRegion,
  };
}

function getEdgeClientConfig(): DashboardClientConfiguration {
  const clientConfig = {
    endpoint: getEndpoint(),
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
