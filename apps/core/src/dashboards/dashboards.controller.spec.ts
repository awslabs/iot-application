import { Test } from "@nestjs/testing";
import { DashboardsController } from "./dashboards.controller";
import { DashboardsService } from "./dashboards.service";

describe("DashboardsController", () => {
  let controller: DashboardsController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [DashboardsController],
      providers: [DashboardsService],
    }).compile();

    controller = await module.resolve(DashboardsController);
  });

  test("controller exists", () => {
    expect(controller).toBeDefined();
  });
});
