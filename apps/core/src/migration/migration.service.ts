import { Injectable } from '@nestjs/common';
import { MigrationStatus, Status } from './entities/migration-status.entity';

const delay = (ms: number) => {
  return new Promise((res) => setTimeout(res, ms));
};

@Injectable()
export class MigrationService {
  private migrationStatus: MigrationStatus = {
    status: Status.NOT_STARTED,
  };

  private getSiteWiseMonitorInformation() {
    // ListPortals
    // ListProjects
    // ListDashboards
    // DescribeDashboard
  }

  private convertDashboardDefinitions() {
    // Determine mapping between definitions
  }

  private createApplicationDashboards() {
    // For each dashboards call Application CreateDashboard
  }

  private async process() {
    // Simulate a time delay and status updated until we implement the actual migration
    // TODO: Remove this code
    await delay(5000);
    this.migrationStatus = {
      status: Status.ERROR,
      message: 'There was an error',
    };
    await delay(5000);
    this.migrationStatus = { status: Status.IN_PROGRESS };
    await delay(5000);
    this.migrationStatus = { status: Status.COMPLETE };

    // TODO: add functionality
    this.getSiteWiseMonitorInformation();
    this.convertDashboardDefinitions();
    this.createApplicationDashboards();
  }

  // Purposely don't use async/await so we can return the inital status first
  public migrate() {
    if (
      this.migrationStatus.status === Status.NOT_STARTED ||
      this.migrationStatus.status === Status.COMPLETE
    ) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.process();
      this.migrationStatus = { status: Status.IN_PROGRESS };
    }
  }

  public getMigrationStatus(): MigrationStatus {
    return this.migrationStatus;
  }
}
