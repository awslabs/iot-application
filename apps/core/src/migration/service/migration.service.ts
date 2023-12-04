import { Injectable, Inject } from '@nestjs/common';
import { MigrationStatus, Status } from '../entities/migration-status.entity';
import { DashboardsService } from '../../dashboards/dashboards.service';
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
import {
  convertMonitorToAppDefinition,
  applicationDashboardDescription,
} from './convert-monitor-to-app-definition';
import { SiteWiseMonitorDashboardDefinition } from './monitor-dashboard-definition';
import { Result, err, ok, isOk, isErr } from '../../types';

@Injectable()
export class MigrationService {
  @Inject(DashboardsService)
  private readonly dashboardsService: DashboardsService;

  private migrationStatus: MigrationStatus = {
    status: Status.NOT_STARTED,
  };

  private parsingErrors: Error[] = [];

  private sitewise = new IoTSiteWiseClient({
    region: this.getRegion(),
  });

  private getRegion() {
    return process.env.AWS_REGION;
  }

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

  private parseDashboardDefinition(
    monitorDashboardDefinition?: string,
    dashboardName?: string,
  ): SiteWiseMonitorDashboardDefinition {
    if (monitorDashboardDefinition) {
      try {
        return JSON.parse(
          monitorDashboardDefinition,
        ) as SiteWiseMonitorDashboardDefinition;
      } catch (error) {
        // Catch any parsing errors so we can return them at the end
        this.parsingErrors.push(new Error(dashboardName));
      }
    }
    return { widgets: [] };
  }

  private convertSWMToApplicationDashboards(
    siteWiseMonitorDashboards: DescribeDashboardCommandOutput[],
  ): CreateDashboardDto[] {
    return siteWiseMonitorDashboards.map((dashboard) => ({
      name: dashboard.dashboardName
        ? dashboard.dashboardName
        : 'SiteWise Monitor Migrated Dashboard',
      description: applicationDashboardDescription, // Monitor has no dashboard description
      definition: convertMonitorToAppDefinition(
        this.parseDashboardDefinition(
          dashboard.dashboardDefinition,
          dashboard.dashboardName,
        ),
      ),
      sitewiseMonitorId: dashboard.dashboardId,
    }));
  }

  private async createApplicationDashboards(
    siteWiseMonitorDashboards: CreateDashboardDto[],
  ) {
    const existingDashboardsResult = await this.dashboardsService.list();

    if (isErr(existingDashboardsResult)) {
      throw existingDashboardsResult.err;
    }

    const listDashboards = existingDashboardsResult.ok.map(
      (dashboard) => dashboard.sitewiseMonitorId,
    );

    for (const dashboard of siteWiseMonitorDashboards) {
      // Only create dashboards that haven't already been migrated
      if (!listDashboards.includes(dashboard.sitewiseMonitorId)) {
        const result = await this.dashboardsService.create(dashboard);
        if (isErr(result)) {
          throw result.err;
        }
      }
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

        if (this.parsingErrors.length !== 0) {
          const messages = this.parsingErrors.map((error) => error.message);
          const errorMessage = `error parsing dashboard definitions for SiteWise Monitor dashboard(s): ${messages.join()}`;

          // Reset errors for next time migration is called
          this.parsingErrors = [];

          return err(new Error(errorMessage));
        }

        return ok(undefined);
      } else {
        // No SWM dashboards to convert
        return ok(undefined);
      }
    } catch (error) {
      // Error during the processing
      return error instanceof Error ? err(error) : err(new Error());
    }
  }

  public async migrate() {
    if (
      this.migrationStatus.status === Status.NOT_STARTED ||
      this.migrationStatus.status === Status.COMPLETE
    ) {
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
    }
  }

  public getMigrationStatus(): MigrationStatus {
    // When migration is settled (COMPLETE or ERROR), set it back to NOT_STARTED state
    if (
      this.migrationStatus.status === Status.COMPLETE ||
      this.migrationStatus.status === Status.ERROR
    ) {
      const oldStatus = this.migrationStatus;
      this.migrationStatus = { status: Status.NOT_STARTED };
      return oldStatus;
    }
    return this.migrationStatus;
  }
}
