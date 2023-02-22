import {
  BatchStatementErrorCodeEnum,
  DynamoDBClient,
  QueryCommandOutput,
  TransactionCanceledException,
} from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  QueryCommand,
  TransactGetCommand,
  TransactWriteCommand,
} from '@aws-sdk/lib-dynamodb';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { CreateDashboardDto, Dashboard, DashboardSummary } from 'core-types';
import { plainToClass } from 'class-transformer';
import { nanoid } from 'nanoid';

import { DATABASE_GSI, MESSAGES, RESOURCE_TYPES } from './dashboard.constants';
import { databaseConfig } from '../config/database.config';

@Injectable()
export class DashboardsService {
  private readonly logger = new Logger(DashboardsService.name);
  private dbDocClient: DynamoDBDocumentClient;
  private tableName: string;

  constructor(
    @Inject(databaseConfig.KEY) dbConfig: ConfigType<typeof databaseConfig>,
  ) {
    this.dbDocClient = DynamoDBDocumentClient.from(
      new DynamoDBClient({
        endpoint: dbConfig.endpoint,
        region: dbConfig.region,
      }),
      {
        marshallOptions: {
          convertClassInstanceToMap: true,
        },
      },
    );

    this.tableName = dbConfig.tableName;
  }

  public async create(createDashboardDto: CreateDashboardDto) {
    this.logger.log('Creating dashboard...');

    try {
      const dashboard = await this.createDashboard(createDashboardDto);

      this.logger.log(`Created dashboard ${dashboard.id}`);
      this.logger.log(dashboard);

      return dashboard;
    } catch (error) {
      this.logger.warn('Failed to create dashboard');
      this.logger.warn(error);

      throw error;
    }
  }

  public async list(): Promise<DashboardSummary[]> {
    this.logger.log('Finding all dashboards...');

    try {
      const dashboards = await this.listDashboards();
      this.logger.log('Found all dashboards');
      this.logger.log(dashboards);

      return dashboards;
    } catch (error) {
      this.logger.warn('Failed to find all dashboards');
      this.logger.warn(error);

      throw error;
    }
  }

  public async read(id: Dashboard['id']): Promise<Dashboard | undefined> {
    this.logger.log(`Finding dashboard ${id}...`);

    try {
      const dashboard = await this.find(id);

      if (dashboard === undefined) {
        this.logger.warn(`Not found dashboard ${id}`);
      } else {
        this.logger.log(`Found dashboard ${id}`);
        this.logger.log(dashboard);
      }

      return dashboard;
    } catch (error) {
      this.logger.warn(`Failed to find dashboard ${id}`);
      this.logger.warn(error);

      throw error;
    }
  }

  public async update(dashboard: Dashboard) {
    this.logger.log(`Updating dashboard ${dashboard.id}...`);

    try {
      const updatedDashboard = await this.updateDashboard(dashboard);
      const { id } = dashboard;

      if (updatedDashboard !== undefined) {
        this.logger.log(`Updated dashboard ${id}`);
        this.logger.log(updatedDashboard);
      } else {
        this.logger.warn(`Update failure, not found dashboard ${id}`);
      }

      return updatedDashboard;
    } catch (error) {
      this.logger.warn(`Failed to update dashboard ${dashboard.id}`);
      this.logger.warn(error);

      throw error;
    }
  }

  public async delete(id: Dashboard['id']): Promise<boolean> {
    this.logger.log(`Deleting dashboard ${id}...`);

    try {
      const deleted = await this.deleteDashboard(id);

      if (deleted) {
        this.logger.log(`Deleted dashboard ${id}`);
      } else {
        this.logger.warn(`Deletion failure, not found dashboard ${id}`);
      }

      return deleted;
    } catch (error) {
      this.logger.warn(`Failed to delete dashboard ${id}`);
      this.logger.warn(error);

      throw error;
    }
  }

  private async createDashboard({
    name,
    definition,
    description,
  }: CreateDashboardDto): Promise<Dashboard> {
    const id = nanoid(12);
    const creationDateObj = new Date();
    const creationDate = creationDateObj.toISOString();
    const lastUpdateDate = creationDate;

    await this.dbDocClient.send(
      new TransactWriteCommand({
        TransactItems: [
          {
            Put: {
              TableName: this.tableName,
              Item: {
                id,
                resourceType: RESOURCE_TYPES.DASHBOARD_DEFINITION,
                definition,
              },
              ConditionExpression: 'attribute_not_exists(id)',
            },
          },
          {
            Put: {
              TableName: this.tableName,
              Item: {
                id,
                resourceType: RESOURCE_TYPES.DASHBOARD_DATA,
                name,
                description,
                creationDate,
                lastUpdateDate,
              },
              ConditionExpression: 'attribute_not_exists(id)',
            },
          },
        ],
      }),
    );

    return {
      name,
      definition,
      description,
      id,
    };
  }

