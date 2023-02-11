module.exports = {
  TableName: 'ApiResourceTable',
  KeySchema: [
    { AttributeName: 'id', KeyType: 'HASH' },
    { AttributeName: 'resourceType', KeyType: 'RANGE' }
  ],
  AttributeDefinitions: [
    { AttributeName: 'id', AttributeType: 'S' },
    { AttributeName: 'resourceType', AttributeType: 'S' },
    { AttributeName: 'lastUpdateDate', AttributeType: 'S' },
  ],
  BillingMode: 'PAY_PER_REQUEST',
  GlobalSecondaryIndexes: [
    {
      IndexName: 'resourceTypeIndex',
      KeySchema: [
        { AttributeName: 'resourceType', KeyType: 'HASH' },
        // { AttributeName: 'lastUpdateDate', KeyType: 'RANGE' }
      ],
      Projection: {
        ProjectionType: 'ALL',
      },
    },
  ],
};
