import { LoaderClient } from '@tanstack/react-loaders';

export const loaderClient = new LoaderClient({});

declare module '@tanstack/react-loaders' {
  interface Register {
    loaderClient: typeof loaderClient;
  }
}
