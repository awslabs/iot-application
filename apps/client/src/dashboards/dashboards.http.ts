import { Dashboard } from 'core-types';

import { HttpClient } from './interfaces/http.interface';

/** HTTP client for Core `DashboardsModule` */
export class DashboardsHttp {
  private readonly CORE_MODULE_PATH = `http://localhost:3000/dashboards`;

  constructor(private http: HttpClient) {}

  /** List of dashboards in Core */
  public async list(): Promise<Dashboard[] | never> {
    try {
      const response = await this.http.get<Dashboard[]>(this.CORE_MODULE_PATH);

      return response.data;
    } catch (e) {
      throw new Error(`[${DashboardsHttp.name}]: Failed to list dashboards.`, {
        cause: e,
      });
    }
  }

  /** Create a dashboard in Core */
  public async create(
    name: string,
    description: string,
    definition: object,
  ): Promise<Dashboard | never> {
    try {
      const response = await this.http.post<Dashboard>(this.CORE_MODULE_PATH, {
        name,
        description,
        definition,
      });

      return response.data;
    } catch (e) {
      throw new Error(`[${DashboardsHttp.name}]: Failed to create dashboard.`, {
        cause: e,
      });
    }
  }

  /** Read a dashboard from Core */
  public async read(id: string): Promise<Dashboard | never> {
    try {
      const response = await this.http.get<Dashboard>(
        this.createDashboardUri(id),
      );

      return response.data;
    } catch (e) {
      throw new Error(
        `[${DashboardsHttp.name}]: Failed to read dashboard #${id}.`,
        { cause: e },
      );
    }
  }

  /** Update a dashboard in Core */
  public async update(
    id: string,
    name: string,
    description: string,
    definition: object,
  ): Promise<Dashboard | never> {
    try {
      const response = await this.http.put<Dashboard>(
        this.createDashboardUri(id),
        {
          name,
          description,
          definition,
        },
      );

      return response.data;
    } catch (e) {
      throw new Error(
        `[${DashboardsHttp.name}]: Failed to update dashboard #${id}.`,
        { cause: e },
      );
    }
  }

  /** Delete a dashboard in Core */
  public async delete(id: string): Promise<void> {
    try {
      await this.http.delete<Dashboard>(this.createDashboardUri(id));
    } catch (e) {
      throw new Error(
        `[${DashboardsHttp.name}]: Failed to delete dashboard #${id}.`,
        { cause: e },
      );
    }
  }

  private createDashboardUri(id: string) {
    return `${this.CORE_MODULE_PATH}/${id}`;
  }
}
