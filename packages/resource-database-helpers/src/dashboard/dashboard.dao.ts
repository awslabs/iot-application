import { NativeAttributeValue } from '@aws-sdk/util-dynamodb';
import { DynamoDBDocumentClient, TransactWriteCommand, QueryCommand, TransactGetCommand } from '@aws-sdk/lib-dynamodb';
import { Dashboard, DashboardSummary } from './dashboard.types';
import { DashboardConstants } from './dashboard.constants';

export type DashboardCreateInput = Omit<Dashboard, 'id' | 'creationDate' | 'lastUpdateDate'>;
export type DashboardCreateOutput = Dashboard;

export type DashboardReadInput = Pick<Dashboard, 'id'>;
export type DashboardReadOutput = Dashboard;

export type DashboardUpdateInput = Omit<Dashboard, 'creationDate' | 'lastUpdateDate'>;
export type DashboardUpdateOutput = Dashboard;

export type DashboardDeleteInput = Pick<Dashboard, 'id'>;
export type DashboardDeleteOutput = void

export type DashboardListSummariesNextToken = Record<string, NativeAttributeValue>;
export type DashboardListSummariesInput = { nextToken?: DashboardListSummariesNextToken };
export type DashboardListSummariesOutput = { summaries: DashboardSummary[], nextToken?: DashboardListSummariesNextToken };

export interface DashboardDaoInterface {
  create(input: DashboardCreateInput): Promise<DashboardCreateOutput>;
  read(input: DashboardReadInput): Promise<DashboardReadOutput>;
  update(input: DashboardUpdateInput): Promise<DashboardUpdateOutput>;
  delete(input: DashboardDeleteInput): Promise<DashboardDeleteOutput>;
  listSummaries(input?: DashboardListSummariesInput): Promise<DashboardListSummariesOutput>;
}

export type DashboardDaoConfiguration = { tableName: string, dbDocClient: DynamoDBDocumentClient };

export class DashboardDao implements DashboardDaoInterface {
  private tableName: string;
  private dbDocClient: DynamoDBDocumentClient;

  constructor(configuration: DashboardDaoConfiguration) {
    ({
      tableName: this.tableName,
      dbDocClient: this.dbDocClient,
    } = configuration);
  }

  async create(
    {
      name,
      definition,
      description,
    }: DashboardCreateInput
  ): Promise<DashboardCreateOutput> {
    const id = crypto.randomUUID();
    const creationDateObj = new Date;
    const creationDate = creationDateObj.toISOString();
    const lastUpdateDate = creationDate;

    await this.dbDocClient.send(
      new TransactWriteCommand(
        {
          TransactItems: [
            {
              Put: {
                TableName: this.tableName,
                Item: {
                  id,
                  resourceType: DashboardConstants.DASHBOARD_DEFINITION_RESOURCE_TYPE,
                  definition,
                  creationDate,
                  lastUpdateDate,
                },
                ConditionExpression: 'attribute_not_exists(id)',
              }
            },
            {
              Put: {
                TableName: this.tableName,
                Item: {
                  id,
                  resourceType: DashboardConstants.DASHBOARD_DATA_RESOURCE_TYPE,
                  name,
                  description,
                  creationDate,
                  lastUpdateDate,
                },
                ConditionExpression: 'attribute_not_exists(id)',
              }
            },
          ],
        }
      )
    );
    
    return {
      name,
      definition,
      description,
      id,
      creationDate: creationDateObj,
      lastUpdateDate: creationDateObj,
    };
  }

  async read({ id }: DashboardReadInput): Promise<DashboardReadOutput> {
    const { Responses } = await this.dbDocClient.send(
      new TransactGetCommand({
        TransactItems: [
          {
            Get: {
              TableName: this.tableName,
              Key: { id, resourceType: DashboardConstants.DASHBOARD_DATA_RESOURCE_TYPE },
            }
          },
          {
            Get: {
              TableName: this.tableName,
              Key: { id, resourceType: DashboardConstants.DASHBOARD_DEFINITION_RESOURCE_TYPE },
            }
          },
        ]
      })
    );

    if (!Responses[0]?.Item || !Responses[1]?.Item) {
      throw new Error(DashboardConstants.RESOURCE_NOT_FOUND_ERROR_MSG);
    }

    const {
      creationDate,
      description,
      lastUpdateDate,
      name,
    } = Responses[0].Item;
    const {
      definition
    } = Responses[1].Item;

    return {
      id,
      creationDate: new Date(creationDate),
      description,
      lastUpdateDate: new Date(lastUpdateDate),
      name,
      definition,
    };
  }

