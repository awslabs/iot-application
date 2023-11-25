import { Auth, Hub } from 'aws-amplify';
import { AuthService } from './auth-service.interface';

class CognitoAuthService implements AuthService {
  getAwsCredentials() {
    return Auth.currentCredentials();
  }

  get awsRegion() {
    return Auth.configure().region ?? 'us-west-2';
  }

  async getToken() {
    const session = await Auth.currentSession();
    return session.getAccessToken().getJwtToken();
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
      await Auth.currentAuthenticatedUser();
      callback();
    } catch (e) {
      // NOOP; not yet authenticated;
    }

    // Listen for sign-in events
    Hub.listen('auth', (capsule) => {
      if (capsule.payload.event === 'signIn') {
        callback();
      }
    });
  }
}

export const authService = new CognitoAuthService();
