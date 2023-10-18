import {
  BatchStatementErrorCodeEnum,
  DynamoDBClient,
  QueryCommandOutput,
  TransactionCanceledException,
} from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  QueryCommand,
  TransactWriteCommand,
} from '@aws-sdk/lib-dynamodb';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { plainToClass } from 'class-transformer';
import { nanoid } from 'nanoid';

import { DATABASE_GSI, MESSAGES, RESOURCE_TYPES } from './dashboard.constants';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { Dashboard } from './entities/dashboard.entity';
import { DashboardSummary } from './entities/dashboard-summary.entity';
import { databaseConfig } from '../config/database.config';
import { Result, isNothing, err, Maybe, ok } from '../types';

function isTransactionCanceledException(
  error: unknown,
): error is TransactionCanceledException {
  return (
    error instanceof Error && error instanceof TransactionCanceledException
  );
}

@Injectable()
export class DashboardsRepository {
  private readonly logger = new Logger(DashboardsRepository.name);
  private readonly dbDocClient: DynamoDBDocumentClient;
  private readonly tableName: string;

  constructor(
    @Inject(databaseConfig.KEY) dbConfig: ConfigType<typeof databaseConfig>,
  ) {
    this.dbDocClient = DynamoDBDocumentClient.from(
      new DynamoDBClient({
        endpoint: dbConfig.endpoint,
      }),
      {
        marshallOptions: {
          convertClassInstanceToMap: true,
          removeUndefinedValues: true,
        },
      },
    );

    this.tableName = dbConfig.tableName;
  }

  public async find(
    id: Dashboard['id'],
  ): Promise<Result<Error, Maybe<Dashboard>>> {
    try {
      const dashboardDataRequest = this.dbDocClient.send(
        new GetCommand({
          Key: {
            id,
            resourceType: RESOURCE_TYPES.DASHBOARD_DATA,
          },
          TableName: this.tableName,
        }),
      );
      const dashboardDefinitionDataRequest = this.dbDocClient.send(
        new GetCommand({
          Key: {
            id,
            resourceType: RESOURCE_TYPES.DASHBOARD_DEFINITION,
          },
          TableName: this.tableName,
        }),
      );

      const dashboardResponses = await Promise.all([
        dashboardDataRequest,
        dashboardDefinitionDataRequest,
      ]);

      const dashboardData = dashboardResponses[0].Item as Maybe<Dashboard>;
      const dashboardDefinitionData = dashboardResponses[1].Item as Maybe<
        Pick<Dashboard, 'definition'>
      >;

      // dashboard is not found
      if (isNothing(dashboardData) && isNothing(dashboardDefinitionData)) {
        return ok(undefined);
      }

      // only partial data is found
      if (isNothing(dashboardData) || isNothing(dashboardDefinitionData)) {
        return err(new Error(MESSAGES.ITEM_NOT_FOUND_ERROR));
      }

      // deserialize dashboard
      const dashboard = plainToClass(Dashboard, {
        id: dashboardData.id,
        description: dashboardData.description,
        name: dashboardData.name,
        definition: dashboardDefinitionData.definition,
        lastUpdateDate: dashboardData.lastUpdateDate,
        creationDate: dashboardData.creationDate,
      });

      return ok(dashboard);
    } catch (error) {
      return error instanceof Error
        ? err(error)
        : err(new Error(MESSAGES.UNKNOWN_ERROR));
    }
  }

  public async findAll(): Promise<Result<Error, DashboardSummary[]>> {
    try {
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
              const lastUpdateDate = item.lastUpdateDate;
              const creationDate = item.creationDate;

              return plainToClass(DashboardSummary, {
                id,
                name,
                description,
                lastUpdateDate,
                creationDate,
              });
            }),
          );
        }

        this.logger.log(
          `lastEvaluatedKey ${JSON.stringify(lastEvaluatedKey, null, 2)}`,
        );
      } while (lastEvaluatedKey);

      return ok(dashboards);
    } catch (error) {
      return error instanceof Error
        ? err(error)
        : err(new Error(MESSAGES.UNKNOWN_ERROR));
    }
  }

  public async create({
    name,
    definition,
    description,
  }: CreateDashboardDto): Promise<Result<Error, Dashboard>> {
    try {
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

      return ok({
        name,
        definition,
        description,
        id,
        lastUpdateDate,
        creationDate,
      });
    } catch (error) {
      return error instanceof Error
        ? err(error)
        : err(new Error(MESSAGES.UNKNOWN_ERROR));
    }
  }

  public async update({
    id,
    name,
    description,
    definition,
  }: Pick<Dashboard, 'id'> &
    Partial<Pick<Dashboard, 'name' | 'description' | 'definition'>>): Promise<
    Result<Error, Maybe<Dashboard>>
  > {
    const creationDateObj = new Date();
    const creationDate = creationDateObj.toISOString();
    const lastUpdateDate = creationDate;

    const fields = [
      { field: 'name', value: name },
      { field: 'description', value: description },
    ].filter((f) => f.value != null);

    const definitionTransaction = {
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
        ConditionExpression: '(id = :id) and (resourceType = :resourceType)',
      },
    };

    const dashboardDataTransaction = {
      Update: {
        TableName: this.tableName,
        Key: {
          id,
          resourceType: RESOURCE_TYPES.DASHBOARD_DATA,
        },
        // Capture the DDB reserved words, see https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ReservedWords.html
        UpdateExpression: `set ${fields
          .map((f) => `#${f.field} = :${f.field}, `)
          .join('')} lastUpdateDate = :lastUpdateDate`,
        ExpressionAttributeValues: {
          ':id': id,
          ':resourceType': RESOURCE_TYPES.DASHBOARD_DATA,
          ':name': name,
          ':description': description,
          ':lastUpdateDate': lastUpdateDate,
        },
        ExpressionAttributeNames:
          name || description
            ? Object.fromEntries(fields.map((f) => [`#${f.field}`, f.field]))
            : undefined,
        ConditionExpression: '(id = :id) and (resourceType = :resourceType)',
      },
    };

    const transactItems = [];

    // only update definition if it is defined
    if (definition) {
      transactItems.push(definitionTransaction);
    }

    // always update lastUpdateDate
    transactItems.push(dashboardDataTransaction);

    try {
      await this.dbDocClient.send(
        new TransactWriteCommand({
          TransactItems: transactItems,
        }),
      );

      // return updated dashboard
      return this.find(id);
    } catch (error) {
      if (isTransactionCanceledException(error)) {
        if (this.conditionalCheckFailed(error)) {
          return ok(undefined);
        }
      }

      return error instanceof Error
        ? err(error)
        : err(new Error(MESSAGES.UNKNOWN_ERROR));
    }
  }

  public async delete(
    id: Dashboard['id'],
  ): Promise<Result<Error, Maybe<string>>> {
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

      return ok(id);
    } catch (error) {
      if (isTransactionCanceledException(error)) {
        if (this.conditionalCheckFailed(error)) {
          return ok(undefined);
        }
      }

      return error instanceof Error
        ? err(error)
        : err(new Error(MESSAGES.UNKNOWN_ERROR));
    }
  }

  private conditionalCheckFailed(error: TransactionCanceledException) {
    return error.CancellationReasons
      ? error.CancellationReasons.some((reason) => {
          return (
            reason.Code === BatchStatementErrorCodeEnum.ConditionalCheckFailed
          );
        })
      : false;
  }
}
