import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { PublicAssetStack } from './asset/public-asset-stack';
import { AuthStack } from './auth/auth-stack';
import { CoreStack } from './core/core-stack';
import { DatabaseStack } from './database/database-stack';

export class IotApplicationStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const {
      userPool: { userPoolId },
      userPoolClient: { userPoolClientId },
    } = new AuthStack(this, 'Auth');

    const {
      resourceTable: { tableArn, tableName },
    } = new DatabaseStack(this, 'Database');

    new CoreStack(this, 'Core', {
      coreServiceProps: {
        databaseTableArn: tableArn,
        databaseTableName: tableName,
        userPoolClientId: userPoolClientId,
        userPoolId: userPoolId,
      },
    });

    const publicAssetStack = new PublicAssetStack(this, 'PublicAsset', {
      userPoolClientId,
      userPoolId,
    });
    const { publicDistribution } = publicAssetStack;

    new CfnOutput(this, 'App URL', {
      description: 'Endpoint to access the App',
      value: publicDistribution.domainName,
    });
  }
}
