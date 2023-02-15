import type ky from 'ky-universal';
import { Options, HTTPError } from 'ky-universal';

export type HttpError = HTTPError;
export interface HttpClient {
  get: typeof ky.get;
  post: typeof ky.post;
  put: typeof ky.put;
  delete: typeof ky.delete;
}

export type ExtensionOptions = Options;
export interface ExtensibleHttpClient extends HttpClient {
  extend(options: ExtensionOptions): ReturnType<typeof ky.extend>;
}
