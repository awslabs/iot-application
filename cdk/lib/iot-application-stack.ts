import { CfnOutput, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AuthStack } from './auth/auth-stack';
import { CoreStack } from './core/core-stack';
import { DatabaseStack } from './database/database-stack';
import { LoggingStack } from './logging/logging-stack';

export interface LoggingStackProps extends StackProps {
  removalPolicyOverride?: RemovalPolicy;
}

export class IotApplicationStack extends Stack {
  constructor(scope: Construct, id: string, props: LoggingStackProps) {
    super(scope, id, props);

    const {
      logGroup: { logGroupArn },
    } = new LoggingStack(this, 'Logging', {
      ...props,
      applicationName: id,
    });

    const {
      userPool: { userPoolId },
      userPoolClient: { userPoolClientId },
      identityPool: { ref: identityPoolId },
      domain: { domainName },
    } = new AuthStack(this, 'Auth', {
      ...props,
      applicationName: id,
      logGroupArn,
    });

    const {
      resourceTable: { tableArn, tableName },
    } = new DatabaseStack(this, 'Database', props);

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
