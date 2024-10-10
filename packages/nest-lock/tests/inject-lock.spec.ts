import { Injectable } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { DistributedLock } from "@theprodev/distributed-lock";

import { InjectLock } from "../src/inject-lock";
import { LockModule } from "../src/lock.module";

describe("InjectLock", () => {
  it("should inject Lock instance into properties", async () => {
    @Injectable()
    class AppService {
      @InjectLock() public readonly lock: DistributedLock;
    }

    const rootModule = await Test.createTestingModule({
      imports: [
        LockModule.forRoot({
          config: {
            host: "redis://example.com",
          },
        }),
      ],
      providers: [AppService],
      exports: [AppService],
    }).compile();

    const appService = rootModule.get(AppService);
    expect(appService.lock).toBeDefined();
    expect(appService.lock).toBeInstanceOf(DistributedLock);
  });

  it("should inject Lock instance into parameter", async () => {
    @Injectable()
    class AppService {
      constructor(@InjectLock() public readonly lock: DistributedLock) {}
    }

    const rootModule = await Test.createTestingModule({
      imports: [
        LockModule.forRoot({
          config: {
            host: "redis://example.com",
          },
        }),
      ],
      providers: [AppService],
      exports: [AppService],
    }).compile();

    const appService = rootModule.get(AppService);
    expect(appService.lock).toBeDefined();
    expect(appService.lock).toBeInstanceOf(DistributedLock);
  });
});
