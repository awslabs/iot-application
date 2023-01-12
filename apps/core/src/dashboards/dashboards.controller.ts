import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { DashboardsService } from "./dashboards.service";
import { CreateDashboardDto } from "./dto/create-dashboard.dto";
import { UpdateDashboardDto } from "./dto/update-dashboard.dto";

@Controller("dashboards")
export class DashboardsController {
  constructor(private readonly dashboardsService: DashboardsService) {}

  @Post()
  create(@Body() createDashboardDto: CreateDashboardDto) {
    return this.dashboardsService.create(createDashboardDto);
  }

  @Get()
  findAll() {
    return this.dashboardsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.dashboardsService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateDashboardDto: UpdateDashboardDto,
  ) {
    return this.dashboardsService.update(+id, updateDashboardDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.dashboardsService.remove(+id);
  }
}
