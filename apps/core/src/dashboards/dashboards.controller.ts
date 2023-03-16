import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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
import { UpdateDashboardParams } from './params/update-dashboard.params';
import { ReadDashboardParams } from './params/read-dashboard.params';

@ApiTags('dashboards')
@Controller('dashboards')
export class DashboardsController {
  constructor(private readonly dashboardsService: DashboardsService) {}

  @Get()
  public list() {
    return this.dashboardsService.list();
  }

  @Post()
  public create(@Body() createDashboardDto: CreateDashboardDto) {
    return this.dashboardsService.create(createDashboardDto);
  }

  @Get(':id')
  public async read(@Param() params: ReadDashboardParams) {
    const dashboard = await this.dashboardsService.read(params.id);

    if (dashboard === undefined) {
      throw new NotFoundException();
    }

    return dashboard;
  }

  @Put(':id')
  public async update(
    @Param() params: UpdateDashboardParams,
    @Body() updateDashboardDto: UpdateDashboardDto,
  ) {
    const dashboard = await this.dashboardsService.update({
      ...updateDashboardDto,
      ...params,
    });

    if (dashboard === undefined) {
      throw new NotFoundException();
    }

    return dashboard;
  }

  @HttpCode(204)
  @Delete(':id')
  public async delete(@Param() params: DeleteDashboardParams) {
    const deleted = await this.dashboardsService.delete(params.id);

    if (!deleted) {
      throw new NotFoundException();
    }
  }
}
