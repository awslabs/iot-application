import ky from 'ky';

import { HttpService } from './http.service';

export default new HttpService(
  ky.create({
    prefixUrl: 'http://localhost:3000',
    hooks: {},
  }),
);