  private async updateDashboard({
    id,
    name,
    description,
    definition,
  }: Dashboard) {
    const creationDateObj = new Date();
    const creationDate = creationDateObj.toISOString();
    const lastUpdateDate = creationDate;

    try {
      await this.dbDocClient.send(
        new TransactWriteCommand({
          TransactItems: [
            {
              Update: {
                TableName: this.tableName,
                Key: {
                  id,
                  resourceType: RESOURCE_TYPES.DASHBOARD_DEFINITION,
                },
                // Capture the DDB reserved words, see https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ReservedWords.html
                UpdateExpression: 'set #definition = :definition',
                ExpressionAttributeValues: {
                  ':id': id,
                  ':resourceType': RESOURCE_TYPES.DASHBOARD_DEFINITION,
                  ':definition': definition,
                },
                ExpressionAttributeNames: {
                  '#definition': 'definition',
                },
                ConditionExpression:
                  '(id = :id) and (resourceType = :resourceType)',
              },
            },
            {
              Update: {
                TableName: this.tableName,
                Key: {
                  id,
                  resourceType: RESOURCE_TYPES.DASHBOARD_DATA,
                },
                // Capture the DDB reserved words, see https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ReservedWords.html
                UpdateExpression:
                  'set #name = :name, #description = :description, lastUpdateDate = :lastUpdateDate',
                ExpressionAttributeValues: {
                  ':id': id,
                  ':resourceType': RESOURCE_TYPES.DASHBOARD_DATA,
                  ':name': name,
                  ':description': description,
                  ':lastUpdateDate': lastUpdateDate,
                },
                ExpressionAttributeNames: {
                  '#name': 'name',
                  '#description': 'description',
                },
                ConditionExpression:
                  '(id = :id) and (resourceType = :resourceType)',
              },
            },
          ],
        }),
      );
    } catch (error) {
      if (error instanceof TransactionCanceledException) {
        if (this.conditionalCheckFailed(error)) {
          return undefined;
        }
      }

      throw error;
    }

    return {
      id,
      name,
      definition,
      description,
    };
  }

  /**
   * Delete a dashboard from the database.
   * @param id the id of the dashboard
   * @returns true if the given dashboard is deleted; false if the dashboard id is not found.
   */
  private async deleteDashboard(id: Dashboard['id']): Promise<boolean> {
    try {
      await this.dbDocClient.send(
        new TransactWriteCommand({
          TransactItems: [
            {
              Delete: {
                TableName: this.tableName,
                Key: {
                  id,
                  resourceType: RESOURCE_TYPES.DASHBOARD_DATA,
                },
                ExpressionAttributeValues: {
                  ':id': id,
                  ':resourceType': RESOURCE_TYPES.DASHBOARD_DATA,
                },
                ConditionExpression:
                  '(id = :id) and (resourceType = :resourceType)',
              },
            },
            {
              Delete: {
                TableName: this.tableName,
                Key: {
                  id,
                  resourceType: RESOURCE_TYPES.DASHBOARD_DEFINITION,
                },
                ExpressionAttributeValues: {
                  ':id': id,
                  ':resourceType': RESOURCE_TYPES.DASHBOARD_DEFINITION,
                },
                ConditionExpression:
                  '(id = :id) and (resourceType = :resourceType)',
              },
            },
          ],
        }),
      );

      return true;
    } catch (error) {
      if (error instanceof TransactionCanceledException) {
        if (this.conditionalCheckFailed(error)) {
          return false;
        }
      }

      throw error;
    }
  }

  private async find(id: Dashboard['id']): Promise<Dashboard | undefined> {
    const { Responses } = await this.dbDocClient.send(
      new TransactGetCommand({
        TransactItems: [
          {
            Get: {
              TableName: this.tableName,
              Key: {
                id,
                resourceType: RESOURCE_TYPES.DASHBOARD_DATA,
              },
            },
          },
          {
            Get: {
              TableName: this.tableName,
              Key: { id, resourceType: RESOURCE_TYPES.DASHBOARD_DEFINITION },
            },
          },
        ],
      }),
    );

    if (Responses === undefined) {
      return undefined;
    }

    const dashboardData = Responses[0]?.Item;
    const dashboardDefinition = Responses[1]?.Item;

    if (dashboardData === undefined && dashboardDefinition === undefined) {
      return undefined;
    }

    if (dashboardData === undefined || dashboardDefinition === undefined) {
      this.logger.error(
        `${dashboardData ? 'dashboard definition' : 'dashboard data'} missing`,
      );
      throw new Error(MESSAGES.ITEM_NOT_FOUND_ERROR);
    }

    return plainToClass(Dashboard, {
      id,
      description: dashboardData.description as string,
      name: dashboardData.name as string,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      definition: dashboardDefinition.definition,
    });
  }

  private async listDashboards(): Promise<DashboardSummary[]> {
    let dashboards: DashboardSummary[] = [];
    let lastEvaluatedKey: Record<string, unknown> | undefined;

    do {
      const queryOutput: QueryCommandOutput = await this.dbDocClient.send(
        new QueryCommand({
          TableName: this.tableName,
          KeyConditionExpression: 'resourceType = :resourceType',
          ExpressionAttributeValues: {
            ':resourceType': RESOURCE_TYPES.DASHBOARD_DATA,
          },
          IndexName: DATABASE_GSI.RESOURCE_TYPE,
          ...(lastEvaluatedKey === undefined
            ? {}
            : {
                ExclusiveStartKey: lastEvaluatedKey,
              }),
        }),
      );

      lastEvaluatedKey = queryOutput.LastEvaluatedKey;

      if (queryOutput.Items) {
        dashboards = dashboards.concat(
          queryOutput.Items.map((item) => {
            const id = item.id;
            const name = item.name;
            const description = item.description;

            return plainToClass(DashboardSummary, {
              id,
              name,
              description,
            });
          }),
        );
      }

      this.logger.log(
        `lastEvaluatedKey ${JSON.stringify(lastEvaluatedKey, null, 2)}`,
      );
    } while (lastEvaluatedKey);

    return dashboards;
  }

  private conditionalCheckFailed(error: TransactionCanceledException): boolean {
    return error.CancellationReasons
      ? error.CancellationReasons.some((reason) => {
          return (
            reason.Code === BatchStatementErrorCodeEnum.ConditionalCheckFailed
          );
        })
      : false;
  }
}
