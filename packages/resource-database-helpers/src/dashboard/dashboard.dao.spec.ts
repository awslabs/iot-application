import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBDocumentClient, QueryCommand, TransactGetCommand, TransactWriteCommand } from '@aws-sdk/lib-dynamodb';
import { DashboardDao } from './dashboard.dao';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DashboardConstants } from './dashboard.constants';
import { DashboardWidgetType } from './dashboard.types';

Object.defineProperty(globalThis, 'crypto', {
  value: {
    randomUUID: jest.fn(() => id),
  }
});

const id = '06965981-b4bf-4a20-88d2-50d5a29a321c';
const tableName = 'mock-table-name';
const ddbMock = mockClient(DynamoDBDocumentClient);
const dashboardName = 'DashboardName';
const dashboardNameUpdated = 'DashboardNameUpdated';
const dashboardDescription = 'DashboardDescription';
const dashboardDescriptionUpdated = 'DashboardDescriptionUpdated';
const dashboardDefinition = {
  widgets: [],
};
const dashboardDefinitionUpdated = {
  widgets: [{
    title: 'WidgetNameUpdated',
    type: DashboardWidgetType.Bar,
  }],
};
const date = new Date('2023-01-01');
const dateString = date.toISOString();
const dynamodbError = new Error('expected error');

jest
  .useFakeTimers()
  .setSystemTime(date);

beforeEach(() => {
  ddbMock.reset();
});

