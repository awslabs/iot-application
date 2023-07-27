import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { DashboardsService } from './dashboards.service';
import { BulkDeleteDashboardDto } from './dto/bulk-delete-dashboards.dto';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';
import { DeleteDashboardParams } from './params/delete-dashboard.params';
import { ReadDashboardParams } from './params/read-dashboard.params';
import { UpdateDashboardParams } from './params/update-dashboard.params';
import { Dashboard } from './entities/dashboard.entity';

import { isErr, isJust, isNothing, isOk } from '../types';

@ApiTags('dashboards')
@Controller('api/dashboards')
export class DashboardsController {
  constructor(private readonly dashboardsService: DashboardsService) {}

  @Get(':id')
  public async read(@Param() params: ReadDashboardParams): Promise<Dashboard> {
    const result = await this.dashboardsService.read(params.id);

    if (isErr(result)) {
      throw result.err;
    }

    if (isNothing(result.ok)) {
      throw new NotFoundException();
    }

    return result.ok;
  }

  @Get()
  public async list() {
    const results = await this.dashboardsService.list();

    if (isErr(results)) {
      throw results.err;
    }

    return results.ok;
  }

  @Post()
  public async create(
    @Body() createDashboardDto: CreateDashboardDto,
  ): Promise<Dashboard> {
    const result = await this.dashboardsService.create(createDashboardDto);

    if (isErr(result)) {
      throw result.err;
    }

    return result.ok;
  }

  @Patch(':id')
  public async update(
    @Param() params: UpdateDashboardParams,
    @Body() updateDashboardDto: UpdateDashboardDto,
  ) {
    const result = await this.dashboardsService.update({
      ...updateDashboardDto,
      ...params,
    });

    if (isErr(result)) {
      throw result.err;
    }

    if (isNothing(result.ok)) {
      throw new NotFoundException();
    }

    return result.ok;
  }

  // TODO: consider deleting this method
  @HttpCode(204)
  @Delete(':id')
  public async delete(@Param() params: DeleteDashboardParams) {
    const result = await this.dashboardsService.delete(params.id);

    if (isErr(result)) {
      throw result.err;
    }

    if (isNothing(result.ok)) {
      throw new NotFoundException();
    }

    return result.ok;
  }

  @HttpCode(200)
  @Delete('bulk')
  public async bulkDelete(
    @Body() bulkDeleteDashboardsDto: BulkDeleteDashboardDto,
  ): Promise<{ deletedIds: Dashboard['id'][] }> {
    const results = await this.dashboardsService.bulkDelete(
      bulkDeleteDashboardsDto.ids,
    );

    const error = results.find(isErr);

    if (error) {
      // TODO: Return 207 if some are deleted
      throw error.err;
    }

    const okResults = results.filter(isOk);
    const isAnyNotFound = okResults.some((result) => isNothing(result.ok));
    const deletedIds = okResults.map((result) => result.ok).filter(isJust);

    if (isAnyNotFound) {
      // TODO: Return 207 if some are deleted
      throw new NotFoundException({ deletedIds });
    }

    return { deletedIds };
  }
}
