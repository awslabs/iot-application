import { AuthService } from './auth-service.interface';
import { type AwsCredentialIdentity } from '@smithy/types';

export class EdgeAuthService implements AuthService {
  private region = 'edge';
  private credentials: AwsCredentialIdentity = {
    accessKeyId: '',
    secretAccessKey: '',
  };
  private edgeEndpoint = '0.0.0.0';

  setEdgeEndpoint(endpoint: string) {
    this.edgeEndpoint = endpoint;
  }

  getEdgeEndpoint() {
    return this.edgeEndpoint;
  }

  setAwsCredentials(credentials: AwsCredentialIdentity) {
    this.credentials = credentials;
  }

  getAwsCredentials() {
    return Promise.resolve(this.credentials);
  }

  get awsRegion() {
    return this.region;
  }

  // noop because region is edge
  setAwsRegion() {}

  getToken() {
    if (this.credentials.sessionToken) {
      return Promise.resolve(this.credentials.sessionToken);
    }

    // TODO: Handle session token in edge mode
    return Promise.resolve('');
  }

  /**
   * This function accepts a callback function to call when application is signed-in or already signed-in
   * @param callback the callback function to call when application is signed-in
   */
  onSignedIn(callback: () => unknown) {
    if (
      this.credentials.accessKeyId !== '' &&
      this.credentials.secretAccessKey !== ''
    ) {
      callback();
    }
  }
}
