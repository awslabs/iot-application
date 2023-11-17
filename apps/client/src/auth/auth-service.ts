import { Auth } from 'aws-amplify';
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
}

export const authService = new CognitoAuthService();
