import path = require('path');
import { CfnService } from 'aws-cdk-lib/aws-apprunner';
import { DockerImageAsset } from 'aws-cdk-lib/aws-ecr-assets';
import {
  ManagedPolicy,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export interface CoreServiceProps {
  readonly databaseTableArn: string;
  readonly databaseTableName: string;
  readonly userPoolClientId: string;
  readonly userPoolId: string;
}

export class CoreService extends Construct {
  readonly databaseTableArn: string;
  readonly databaseTableName: string;
  readonly userPoolId: string;
  readonly userPoolClientId: string;

  constructor(scope: Construct, id: string, props: CoreServiceProps) {
    super(scope, id);

    ({
      databaseTableArn: this.databaseTableArn,
      databaseTableName: this.databaseTableName,
      userPoolClientId: this.userPoolClientId,
      userPoolId: this.userPoolId,
    } = props);

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
        actions: ['dynamodb:*'],
        resources: [this.databaseTableArn, `${this.databaseTableArn}/index/*`],
      }),
    );

    const image = new DockerImageAsset(this, 'image', {
      directory: path.join(__dirname, '../../..'),
    });

    new CfnService(this, 'Service', {
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
                value: this.userPoolClientId,
              },
              {
                name: 'COGNITO_USER_POOL_ID',
                value: this.userPoolId,
              },
              {
                name: 'DATABASE_TABLE_NAME',
                value: this.databaseTableName,
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