describe('Dashboard DAO', () => {
  it('should create dashboard', async () => {
    ddbMock
      .on(
        TransactWriteCommand, 
        {
          TransactItems: [
            {
              Put: {
                TableName: tableName,
                Item: {
                  id,
                  resourceType: DashboardConstants.DASHBOARD_DEFINITION_RESOURCE_TYPE,
                  definition: dashboardDefinition,
                  creationDate: date,
                  lastUpdateDate: date,
                },
                ConditionExpression: 'attribute_not_exists(id)',
              }
            },
            {
              Put: {
                TableName: tableName,
                Item: {
                  id,
                  resourceType: DashboardConstants.DASHBOARD_DATA_RESOURCE_TYPE,
                  name: dashboardName,
                  description: dashboardDescription,
                  creationDate: date,
                  lastUpdateDate: date,
                },
                ConditionExpression: 'attribute_not_exists(id)',
              }
            },
          ],
        }
      )
      .resolves({});
  
    const dbDocClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
    
    const dao = new DashboardDao({
      tableName,
      dbDocClient,
    });
  
    expect(dao.create({
      name: dashboardName,
      description: dashboardDescription,
      definition: dashboardDefinition,
    })).resolves.toEqual({
      id,
      name: dashboardName,
      description: dashboardDescription,
      definition: dashboardDefinition,
      creationDate: date,
      lastUpdateDate: date,
    });
  });

  it('should throw an error for dashboard creation failure', async () => {
    ddbMock
      .on(TransactWriteCommand)
      .rejects(dynamodbError);
  
    const dbDocClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
    
    const dao = new DashboardDao({
      tableName,
      dbDocClient,
    });
  
    expect(dao.create({
      name: dashboardName,
      description: dashboardDescription,
      definition: dashboardDefinition,
    })).rejects.toThrowError(dynamodbError);
  });

  it('should read dashboard', async () => {
    ddbMock
      .on(
        TransactGetCommand, 
        {
          TransactItems: [
            {
              Get: {
                TableName: tableName,
                Key: { id, resourceType: DashboardConstants.DASHBOARD_DATA_RESOURCE_TYPE },
              }
            },
            {
              Get: {
                TableName: tableName,
                Key: { id, resourceType: DashboardConstants.DASHBOARD_DEFINITION_RESOURCE_TYPE },
              }
            },
          ]
        }
      )
      .resolves({
        Responses: [
          {
            Item: {
              resourceType: DashboardConstants.DASHBOARD_DATA_RESOURCE_TYPE,
              lastUpdateDate: date,
              creationDate: dateString,
              description: dashboardDescription,
              id,
              name: dashboardName,
            },
          },
          {
            Item: {
              definition: dashboardDefinition,
              resourceType: DashboardConstants.DASHBOARD_DEFINITION_RESOURCE_TYPE,
              lastUpdateDate: dateString,
              creationDate: dateString,
              id,
            },
          }
        ],
      });
  
    const dbDocClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
    
    const dao = new DashboardDao({
      tableName,
      dbDocClient,
    });
  
    expect(dao.read({ id }))
      .resolves.toEqual({
        id: id,
        name: dashboardName,
        description: dashboardDescription,
        definition: dashboardDefinition,
        creationDate: date,
        lastUpdateDate: date,
      });
  });

  it('should throw an error for non-existing dashboard read', async () => {
    ddbMock
      .on(TransactGetCommand)
      .resolves({
        Responses: [],
      });
  
    const dbDocClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
    
    const dao = new DashboardDao({
      tableName,
      dbDocClient,
    });
  
    expect(dao.read({ id })).rejects.toThrowError(DashboardConstants.RESOURCE_NOT_FOUND_ERROR_MSG);
  });

  it('should throw an error for dashboard read failure', async () => {
    ddbMock
      .on(TransactGetCommand)
      .rejects(dynamodbError);
  
    const dbDocClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
    
    const dao = new DashboardDao({
      tableName,
      dbDocClient,
    });
  
    expect(dao.read({ id })).rejects.toThrowError(dynamodbError);
  });

  it('should update dashboard', async () => {
    ddbMock
      .on(
        TransactWriteCommand, 
        {
          TransactItems: [
            {
              Update: {
                TableName: tableName,
                Key: {
                  id,
                  resourceType: DashboardConstants.DASHBOARD_DEFINITION_RESOURCE_TYPE,
                },
                UpdateExpression: 'set #definition = :definition, lastUpdateDate = :lastUpdateDate',
                ExpressionAttributeValues: {
                  ':id': id,
                  ':resourceType': DashboardConstants.DASHBOARD_DEFINITION_RESOURCE_TYPE,
                  ':definition': dashboardDescriptionUpdated,
                  ':lastUpdateDate': date,
                },
                ExpressionAttributeNames: {
                  '#definition': 'definition',
                },
                ConditionExpression: '(id = :id) and (resourceType = :resourceType)'
              }
            },
            {
              Update: {
                TableName: tableName,
                Key: {
                  id,
                  resourceType: DashboardConstants.DASHBOARD_DATA_RESOURCE_TYPE,
                },
                // Capture the DDB reserved words, see https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ReservedWords.html
                UpdateExpression: 'set #name = :name, #description = :description, lastUpdateDate = :lastUpdateDate',
                ExpressionAttributeValues: {
                  ':id': id,
                  ':resourceType': DashboardConstants.DASHBOARD_DATA_RESOURCE_TYPE,
                  ':name': dashboardNameUpdated,
                  ':description': dashboardDefinitionUpdated,
                  ':lastUpdateDate': date,
                },
                ExpressionAttributeNames: {
                  '#name': 'name',
                  '#description': 'description',
                },
                ConditionExpression: '(id = :id) and (resourceType = :resourceType)'
              }
            },
          ],
        }
      )
      .resolves({});
  
    const dbDocClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
    
    const dao = new DashboardDao({
      tableName,
      dbDocClient,
    });
  
    expect(dao.update({
      id,
      name: dashboardName,
      description: dashboardNameUpdated,
      definition: dashboardDefinitionUpdated,
    })).resolves.toEqual({
      id,
      name: dashboardName,
      description: dashboardNameUpdated,
      definition: dashboardDefinitionUpdated,
      creationDate: date,
      lastUpdateDate: date,
    });
  });

  it('should throw an error for dashboard update failure', async () => {
    ddbMock
      .on(TransactWriteCommand)
      .rejects(dynamodbError);
  
    const dbDocClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
    
    const dao = new DashboardDao({
      tableName,
      dbDocClient,
    });
  
    expect(dao.update({
      id,
      name: dashboardName,
      description: dashboardNameUpdated,
      definition: dashboardDefinitionUpdated,
    })).rejects.toThrowError(dynamodbError);
  });

  it('should delete dashboard', async () => {
    ddbMock
      .on(
        TransactWriteCommand, 
        {
          TransactItems: [
            {
              Delete: {
                TableName: tableName,
                Key: {
                  id,
                  resourceType: DashboardConstants.DASHBOARD_DATA_RESOURCE_TYPE,
                },
              },
            },
            {
              Delete: {
                TableName: tableName,
                Key: {
                  id,
                  resourceType: DashboardConstants.DASHBOARD_DEFINITION_RESOURCE_TYPE,
                },
              },
            },
          ],
        }
      )
      .resolves({});
  
    const dbDocClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
    
    const dao = new DashboardDao({
      tableName,
      dbDocClient,
    });
  
    expect(dao.delete({ id })).resolves.toBeUndefined();
  });

  it('should throw an error for dashboard deletion failure', async () => {
    ddbMock
      .on(TransactWriteCommand)
      .rejects(dynamodbError);
  
    const dbDocClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
    
    const dao = new DashboardDao({
      tableName,
      dbDocClient,
    });
  
    expect(dao.delete({ id })).rejects.toThrowError(dynamodbError);
  });

  it('should list dashboard summaries', async () => {
    ddbMock
      .on(
        QueryCommand, 
        {
          TableName: tableName,
          Limit: 100,
          KeyConditionExpression: 'resourceType = :resourceType',
          ExpressionAttributeValues: {
            ':resourceType': DashboardConstants.DASHBOARD_DATA_RESOURCE_TYPE,
          },
          IndexName: DashboardConstants.RESOURCE_TYPE_GSI,
        }
      )
      .resolves({
        Items: [
          {
            resourceType: DashboardConstants.DASHBOARD_DATA_RESOURCE_TYPE,
            lastUpdateDate: date,
            creationDate: date,
            description: dashboardDescription,
            id,
            name: dashboardName,
          }
        ],
        LastEvaluatedKey: {
          id,
          resourceType: DashboardConstants.DASHBOARD_DATA_RESOURCE_TYPE,
          lastUpdateDate: date,
        },
      });
  
    const dbDocClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
    
    const dao = new DashboardDao({
      tableName,
      dbDocClient,
    });
  
    expect(dao.listSummaries())
      .resolves.toEqual({
        summaries: [
          {
            lastUpdateDate: date,
            creationDate: date,
            description: dashboardDescription,
            id,
            name: dashboardName,
          }
        ],
        nextToken: {
          id,
          resourceType: DashboardConstants.DASHBOARD_DATA_RESOURCE_TYPE,
          lastUpdateDate: date,
        },
      });
  });

  it('should list dashboard summaries with next token', async () => {
    const nextPageDashboardId = 'c83d9f84-1e3a-4d74-8253-a34eab9cdd32';

    ddbMock
      .on(
        QueryCommand, 
        {
          TableName: tableName,
          Limit: 100,
          KeyConditionExpression: 'resourceType = :resourceType',
          ExpressionAttributeValues: {
            ':resourceType': DashboardConstants.DASHBOARD_DATA_RESOURCE_TYPE,
          },
          IndexName: DashboardConstants.RESOURCE_TYPE_GSI,
          ExclusiveStartKey: {
            id,
            resourceType: DashboardConstants.DASHBOARD_DATA_RESOURCE_TYPE,
            lastUpdateDate: date,
          },
        }
      )
      .resolves({
        Items: [
          {
            resourceType: DashboardConstants.DASHBOARD_DATA_RESOURCE_TYPE,
            lastUpdateDate: date,
            creationDate: date,
            description: dashboardDescription,
            id: nextPageDashboardId,
            name: dashboardName,
          }
        ],
      });
  
    const dbDocClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
    
    const dao = new DashboardDao({
      tableName,
      dbDocClient,
    });
  
    expect(dao.listSummaries(
      {
        nextToken: {
          id,
          resourceType: DashboardConstants.DASHBOARD_DATA_RESOURCE_TYPE,
          lastUpdateDate: date,
        },
      }))
      .resolves.toEqual({
        summaries: [
          {
            lastUpdateDate: date,
            creationDate: date,
            description: dashboardDescription,
            id: nextPageDashboardId,
            name: dashboardName,
          }
        ],
      });
  });

  it('should throw an error for dashboard summaries list failure', async () => {
    ddbMock
      .on(QueryCommand)
      .rejects(dynamodbError);
  
    const dbDocClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
    
    const dao = new DashboardDao({
      tableName,
      dbDocClient,
    });
  
    expect(dao.listSummaries()).rejects.toThrowError(dynamodbError);
  });
});
