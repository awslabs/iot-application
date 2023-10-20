import { Type } from 'class-transformer';
import {
  IsDateString,
  IsObject,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';

import { DashboardDefinition } from './dashboard-definition.entity';
import {
  DASHBOARD_NAME_MAX_LENGTH,
  DASHBOARD_DESCRIPTION_MAX_LENGTH,
} from '../dashboard.constants';

export type DashboardId = string;
export type DashboardName = string;
export type DashboardDescription = string;

export class Dashboard {
  /**
   * @example "zckYx-InI8_f"
   */
  @IsString()
  @Length(12, 12)
  public readonly id: DashboardId;

  /**
   * @example "Wind Farm 4"
   */
  @IsString()
  @Length(1, DASHBOARD_NAME_MAX_LENGTH)
  public readonly name: DashboardName;

  /**
   * @example "Wind Farm 4 Description"
   */
  @IsString()
  @Length(1, DASHBOARD_DESCRIPTION_MAX_LENGTH)
  public readonly description: DashboardDescription;

  @IsObject()
  @ValidateNested()
  @Type(() => DashboardDefinition)
  public readonly definition: DashboardDefinition;

  @IsDateString()
  public readonly creationDate: string;

  @IsDateString()
  public readonly lastUpdateDate: string;

  // TODO: Add SWM DashboardId
}
