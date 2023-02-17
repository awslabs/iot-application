import { ExtensibleHttpClient, ExtensionOptions } from '../http/http.types';

export class HttpService {
  constructor(private http: ExtensibleHttpClient) {}

  public get = this.http.get;
  public post = this.http.post;
  public put = this.http.put;
  public delete = this.http.delete;

  public extend(options: ExtensionOptions): HttpService {
    return new HttpService(this.http.extend(options));
  }
}
