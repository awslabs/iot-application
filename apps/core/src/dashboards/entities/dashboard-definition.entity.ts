import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsObject,
  ValidateNested,
} from 'class-validator';

import { DashboardWidget } from './dashboard-widget.entity';
import {
  DurationViewport,
  HistoricalViewport,
  ViewportBase,
} from './viewport.entity';
import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';

@ApiExtraModels(DurationViewport)
@ApiExtraModels(HistoricalViewport)
export class DashboardDefinition {
  @IsArray()
  @ArrayMaxSize(1000)
  @ValidateNested({ each: true })
  @IsObject({ each: true })
  @Type(() => DashboardWidget)
  public readonly widgets: DashboardWidget[];

  @IsObject()
  @Type(() => ViewportBase, {
    discriminator: {
      property: 'type',
      subTypes: [
        { value: DurationViewport, name: 'durationviewport' },
        { value: HistoricalViewport, name: 'historicalviewport' },
      ],
    },
  })
  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(DurationViewport) },
      { $ref: getSchemaPath(HistoricalViewport) },
    ],
  })
  public readonly viewport: DurationViewport | HistoricalViewport;
}
