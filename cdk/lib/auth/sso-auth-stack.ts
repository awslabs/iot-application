import { UserPoolDomain } from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';
import { AuthStackProps, AuthStack } from './auth-stack';

export class SsoAuthStack extends AuthStack {
  readonly domain: UserPoolDomain;

  constructor(scope: Construct, id: string, props: AuthStackProps) {
    super(scope, id, props);

    this.domain = this.userPool.addDomain('Domain', {
      cognitoDomain: {
        // Use the unique id for this cdk construct for naming
        domainPrefix: `sitewise-${this.node.addr.substring(0, 6)}asdf`,
      },
    });

    this.domain.signInUrl(this.userPoolClient, {
      redirectUri: 'https://wunecyq3cs.us-east-2.awsapprunner.com',
    });
  }
}
