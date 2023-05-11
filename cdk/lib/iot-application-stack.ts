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
      identityPool: { ref: identityPoolId },
    } = new AuthStack(this, 'Auth', props);

    const {
      resourceTable: { tableArn, tableName },
    } = new DatabaseStack(this, 'Database', props);

    const {
      coreService: { serviceUrl: coreServiceUrl },
    } = new CoreStack(this, 'Core', {
      coreServiceProps: {
        databaseTableArn: tableArn,
        databaseTableName: tableName,
        userPoolClientId: userPoolClientId,
        userPoolId: userPoolId,
      },
      ...props
    });

    const publicAssetStack = new PublicAssetStack(this, 'PublicAsset', {
      identityPoolId,
      userPoolClientId,
      userPoolId,
      coreServiceUrl: `https://${coreServiceUrl}`,
      ...props
    });
    const { publicDistribution } = publicAssetStack;

    new CfnOutput(this, 'App URL', {
      description: 'Endpoint to access the App',
      value: `https://${publicDistribution.domainName}`,
    });
  }
}
