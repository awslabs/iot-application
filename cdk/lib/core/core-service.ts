import { CfnService } from 'aws-cdk-lib/aws-apprunner';
import { DockerImageAsset } from 'aws-cdk-lib/aws-ecr-assets';
import {
  ManagedPolicy,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import path from 'path';

export interface CoreServiceProps {
  readonly databaseTableArn: string;
  readonly databaseTableName: string;
  readonly userPoolClientId: string;
  readonly userPoolId: string;
}

export class CoreService extends Construct {
  readonly service: CfnService;

  constructor(scope: Construct, id: string, props: CoreServiceProps) {
    super(scope, id);

    const {
      databaseTableArn,
      databaseTableName,
      userPoolClientId,
      userPoolId,
    } = props;

    const serviceSourceRolePrincipal = new ServicePrincipal(
      'build.apprunner.amazonaws.com',
    );
    const serviceSourceRole = new Role(this, 'SourceRole', {
      assumedBy: serviceSourceRolePrincipal,
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName(
          'service-role/AWSAppRunnerServicePolicyForECRAccess',
        ),
      ],
    });

    const serviceInstanceRolePrincipal = new ServicePrincipal(
      'tasks.apprunner.amazonaws.com',
    );
    const serviceInstanceRole = new Role(this, 'InstanceRole', {
      assumedBy: serviceInstanceRolePrincipal,
    });
    serviceInstanceRole.addToPolicy(
      new PolicyStatement({
        actions: [
          'dynamodb:DescribeTable',
          'dynamodb:DeleteItem',
          'dynamodb:GetItem',
          'dynamodb:PutItem',
          'dynamodb:Query',
          'dynamodb:UpdateItem',
        ],
        resources: [databaseTableArn, `${databaseTableArn}/index/*`],
      }),
    );

    const image = new DockerImageAsset(this, 'image', {
      directory: path.join(__dirname, '../../..'),
    });

    this.service = new CfnService(this, 'Service', {
      sourceConfiguration: {
        authenticationConfiguration: {
          accessRoleArn: serviceSourceRole.roleArn,
        },
        autoDeploymentsEnabled: false,
        imageRepository: {
          imageIdentifier: image.imageUri,
          imageRepositoryType: 'ECR',
          imageConfiguration: {
            port: '3000',
            runtimeEnvironmentVariables: [
              {
                name: 'COGNITO_USER_POOL_CLIENT_ID',
                value: userPoolClientId,
              },
              {
                name: 'COGNITO_USER_POOL_ID',
                value: userPoolId,
              },
              {
                name: 'DATABASE_TABLE_NAME',
                value: databaseTableName,
              },
            ],
          },
        },
      },
      healthCheckConfiguration: {
        path: '/health',
        protocol: 'HTTP',
      },
      instanceConfiguration: {
        instanceRoleArn: serviceInstanceRole.roleArn,
      },
    });
  }
}
