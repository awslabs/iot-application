import type ky from 'ky';
import type { Options } from 'ky';

export type { BeforeRequestHook } from 'ky';

export interface HttpClient {
  get: typeof ky.get;
  post: typeof ky.post;
  put: typeof ky.put;
  delete: typeof ky.delete;
}

export type ExtensionOptions = Options;

export interface ExtensibleHttpClient extends HttpClient {
  extend(options: ExtensionOptions): ExtensibleHttpClient;
}
