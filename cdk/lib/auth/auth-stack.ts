import { Stack, StackProps } from 'aws-cdk-lib';
import {
  CfnIdentityPool,
  CfnIdentityPoolRoleAttachment,
  UserPool,
  UserPoolClient,
} from 'aws-cdk-lib/aws-cognito';
import { FederatedPrincipal, PolicyStatement, Role } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export interface AuthStackProps extends StackProps {
  readonly applicationName: string;
  readonly logGroupArn: string;
}

export class AuthStack extends Stack {
  readonly identityPool: CfnIdentityPool;
  readonly userPool: UserPool;
  readonly userPoolClient: UserPoolClient;

  constructor(scope: Construct, id: string, props: AuthStackProps) {
    super(scope, id);

    const { applicationName, logGroupArn } = props;

    this.userPool = new UserPool(this, 'UserPool', {
      signInCaseSensitive: false,
    });

    this.userPoolClient = new UserPoolClient(this, 'UserPoolClient', {
      userPool: this.userPool,
    });

    this.identityPool = new CfnIdentityPool(this, 'IdentityPool', {
      allowUnauthenticatedIdentities: false,
      cognitoIdentityProviders: [
        {
          clientId: this.userPoolClient.userPoolClientId,
          providerName: this.userPool.userPoolProviderName,
        },
      ],
    });

    const authenticatedRole = new Role(this, 'AuthenticatedRole', {
      assumedBy: new FederatedPrincipal(
        'cognito-identity.amazonaws.com',
        {
          StringEquals: {
            'cognito-identity.amazonaws.com:aud': this.identityPool.ref,
          },
          'ForAnyValue:StringLike': {
            'cognito-identity.amazonaws.com:amr': 'authenticated',
          },
        },
        'sts:AssumeRoleWithWebIdentity',
      ),
    });

    // IoT CloudWatch Access
    authenticatedRole.addToPolicy(
      new PolicyStatement({
        actions: ['cloudwatch:PutMetricData'],
        resources: ['*'],
        conditions: {
          StringEquals: {
            'cloudwatch:namespace': applicationName,
          },
        },
      }),
    );

    // IoT CloudWatch Logs Access
    authenticatedRole.addToPolicy(
      new PolicyStatement({
        actions: ['logs:CreateLogStream', 'logs:PutLogEvents'],
        resources: [logGroupArn],
      }),
    );

    // IoT Data Access
    authenticatedRole.addToPolicy(
      new PolicyStatement({
        actions: [
          'iotevents:DescribeAlarmModel',
          'iotevents:ListTagsForResource',
          'iotsitewise:BatchGetAssetPropertyAggregates',
          'iotsitewise:BatchGetAssetPropertyValue',
          'iotsitewise:BatchGetAssetPropertyValueHistory',
          'iotsitewise:DescribeAsset',
          'iotsitewise:DescribeAssetModel',
          'iotsitewise:DescribeAssetProperty',
          'iotsitewise:GetAssetPropertyAggregates',
          'iotsitewise:GetAssetPropertyValue',
          'iotsitewise:GetAssetPropertyValueHistory',
          'iotsitewise:ListAssetModels',
          'iotsitewise:ListAssets',
          'iotsitewise:ListAssetModelProperties',
          'iotsitewise:ListAssetProperties',
          'iotsitewise:ListAssetRelationships',
          'iotsitewise:ListAssociatedAssets',
          'iotsitewise:ListTimeSeries',
          'iottwinmaker:ExecuteQuery',
          'iottwinmaker:ListWorkspaces',
        ],
        resources: ['*'],
      }),
    );

    new CfnIdentityPoolRoleAttachment(this, 'IdentityPoolRoleAttachment', {
      identityPoolId: this.identityPool.ref,
      roles: {
        authenticated: authenticatedRole.roleArn,
      },
    });
  }
}
