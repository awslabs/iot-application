import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { DashboardsService } from './dashboards.service';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';
import { DeleteDashboardParams } from './params/delete-dashboard.params';
import { ReadDashboardParams } from './params/read-dashboard.params';
import { UpdateDashboardParams } from './params/update-dashboard.params';
import { Dashboard } from './entities/dashboard.entity';

import type { Cache } from 'cache-manager';
import { isErr, isNothing } from '../types';

@ApiTags('dashboards')
@Controller('dashboards')
export class DashboardsController {
  constructor(
    private readonly dashboardsService: DashboardsService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  @Get(':id')
  public async read(@Param() params: ReadDashboardParams): Promise<Dashboard> {
    const eitherDashboard = await this.dashboardsService.read(params.id);

    if (isErr(eitherDashboard)) {
      throw eitherDashboard.err;
    }

    if (isNothing(eitherDashboard.ok)) {
      throw new NotFoundException();
    }

    return eitherDashboard.ok;
  }

  @Get()
  public async list() {
    const eitherDashboards = await this.dashboardsService.list();

    if (isErr(eitherDashboards)) {
      throw eitherDashboards.err;
    }

    return eitherDashboards.ok;
  }

  @Post()
  public async create(
    @Body() createDashboardDto: CreateDashboardDto,
  ): Promise<Dashboard> {
    // cache is invalid after creating a new dashboard
    await this.cacheManager.reset();

    const eitherDashboard = await this.dashboardsService.create(
      createDashboardDto,
    );

    if (isErr(eitherDashboard)) {
      throw eitherDashboard.err;
    }

    return eitherDashboard.ok;
  }

  @Put(':id')
  public async update(
    @Param() params: UpdateDashboardParams,
    @Body() updateDashboardDto: UpdateDashboardDto,
  ) {
    // cache is invalid after updating a dashboard
    await this.cacheManager.reset();

    const eitherDashboard = await this.dashboardsService.update({
      ...updateDashboardDto,
      ...params,
    });

    if (isErr(eitherDashboard)) {
      throw eitherDashboard.err;
    }

    if (isNothing(eitherDashboard.ok)) {
      throw new NotFoundException();
    }

    return eitherDashboard.ok;
  }

  @HttpCode(204)
  @Delete(':id')
  public async delete(@Param() params: DeleteDashboardParams) {
    // cache is invalid after deleting a dashboard
    await this.cacheManager.reset();

    const either = await this.dashboardsService.delete(params.id);

    if (isErr(either)) {
      throw either.err;
    }

    if (!either.ok) {
      throw new NotFoundException();
    }

    return either.ok;
  }
}
