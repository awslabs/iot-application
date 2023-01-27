import { Type } from "class-transformer";
import {
  ArrayMaxSize,
  IsArray,
  IsObject,
  ValidateNested,
} from "class-validator";

import { DashboardWidget } from "./dashboard-widget.entity";

export class DashboardDefinition {
  @IsArray()
  @ArrayMaxSize(100)
  @ValidateNested({ each: true })
  @IsObject({ each: true })
  @Type(() => DashboardWidget)
  public readonly widgets: DashboardWidget[];
}
