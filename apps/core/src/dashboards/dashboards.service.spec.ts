import { describe, beforeEach, it, expect } from "vitest";
import { Test, TestingModule } from "@nestjs/testing";
import { DashboardsService } from "./dashboards.service";

describe("DashboardsService", () => {
  let service: DashboardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DashboardsService],
    }).compile();

    service = module.get<DashboardsService>(DashboardsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
