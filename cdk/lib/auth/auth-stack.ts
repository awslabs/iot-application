import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import {
  CfnIdentityPool,
  CfnIdentityPoolRoleAttachment,
  UserPool,
  UserPoolClient,
  UserPoolDomain,
} from 'aws-cdk-lib/aws-cognito';
import { FederatedPrincipal, PolicyStatement, Role } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { randomUUID } from 'crypto';

export interface AuthStackProps extends StackProps {
  readonly applicationName: string;
  readonly logGroupArn: string;
  readonly removalPolicyOverride?: RemovalPolicy;
}

export class AuthStack extends Stack {
  readonly identityPool: CfnIdentityPool;
  readonly userPool: UserPool;
  readonly userPoolClient: UserPoolClient;
  readonly domain: UserPoolDomain;

  constructor(scope: Construct, id: string, props: AuthStackProps) {
    super(scope, id, props);

    const { applicationName, logGroupArn, removalPolicyOverride } = props;

    this.userPool = new UserPool(this, 'UserPool', {
      signInCaseSensitive: false,
      removalPolicy: removalPolicyOverride,
    });

    this.userPoolClient = new UserPoolClient(this, 'UserPoolClient', {
      userPool: this.userPool,
      oAuth: {
        flows: {
          implicitCodeGrant: true,
        },
        callbackUrls: [
          'https://<your-url>.awsapprunner.com'
        ]
      }
    });

    // Generate a unique name for the userpool domain (required for SSO integration)
    const domainPrefix = 'sitewise-' + randomUUID().toLowerCase().substring(0, 6);

    this.domain = this.userPool.addDomain('Domain', {
      cognitoDomain: {
        domainPrefix
      }
    });

    this.domain.signInUrl(this.userPoolClient, {
      redirectUri: 'https://<your-url>.awsapprunner.com'
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
