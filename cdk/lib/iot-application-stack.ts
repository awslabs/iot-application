import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AuthStack } from './auth/auth-stack';
import { CoreStack } from './core/core-stack';
import { DatabaseStack } from './database/database-stack';

export class IotApplicationStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const authStack = new AuthStack(this, 'Auth');
    const databaseStack = new DatabaseStack(this, 'Database');
    new CoreStack(this, 'Core', {
      coreServiceProps: {
        databaseTableArn: databaseStack.resourceTable.tableArn,
        databaseTableName: databaseStack.resourceTable.tableName,
        userPoolClientId: authStack.userPoolClient.userPoolClientId,
        userPoolId: authStack.userPool.userPoolId,
      },
    });
  }
}
