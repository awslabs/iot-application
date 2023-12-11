import { type AwsCredentialIdentity } from '@smithy/types';

/**
 * AuthService handles user's credentials.
 */
export interface AuthService {
  /**
   * Returns the user's AWS Credentials.
   * @return - the user's AWS Credentials
   */
  getAwsCredentials(): Promise<AwsCredentialIdentity>;

  /**
   * AWS Region to obtain the AWS Credentials from.
   */
  get awsRegion(): string;

  /**
   * Returns the user's session token.
   * @return - the user's session token
   */
  getToken(): Promise<string>;

  /**
   * This function accepts a callback function to call when application is signed-in or already signed-in
   * @param callback the callback function to call when application is signed-in
   */
  onSignedIn(callback: () => unknown): void;
}
