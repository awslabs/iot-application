import {
  IsOptional,
  IsString,
  IsDate,
  Validate,
  ValidatorConstraint,
} from 'class-validator';
import type { ValidatorConstraintInterface } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

@ValidatorConstraint({ name: 'string-or-number', async: false })
export class IsNumberOrString implements ValidatorConstraintInterface {
  validate(input: unknown) {
    return typeof input === 'number' || typeof input === 'string';
  }

  defaultMessage() {
    return '($value) must be number or string';
  }
}

export class ViewportBase {
  @IsString()
  @IsOptional()
  public readonly group?: string;
}

export class DurationViewport extends ViewportBase {
  @ApiProperty({
    oneOf: [{ type: 'number' }, { type: 'string' }],
  })
  @Validate(IsNumberOrString)
  public readonly duration: number | string;
}

export class HistoricalViewport extends ViewportBase {
  @IsDate()
  @ApiProperty()
  @Type(() => Date)
  public readonly start: Date;

  @IsDate()
  @ApiProperty()
  @Type(() => Date)
  public readonly end: Date;
}