  async update(
    {
      id,
      name,
      definition,
      description,
    }: DashboardUpdateInput
  ): Promise<DashboardUpdateOutput> {
    const creationDateObj = new Date;
    const creationDate = creationDateObj.toISOString();
    const lastUpdateDate = creationDate;

    await this.dbDocClient.send(
      new TransactWriteCommand(
        {
          TransactItems: [
            {
              Update: {
                TableName: this.tableName,
                Key: {
                  id,
                  resourceType: DashboardConstants.DASHBOARD_DEFINITION_RESOURCE_TYPE,
                },
                // Capture the DDB reserved words, see https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ReservedWords.html
                UpdateExpression: 'set #definition = :definition, lastUpdateDate = :lastUpdateDate',
                ExpressionAttributeValues: {
                  ':id': id,
                  ':resourceType': DashboardConstants.DASHBOARD_DEFINITION_RESOURCE_TYPE,
                  ':definition': definition,
                  ':lastUpdateDate': lastUpdateDate,
                },
                ExpressionAttributeNames: {
                  '#definition': 'definition',
                },
                ConditionExpression: '(id = :id) and (resourceType = :resourceType)'
              }
            },
            {
              Update: {
                TableName: this.tableName,
                Key: {
                  id,
                  resourceType: DashboardConstants.DASHBOARD_DATA_RESOURCE_TYPE,
                },
                // Capture the DDB reserved words, see https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ReservedWords.html
                UpdateExpression: 'set #name = :name, #description = :description, lastUpdateDate = :lastUpdateDate',
                ExpressionAttributeValues: {
                  ':id': id,
                  ':resourceType': DashboardConstants.DASHBOARD_DATA_RESOURCE_TYPE,
                  ':name': name,
                  ':description': description,
                  ':lastUpdateDate': lastUpdateDate,
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
    );

    return {
      id,
      name,
      definition,
      description,
      creationDate: creationDateObj,
      lastUpdateDate: creationDateObj,
    };
  }

  async delete({ id }: DashboardDeleteInput): Promise<DashboardDeleteOutput> {
    await this.dbDocClient.send(
      new TransactWriteCommand(
        {
          TransactItems: [
            {
              Delete: {
                TableName: this.tableName,
                Key: {
                  id,
                  resourceType: DashboardConstants.DASHBOARD_DATA_RESOURCE_TYPE,
                },
              },
            },
            {
              Delete: {
                TableName: this.tableName,
                Key: {
                  id,
                  resourceType: DashboardConstants.DASHBOARD_DEFINITION_RESOURCE_TYPE,
                },
              },
            },
          ],
        }
      )
    )
  }

  async listSummaries({ nextToken }: DashboardListSummariesInput = {}): Promise<DashboardListSummariesOutput> {
    const { Items, LastEvaluatedKey } = await this.dbDocClient.send(
      new QueryCommand(
        {
          TableName: this.tableName,
          Limit: 100,
          KeyConditionExpression: 'resourceType = :resourceType',
          ExpressionAttributeValues: {
            ':resourceType': DashboardConstants.DASHBOARD_DATA_RESOURCE_TYPE,
          },
          IndexName: DashboardConstants.RESOURCE_TYPE_GSI,
          ExclusiveStartKey: nextToken,
        }
      )
    );

    const summaries = Items.map(
      ({id, name, description, creationDate, lastUpdateDate}) => ({id, name, description, creationDate, lastUpdateDate})
    );

    return {
      summaries,
      nextToken: LastEvaluatedKey,
    }
  }
}
