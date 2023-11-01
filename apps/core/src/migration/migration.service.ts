import { Injectable, Inject } from '@nestjs/common';
import { MigrationStatus, Status } from './entities/migration-status.entity';
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

@Injectable()
export class MigrationService {
  @Inject(DashboardsService)
  private readonly dashboardsService: DashboardsService;

  private migrationStatus: MigrationStatus = {
    status: Status.NOT_STARTED,
  };

  private sitewise = new IoTSiteWiseClient({
    credentials: {
      accessKeyId: this.getAccessKey(),
      secretAccessKey: this.getSecretKey(),
    },
    region: this.getRegion(),
  });

  private getRegion() {
    return process.env.AWS_REGION;
  }

  private getAccessKey() {
    if (process.env.AWS_ACCESS_KEY_ID) {
      return process.env.AWS_ACCESS_KEY_ID;
    }
    return '';
  }

  private getSecretKey() {
    if (process.env.AWS_SECRET_ACCESS_KEY) {
      return process.env.AWS_SECRET_ACCESS_KEY;
    }
    return '';
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

  private async getSiteWiseMonitorInformation(): Promise<
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

  // TODO: finish functionality
  private async process() {
    this.migrationStatus = { status: Status.IN_PROGRESS };

    const dashboards: DescribeDashboardCommandOutput[] =
      await this.getSiteWiseMonitorInformation();

    if (dashboards.length) {
      const convertedDashboards =
        this.convertSWMToApplicationDashboards(dashboards);
      await this.createApplicationDashboards(convertedDashboards);
      this.migrationStatus = { status: Status.COMPLETE };
    } else {
      // No SWM dashboards to convert
      this.migrationStatus = { status: Status.COMPLETE };
    }
  }

  // Purposely don't use async/await so we can return the inital status first
  public migrate() {
    if (
      this.migrationStatus.status === Status.NOT_STARTED ||
      this.migrationStatus.status === Status.COMPLETE
    ) {
      try {
        void this.process();
      } catch (error) {
        this.migrationStatus = {
          status: Status.ERROR,
          message: 'error processing the dashboard migration',
        };
      }
    }
  }

  public getMigrationStatus(): MigrationStatus {
    // When migration is complete, set it back to NOT_STARTED state
    if (this.migrationStatus.status === Status.COMPLETE) {
      const oldStatus = this.migrationStatus;
      this.migrationStatus = { status: Status.NOT_STARTED };
      return oldStatus;
    }
    return this.migrationStatus;
  }
}
