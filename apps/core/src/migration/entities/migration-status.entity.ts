import { IsString } from 'class-validator';

export enum Status {
  NOT_STARTED = 'not-started',
  IN_PROGRESS = 'in-progress',
  COMPLETE = 'complete',
  ERROR = 'error',
}

export class MigrationStatus {
  /**
   * @example "in-progress"
   */
  @IsString()
  public readonly status: Status;

  /**
   * @example "error calling API ListPortals: you do not have permission."
   */
  @IsString()
  public readonly message?: string;
}
