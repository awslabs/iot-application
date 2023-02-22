import { HttpService } from './http.service';
import type { ExtensibleHttpClient } from './http.types';

const mockHttpClient: ExtensibleHttpClient = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  extend: jest.fn().mockReturnValue(this),
};

describe('HttpService', () => {
  describe('get', () => {
    test('http client integration', async () => {
      const service = new HttpService(mockHttpClient);

      await service.get('');

      expect(mockHttpClient.get).toHaveBeenCalled();
    });
  });

  describe('post', () => {
    test('http client integration', async () => {
      const service = new HttpService(mockHttpClient);

      await service.post('');

      expect(mockHttpClient.get).toHaveBeenCalled();
    });
  });

  describe('put', () => {
    test('http client integration', async () => {
      const service = new HttpService(mockHttpClient);

      await service.put('');

      expect(mockHttpClient.get).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    test('http client integration', async () => {
      const service = new HttpService(mockHttpClient);

      await service.delete('');

      expect(mockHttpClient.get).toHaveBeenCalled();
    });
  });

  describe('extend', () => {
    test('http client integration', () => {
      const service = new HttpService(mockHttpClient);

      const extended = service.extend({
        prefixUrl: '',
        hooks: {
          beforeRequest: [],
          beforeRetry: [],
          afterResponse: [],
          beforeError: [],
        },
      });

      expect(extended).toBeInstanceOf(HttpService);
    });
  });
});
