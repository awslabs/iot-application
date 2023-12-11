import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import {
  AttributeType,
  BillingMode,
  ProjectionType,
  Table,
} from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export interface DatabaseStackProps extends StackProps {
  readonly removalPolicyOverride?: RemovalPolicy;
}

export class DatabaseStack extends Stack {
  readonly resourceTable: Table;

  constructor(scope: Construct, id: string, props: DatabaseStackProps) {
    super(scope, id, props);

    const { removalPolicyOverride } = props;

    this.resourceTable = new Table(this, 'ResourceTable', {
      pointInTimeRecovery: true,
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'resourceType',
        type: AttributeType.STRING,
      },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: removalPolicyOverride,
    });
    this.resourceTable.addGlobalSecondaryIndex({
      indexName: 'resourceTypeIndex',
      partitionKey: {
        name: 'resourceType',
        type: AttributeType.STRING,
      },
      projectionType: ProjectionType.ALL,
    });
  }
}
