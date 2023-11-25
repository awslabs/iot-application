import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AuthStack } from './auth/auth-stack';
import { CoreStack } from './core/core-stack';
import { DatabaseStack } from './database/database-stack';
import { LoggingStack } from './logging/logging-stack';

export class IotApplicationStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const {
      logGroup: { logGroupArn },
    } = new LoggingStack(this, 'Logging', { applicationName: id });

    const {
      userPool: { userPoolId },
      userPoolClient: { userPoolClientId },
      identityPool: { ref: identityPoolId },
    } = new AuthStack(this, 'Auth', { applicationName: id, logGroupArn });

    const {
      resourceTable: { tableArn, tableName },
    } = new DatabaseStack(this, 'Database', props);

    const {
      coreService: {
        service: { attrServiceUrl: coreServiceUrl },
      },
    } = new CoreStack(this, 'Core', {
      coreServiceProps: {
        applicationName: id,
        databaseTableArn: tableArn,
        databaseTableName: tableName,
        identityPoolId: identityPoolId,
        userPoolClientId: userPoolClientId,
        userPoolId: userPoolId,
      },
      ...props,
    });

    new CfnOutput(this, 'App URL', {
      description: 'Endpoint to access the App',
      value: `https://${coreServiceUrl}`,
    });
  }
}
