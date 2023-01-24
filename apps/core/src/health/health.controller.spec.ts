import { Test } from "@nestjs/testing";
import { HealthController } from "./health.controller";
import { TerminusModule } from "@nestjs/terminus";
import { HttpService } from "@nestjs/axios";
import { of } from "rxjs";

describe("HealthController", () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TerminusModule],
      controllers: [HealthController],
      providers: [
        {
          provide: HttpService,
          useValue: {
            // required to effectively mock HttpService
            get: jest.fn(() => of({ core: { status: "up" } })),
            request: jest.fn(() => of({ status: "ok" })),
          },
        },
      ],
    }).compile();

    controller = await module.resolve(HealthController);
  });

  describe("check", () => {
    test("application status is returned", async () => {
      const status = await controller.check();

      expect(status).toEqual({
        status: "ok",
        info: {
          core: {
            status: "up",
          },
        },
        error: {},
        details: {
          core: {
            status: "up",
          },
        },
      });
    });
  });
});
