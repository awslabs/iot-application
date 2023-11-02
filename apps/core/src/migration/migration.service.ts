import { Injectable } from '@nestjs/common';
import { MigrationStatus, Status } from './entities/migration-status.entity';
<<<<<<< Updated upstream

const delay = (ms: number) => {
  return new Promise((res) => setTimeout(res, ms));
};
=======
import { DashboardsService } from '../dashboards/dashboards.service';
import {
  IoTSiteWiseClient,
  ListPortalsCommand,
  ListProjectsCommand,
  ListDashboardsCommand,
  DescribeDashboardCommand,
  DescribeDashboardCommandOutput,
  PortalSummary,
  ProjectSummary,
  DashboardSummary,
} from '@aws-sdk/client-iotsitewise';
import { CreateDashboardDto } from 'src/dashboards/dto/create-dashboard.dto';
import { convertSiteWiseMonitorToApplicationDefinition } from './util/convertSiteWiseMonitorToApplicationDefinition';
import { Result, err, ok, isOk, isErr } from '../types';
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
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
=======
  private async getPortals(): Promise<PortalSummary[]> {
    const portals: PortalSummary[] = [];

    let response = await this.sitewise.send(new ListPortalsCommand({}));

    if (response.portalSummaries) {
      portals.push(...response.portalSummaries);

      while (response.nextToken) {
        response = await this.sitewise.send(
          new ListPortalsCommand({ nextToken: response.nextToken }),
        );

        if (response.portalSummaries) {
          portals.push(...response.portalSummaries);
        }
      }
    }

    return portals;
  }

  private async getProjects(
    portals: PortalSummary[],
  ): Promise<ProjectSummary[]> {
    const projects: ProjectSummary[] = [];

    for (const { id } of portals) {
      let response = await this.sitewise.send(
        new ListProjectsCommand({ portalId: id }),
      );
      if (response.projectSummaries) {
        projects.push(...response.projectSummaries);

        while (response.nextToken) {
          response = await this.sitewise.send(
            new ListProjectsCommand({
              portalId: id,
              nextToken: response.nextToken,
            }),
          );

          if (response.projectSummaries) {
            projects.push(...response.projectSummaries);
          }
        }
      }
    }

    return projects;
  }

  private async getDashboards(
    projects: ProjectSummary[],
  ): Promise<DashboardSummary[]> {
    const dashboards: DashboardSummary[] = [];

    for (const { id } of projects) {
      let response = await this.sitewise.send(
        new ListDashboardsCommand({ projectId: id }),
      );

      if (response.dashboardSummaries) {
        dashboards.push(...response.dashboardSummaries);

        while (response.nextToken) {
          response = await this.sitewise.send(
            new ListDashboardsCommand({
              projectId: id,
              nextToken: response.nextToken,
            }),
          );

          if (response.dashboardSummaries) {
            dashboards.push(...response.dashboardSummaries);
          }
        }
      }
    }

    return dashboards;
  }

  private async getDescribedDashboards(
    dashboards: DashboardSummary[],
  ): Promise<DescribeDashboardCommandOutput[]> {
    const describedDashboards: DescribeDashboardCommandOutput[] = [];

    for (const { id } of dashboards) {
      const dashboard = await this.sitewise.send(
        new DescribeDashboardCommand({ dashboardId: id }),
      );
      describedDashboards.push(dashboard);
    }

    return describedDashboards;
  }

  private async getSiteWiseMonitorDashboards(): Promise<
    DescribeDashboardCommandOutput[]
  > {
    const portals = await this.getPortals();
    const projects = await this.getProjects(portals);
    const dashboards = await this.getDashboards(projects);
    return await this.getDescribedDashboards(dashboards);
  }

  private convertSWMToApplicationDashboards(
    siteWiseMonitorDashboards: DescribeDashboardCommandOutput[],
  ): CreateDashboardDto[] {
    return siteWiseMonitorDashboards.map((dashboard) => ({
      name: dashboard.dashboardName
        ? dashboard.dashboardName
        : 'SiteWise Monitor Migrated Dashboard',
      description: dashboard.dashboardDescription
        ? dashboard.dashboardDescription
        : '',
      definition: convertSiteWiseMonitorToApplicationDefinition(
        dashboard.dashboardDefinition,
      ),
    }));
  }

  private async createApplicationDashboards(
    siteWiseMonitorDashboards: CreateDashboardDto[],
  ) {
    for (const dashboard of siteWiseMonitorDashboards) {
      await this.dashboardsService.create(dashboard);
    }
  }

  private async process(): Promise<Result<Error, undefined>> {
    try {
      // Get SiteWise Monitor dashboards
      const dashboards: DescribeDashboardCommandOutput[] =
        await this.getSiteWiseMonitorDashboards();

      if (dashboards.length) {
        // Convert dashbaord definitions to IoT Application format
        const convertedDashboards =
          this.convertSWMToApplicationDashboards(dashboards);

        // Create IoT Application dashboards
        await this.createApplicationDashboards(convertedDashboards);
        return ok(undefined);
      } else {
        // No SWM dashboards to convert
        return ok(undefined);
      }
    } catch (error) {
      // Error during the processing
      return error instanceof Error ? err(error) : err(new Error());
    }
>>>>>>> Stashed changes
  }

  public async migrate() {
    if (
      this.migrationStatus.status === Status.NOT_STARTED ||
      this.migrationStatus.status === Status.COMPLETE
    ) {
<<<<<<< Updated upstream
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.process();
      this.migrationStatus = { status: Status.IN_PROGRESS };
=======
      this.migrationStatus = { status: Status.IN_PROGRESS };

      const result = await this.process();

      if (isOk(result)) {
        this.migrationStatus = { status: Status.COMPLETE };
      }

      if (isErr(result)) {
        let errorMessage = 'Error processing the dashboard migration';

        if (result.err instanceof Error && result.err.message) {
          errorMessage = result.err.message;
        }

        this.migrationStatus = {
          status: Status.ERROR,
          message: errorMessage,
        };
      }
>>>>>>> Stashed changes
    }
  }

  public getMigrationStatus(): MigrationStatus {
    return this.migrationStatus;
  }
}
