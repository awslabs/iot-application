import { Aws } from 'aws-cdk-lib';
import {
  CfnAutoScalingConfiguration,
  CfnService,
} from 'aws-cdk-lib/aws-apprunner';
import { DockerImageAsset } from 'aws-cdk-lib/aws-ecr-assets';
import {
  ManagedPolicy,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import path from 'path';
import { getServicesEndpoints } from '../csp/public-asset-directives';

export interface CoreServiceProps {
  readonly applicationName: string;
  readonly databaseTableArn: string;
  readonly databaseTableName: string;
  readonly identityPoolId: string;
  readonly userPoolClientId: string;
  readonly userPoolId: string;
  readonly domainName: string;
}

export class CoreService extends Construct {
  readonly service: CfnService;

  constructor(scope: Construct, id: string, props: CoreServiceProps) {
    super(scope, id);

    const {
      applicationName,
      databaseTableArn,
      databaseTableName,
      identityPoolId,
      userPoolClientId,
      userPoolId,
      domainName,
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

    serviceInstanceRole.addToPolicy(
      new PolicyStatement({
        actions: [
          'iotsitewise:ListPortals',
          'iotsitewise:ListProjects',
          'iotsitewise:ListDashboards',
          'iotsitewise:DescribeDashboard',
        ],
        resources: ['*'],
      }),
    );

    const image = new DockerImageAsset(this, 'image', {
      directory: path.join(__dirname, '../../..'),
    });

    const { attrAutoScalingConfigurationArn: autoScalingConfigArn } =
      new CfnAutoScalingConfiguration(this, 'AutoScalingConfig', {
        maxSize: 1,
        minSize: 1,
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
                name: 'APPLICATION_NAME',
                value: applicationName,
              },
              {
                name: 'COGNITO_IDENTITY_POOL_ID',
                value: identityPoolId,
              },
              {
                name: 'COGNITO_USER_POOL_CLIENT_ID',
                value: userPoolClientId,
              },
              {
                name: 'COGNITO_USER_POOL_ID',
                value: userPoolId,
              },
              {
                name: 'COGNITO_DOMAIN_NAME',
                value: domainName,
              },
              {
                name: 'DATABASE_TABLE_NAME',
                value: databaseTableName,
              },
              {
                name: 'SERVICE_ENDPOINTS',
                // Space separated
                value: getServicesEndpoints(Aws.REGION).join(' '),
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
        cpu: '1 vCPU',
        instanceRoleArn: serviceInstanceRole.roleArn,
        memory: '2 GB',
      },
      autoScalingConfigurationArn: autoScalingConfigArn,
    });
  }
}
