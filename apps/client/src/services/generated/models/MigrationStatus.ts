/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export enum Status {
  NOT_STARTED = 'not-started',
  IN_PROGRESS = 'in-progress',
  COMPLETE = 'complete',
  COMPLETE_NONE_CREATED = 'complete-none-created',
  ERROR = 'error'
}
  
export type MigrationStatus = {
  status: Status;
  message?: string;
}
