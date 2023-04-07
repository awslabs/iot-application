import { Stack, StackProps } from 'aws-cdk-lib';
import {
  Distribution,
  OriginAccessIdentity,
  ViewerProtocolPolicy,
} from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import {
  AwsCustomResource,
  AwsCustomResourcePolicy,
  PhysicalResourceId,
} from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';
import { randomUUID } from 'crypto';
import path from 'path';

const CLIENT_BUILD_DIR_PATH = '../../../apps/client/build';

export interface PublicAssetStackProps extends StackProps {
  readonly coreServiceUrl: string;
  readonly identityPoolId: string;
  readonly userPoolClientId: string;
  readonly userPoolId: string;
}

export class PublicAssetStack extends Stack {
  readonly publicDistribution: Distribution;

  constructor(scope: Construct, id: string, props: PublicAssetStackProps) {
    super(scope, id, props);

    const { identityPoolId, userPoolClientId, userPoolId, coreServiceUrl } =
      props;

    const assetHashKey = randomUUID();

    const assetBucket = new Bucket(this, 'AssetBucket');
    const assetBucketOAI = new OriginAccessIdentity(this, 'AssetBucketOAI');
    assetBucket.grantRead(assetBucketOAI);

    const clientAssetDeployment = new BucketDeployment(
      this,
      'ClientAssetDeployment',
      {
        destinationBucket: assetBucket,
        destinationKeyPrefix: assetHashKey,
        exclude: ['aws-resources.js'],
        prune: false,
        sources: [Source.asset(path.join(__dirname, CLIENT_BUILD_DIR_PATH))],
      },
    );

    const awsResources = {
      amplifyConfiguration: {
        Auth: {
          region: this.region,
          identityPoolId,
          userPoolId,
          userPoolWebClientId: userPoolClientId,
        },
      },
      coreServer: {
        endpoint: `https://${coreServiceUrl}`,
      },
    };

    const awsResourcesFile = new AwsCustomResource(this, 'AwsResourcesFile', {
      onUpdate: {
        service: 'S3',
        action: 'putObject',
        parameters: {
          Body: `window.awsResources=${this.toJsonString(awsResources)};`,
          Bucket: assetBucket.bucketName,
          Key: `${assetHashKey}/aws-resources.js`,
        },
        // Update physical id to always overwrite
        physicalResourceId: PhysicalResourceId.of(Date.now().toString()),
      },
      policy: AwsCustomResourcePolicy.fromSdkCalls({
        resources: [`${assetBucket.bucketArn}/*/aws-resources.js`],
      }),
    });

    this.publicDistribution = new Distribution(
      this,
      'PublicAssetDistribution',
      {
        defaultBehavior: {
          origin: new S3Origin(assetBucket, {
            originAccessIdentity: assetBucketOAI,
            originPath: assetHashKey,
          }),
          viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        defaultRootObject: 'index.html',
      },
    );
    this.publicDistribution.node.addDependency(
      clientAssetDeployment,
      awsResourcesFile,
    );
  }
}
