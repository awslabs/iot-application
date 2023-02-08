import { Injectable, Logger } from '@nestjs/common';
import { nanoid } from 'nanoid';

import { Dashboard } from './entities/dashboard.entity';

@Injectable()
export class DashboardsService {
  private readonly logger = new Logger(DashboardsService.name);
  private dashboards: Dashboard[] = [];

  public create(name: Dashboard['name']) {
    this.logger.log('Creating dashboard...');

    try {
      const dashboard = this.createDashboard(name);

      this.dashboards = [...this.dashboards, dashboard];

      this.logger.log(`Created dashboard ${dashboard.id}`);
      this.logger.log(dashboard);

      return dashboard;
    } catch {
      this.logger.warn('Failed to create dashboard');

      return undefined;
    }
  }

  public list() {
    this.logger.log('Finding all dashboards...');

    try {
      this.logger.log('Found all dashboards');
      this.logger.log(this.dashboards);

      return this.dashboards;
    } catch {
      this.logger.warn('Failed to find all dashboards');

      return undefined;
    }
  }

  public read(id: Dashboard['id']) {
    this.logger.log(`Finding dashboard ${id}...`);

    try {
      const dashboard = this.find(id);

      this.logger.log(`Found dashboard ${id}`);
      this.logger.log(dashboard);

      return this.find(id);
    } catch {
      this.logger.warn(`Failed to find dashboard ${id}`);

      return undefined;
    }
  }

  public update(dashboard: Dashboard) {
    this.logger.log(`Updating dashboard ${dashboard.id}...`);

    try {
      this.dashboards = this.withUpdatedDashboard(dashboard);
      const updatedDashboard = this.find(dashboard.id);

      this.logger.log(`Updated dashboard ${dashboard.id}`);
      this.logger.log(dashboard);

      return updatedDashboard;
    } catch {
      this.logger.warn(`Failed to update dashboard ${dashboard.id}`);

      return undefined;
    }
  }

  public delete(id: Dashboard['id']) {
    this.logger.log(`Deleting dashboard ${id}...`);

    try {
      const dashboard = this.find(id);

      if (dashboard === undefined) {
        throw new Error();
      }

      this.dashboards = this.withoutDashboard(dashboard);

      this.logger.log(`Deleted dashboard ${id}`);

      return dashboard;
    } catch {
      this.logger.warn(`Failed to delete dashboard ${id}`);

      return undefined;
    }
  }

  private createDashboard(name: Dashboard['name']): Dashboard {
    const id = nanoid(12);

    return {
      id,
      name,
      definition: {
        widgets: [],
      },
    };
  }

  private withUpdatedDashboard(dashboard: Dashboard) {
    return this.dashboards.map((d) => (d.id !== dashboard.id ? d : dashboard));
  }

  private withoutDashboard(dashboard: Dashboard) {
    return this.dashboards.filter((d) => d.id !== dashboard.id);
  }

  private find(id: Dashboard['id']) {
    return this.dashboards.find((d) => d.id === id);
  }
}
