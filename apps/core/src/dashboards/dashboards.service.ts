import { Injectable } from '@nestjs/common';

import { DashboardsRepository } from './dashboards.repository';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { Dashboard } from './entities/dashboard.entity';

@Injectable()
export class DashboardsService {
  constructor(private readonly repository: DashboardsRepository) {}

  public async read(id: Dashboard['id']) {
    return this.repository.find(id);
  }

  public async list() {
    return this.repository.findAll();
  }

  public async create(createDashboardDto: CreateDashboardDto) {
    return this.repository.create(createDashboardDto);
  }

  public async update(
    dashboard: Pick<Dashboard, 'id'> &
      Partial<Pick<Dashboard, 'name' | 'description' | 'definition'>>,
  ) {
    return this.repository.update(dashboard);
  }

  public async delete(id: Dashboard['id']) {
    return this.repository.delete(id);
  }

  public async bulkDelete(ids: Dashboard['id'][]) {
    // TODO: use BatchWriteItem instead of Promise.all
    return Promise.all(ids.map((id) => this.repository.delete(id)));
  }
}
