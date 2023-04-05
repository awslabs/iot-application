import type { GlobalThis } from 'type-fest';

export interface GlobalWithResources extends GlobalThis {
  awsResources: {
    amplifyConfiguration: object;
    coreServer: {
      endpoint: string;
    };
  };
}
