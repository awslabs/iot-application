import ky from 'ky-universal';
import { HttpService } from './http.service';

// singleton
export default new HttpService(
  ky.create({
    prefixUrl: 'http://localhost:3000',
    hooks: {
      beforeRequest: [(request) => console.table(request)],
      beforeRetry: [console.table],
      afterResponse: [(response) => console.table(response)],
      beforeError: [
        (error) => {
          console.table(error);
          return error;
        },
      ],
    },
  }),
);
