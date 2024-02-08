import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import { AuthService } from './auth-service.interface';
import { type AwsCredentialIdentity } from '@smithy/types';

class CognitoAuthService implements AuthService {
  private credentials?: AwsCredentialIdentity;
  public region?: string;

  setAwsCredentials(credentials: AwsCredentialIdentity) {
    this.credentials = credentials;
  }

  async getAwsCredentials() {
    if (this.credentials != null) {
      return Promise.resolve(this.credentials);
    }

    const session = await fetchAuthSession();
    if (!session.credentials) {
      throw new Error();
    }

    return Promise.resolve(session.credentials as AwsCredentialIdentity);
  }

  setAwsRegion(region: string) {
    this.region = region;
  }
  get awsRegion() {
    return this.region ?? 'us-west-2';
  }

  async getToken() {
    const session = await fetchAuthSession();

    if (!session.tokens?.accessToken) {
      throw new Error();
    }
    return session.tokens.accessToken.toString();
  }

  /**
   * This function accepts a callback function to call when application is signed-in or already signed-in
   * @param callback the callback function to call when application is signed-in
   */
  async onSignedIn(callback: () => unknown) {
    /**
     * Either Auth.currentAuthenticatedUser() or callback of Hub.listen('auth', xxx) is executed initially;
     * Callback of Hub.listen('auth', xxx) is executed for every sign-in;
     */
    try {
      // Check for initial authentication state
      await getCurrentUser();
      callback();
    } catch (e) {
      // NOOP; not yet authenticated;
    }

    // Listen for sign-in events
    Hub.listen('auth', (capsule) => {
      if (capsule.payload.event === 'signedIn') {
        callback();
      }
    });
  }
}

export const authService = new CognitoAuthService();
