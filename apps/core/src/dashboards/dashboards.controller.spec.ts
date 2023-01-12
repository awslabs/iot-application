import { describe, beforeEach, it, expect } from "vitest";
import { Test, TestingModule } from "@nestjs/testing";
import { DashboardsController } from "./dashboards.controller";
import { DashboardsService } from "./dashboards.service";

describe("DashboardsController", () => {
  let controller: DashboardsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardsController],
      providers: [DashboardsService],
    }).compile();

    controller = module.get<DashboardsController>(DashboardsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
