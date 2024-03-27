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
   * Sets the user's AWS Credentials.
   */
  setAwsCredentials(credentials: AwsCredentialIdentity): void;

  /**
   * AWS Region to obtain the AWS Credentials from.
   */
  get awsRegion(): string;

  /**
   * Sets the AWS Region.
   */
  setAwsRegion(region: string): void;

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

  // TODO: Refactor interface to only include shared methods
  getEdgeEndpoint?(): string;

  setEdgeEndpoint?(endpoint: string): void;
}
