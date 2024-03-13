import { CfnOutput, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AuthStack } from './auth/auth-stack';
import { SsoAuthStack } from './auth/sso-auth-stack';
import { CoreStack } from './core/core-stack';
import { DatabaseStack } from './database/database-stack';
import { LoggingStack } from './logging/logging-stack';

export const AuthModeOptions = {
  SSO: 'sso',
  COGNITO: 'cognito',
  EDGE: 'edge',
};

export interface LoggingStackProps extends StackProps {
  removalPolicyOverride?: RemovalPolicy;
}

export class IotApplicationStack extends Stack {
  constructor(scope: Construct, id: string, props: LoggingStackProps) {
    super(scope, id, props);

    const authMode = this.node.tryGetContext('authMode') as string;
    const edgeEndpoint = this.node.tryGetContext('edgeEndpoint') as string;

    const {
      logGroup: { logGroupArn },
    } = new LoggingStack(this, 'Logging', {
      ...props,
      applicationName: id,
    });

    const {
      resourceTable: { tableArn, tableName },
    } = new DatabaseStack(this, 'Database', props);

    // Cognito domain is required for SSO
    if (authMode === AuthModeOptions.SSO) {
      const {
        userPool: { userPoolId },
        userPoolClient: { userPoolClientId },
        identityPool: { ref: identityPoolId },
        domain: { domainName },
      } = new SsoAuthStack(this, 'Auth', {
        ...props,
        applicationName: id,
        logGroupArn,
      });

      const {
        coreService: {
          service: { attrServiceUrl: coreServiceUrl },
        },
      } = new CoreStack(this, 'Core', {
        ...props,
        coreServiceProps: {
          applicationName: id,
          databaseTableArn: tableArn,
          databaseTableName: tableName,
          identityPoolId: identityPoolId,
          userPoolClientId: userPoolClientId,
          userPoolId: userPoolId,
          domainName: domainName,
          authMode,
        },
      });

      new CfnOutput(this, 'AppURL', {
        description: 'Endpoint to access the App',
        value: `https://${coreServiceUrl}`,
      });

      new CfnOutput(this, 'UserPoolId', {
        description: 'UserPool ID of the App',
        value: userPoolId,
      });
    } else {
      const {
        userPool: { userPoolId },
        userPoolClient: { userPoolClientId },
        identityPool: { ref: identityPoolId },
      } = new AuthStack(this, 'Auth', {
        ...props,
        applicationName: id,
        logGroupArn,
      });

      const {
        coreService: {
          service: { attrServiceUrl: coreServiceUrl },
        },
      } = new CoreStack(this, 'Core', {
        ...props,
        coreServiceProps: {
          applicationName: id,
          databaseTableArn: tableArn,
          databaseTableName: tableName,
          identityPoolId: identityPoolId,
          userPoolClientId: userPoolClientId,
          userPoolId: userPoolId,
          authMode: authMode ? authMode : AuthModeOptions.COGNITO,
          edgeEndpoint,
        },
      });

      new CfnOutput(this, 'AppURL', {
        description: 'Endpoint to access the App',
        value: `https://${coreServiceUrl}`,
      });

      new CfnOutput(this, 'UserPoolId', {
        description: 'UserPool ID of the App',
        value: userPoolId,
      });
    }
  }
}
