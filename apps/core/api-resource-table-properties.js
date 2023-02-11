module.exports = {
  TableName: 'ApiResourceTable',
  KeySchema: [
    { AttributeName: 'id', KeyType: 'HASH' },
    { AttributeName: 'resourceType', KeyType: 'RANGE' }
  ],
  AttributeDefinitions: [
    { AttributeName: 'id', AttributeType: 'S' },
    { AttributeName: 'resourceType', AttributeType: 'S' },
  ],
  BillingMode: 'PAY_PER_REQUEST',
  GlobalSecondaryIndexes: [
    {
      IndexName: 'resourceTypeIndex',
      KeySchema: [
        { AttributeName: 'resourceType', KeyType: 'HASH' },
      ],
      Projection: {
        ProjectionType: 'ALL',
      },
    },
  ],
};
