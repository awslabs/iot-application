import ky from 'ky-universal';
import { HttpService } from './http.service';

// singleton
export default new HttpService(
  ky.create({
    prefixUrl: 'http://localhost:3000',
    hooks: {
      beforeRequest: [console.table],
      beforeRetry: [console.table],
      afterResponse: [console.table],
      beforeError: [console.table],
    },
  }),
);
