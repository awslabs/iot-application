import { Type } from 'class-transformer';
import { IsObject, IsString, Length, ValidateNested } from 'class-validator';

import { DashboardDefinition } from './dashboard-definition.entity';

export type DashboardId = string;
export type DashboardName = string;

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
  @Length(1, 100)
  public readonly name: DashboardName;

  @IsObject()
  @ValidateNested()
  @Type(() => DashboardDefinition)
  public readonly definition: DashboardDefinition;
}
