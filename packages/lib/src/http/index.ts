import ky from 'ky';

import { HttpService } from './http.service';
import { authorizationHook } from '../auth';

export * from './http.types';

export const http = new HttpService(
  ky.create({
    prefixUrl: 'http://localhost:3000',
    hooks: {
      beforeRequest: [authorizationHook],
    },
  }),
);
