import { AuthService } from './auth-service.interface';
import { EdgeAuthService } from './edge-auth-service';
import { CognitoAuthService } from './cognito-auth-service';
import { type AwsCredentialIdentity } from '@smithy/types';
import { getAuthMode } from '~/helpers/authMode';

class ClientAuthService {
  private authService: AuthService;

  constructor() {
    if (getAuthMode() === 'edge') {
      this.authService = new EdgeAuthService();
    } else {
      this.authService = new CognitoAuthService();
    }
  }

  setAwsCredentials(credentials: AwsCredentialIdentity) {
    this.authService.setAwsCredentials(credentials);
  }

  getAwsCredentials() {
    return this.authService.getAwsCredentials();
  }

  get awsRegion() {
    return this.authService.awsRegion;
  }

  getToken() {
    return this.authService.getToken();
  }

  onSignedIn(callback: () => unknown) {
    return this.authService.onSignedIn(callback);
  }
}

export const authService = new ClientAuthService();
