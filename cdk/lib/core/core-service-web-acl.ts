import { CfnWebACL, CfnWebACLAssociation } from 'aws-cdk-lib/aws-wafv2';
import { Construct } from 'constructs';

export class CoreServiceWebACL extends Construct {
  readonly webACL: CfnWebACL;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.webACL = new CfnWebACL(this, 'WebACL', {
      defaultAction: { allow: {} },
      scope: 'REGIONAL',
      visibilityConfig: {
        cloudWatchMetricsEnabled: false,
        metricName: 'IoTAppCoreServiceWebACL',
        sampledRequestsEnabled: true,
      },
      rules: [
        {
          action: { block: {} },
          name: 'IoTAppCoreServiceRateLimit',
          priority: 0,
          statement: {
            rateBasedStatement: {
              aggregateKeyType: 'IP',
              limit: 3000, // 10 TPS over 5 minutes
            },
          },
          visibilityConfig: {
            cloudWatchMetricsEnabled: true,
            metricName: 'IoTAppCoreServiceRateLimit',
            sampledRequestsEnabled: true,
          },
        },
      ],
    });
  }

  public associate(resourceArn: string) {
    new CfnWebACLAssociation(this, 'WebACLAssociation', {
      resourceArn,
      webAclArn: this.webACL.attrArn,
    });
  }
}
