import { Stack, StackProps } from 'aws-cdk-lib';
import { OriginAccessIdentity } from 'aws-cdk-lib/aws-cloudfront';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import path from 'path';

const CLIENT_BUILD_DIR_PATH = '../../../apps/client/build';

export interface AssetBucketStackProps extends StackProps {
  readonly assetHashKey: string;
}

export class AssetBucketStack extends Stack {
  readonly assetBucket: Bucket;
  readonly assetBucketOAI: OriginAccessIdentity;

  constructor(scope: Construct, id: string, props: AssetBucketStackProps) {
    super(scope, id, props);

    const { assetHashKey } = props;

    this.assetBucket = new Bucket(this, 'AssetBucket');

    this.assetBucketOAI = new OriginAccessIdentity(this, 'assetBucketOAI');
    this.assetBucket.grantRead(this.assetBucketOAI);

    new BucketDeployment(this, 'FrontendAssetDeployment', {
      destinationBucket: this.assetBucket,
      destinationKeyPrefix: assetHashKey,
      exclude: ['aws-resources.js'],
      prune: false,
      sources: [Source.asset(path.join(__dirname, CLIENT_BUILD_DIR_PATH))],
    });
  }
}
