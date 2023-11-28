import { Stack, StackProps } from 'aws-cdk-lib';
import {
  AttributeType,
  BillingMode,
  ProjectionType,
  Table,
} from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class DatabaseStack extends Stack {
  readonly resourceTable: Table;

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

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
