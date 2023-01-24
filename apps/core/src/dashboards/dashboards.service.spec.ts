import { Test } from "@nestjs/testing";
import { DashboardsService } from "./dashboards.service";

describe("DashboardsService", () => {
  let service: DashboardsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [DashboardsService],
    }).compile();

    service = await module.resolve(DashboardsService);
  });

  test("service exists", () => {
    expect(service).toBeDefined();
  });
});
