import { OnApplicationShutdown } from "@nestjs/common";
import { DistributedLock } from "@theprodev/distributed-lock";

import { createDistributedLock } from "../src/distributed-lock";

describe("createDistributedLock", () => {
  it("should create Distributed Lock", () => {
    const distributedLock = createDistributedLock({
      config: {
        host: "redis://example.com",
      },
    });
    expect(distributedLock).toBeInstanceOf(DistributedLock);
  });

  it("should gracefully dispose connections during shutdown", () => {
    const distributedLock = createDistributedLock({
      config: {
        host: "redis://example.com",
      },
    });
    const disposeSpy = vi.spyOn(distributedLock, "dispose").mockResolvedValue();
    (
      distributedLock as unknown as OnApplicationShutdown
    ).onApplicationShutdown();
    expect(disposeSpy).toHaveBeenCalled();
  });
});
