import { OnApplicationShutdown } from "@nestjs/common";
import { Agent, RetryAgent } from "undici";

import { createDispatcher } from "../src/dispatcher";

describe("createDispatcher", () => {
  it("should create Http Agent", () => {
    const dispatcher = createDispatcher({});
    expect(dispatcher).toBeInstanceOf(Agent);
  });

  it("should configure Http Agent with Retry Handler when retryOptions provided", () => {
    const dispatcher = createDispatcher({
      retryOptions: {
        maxRetries: 5,
      },
    });
    expect(dispatcher).toBeInstanceOf(RetryAgent);
  });

  it("should gracefully close connections during shutdown", () => {
    const dispatcher = createDispatcher({});
    const closeSpy = vi.spyOn(dispatcher, "close");
    (dispatcher as unknown as OnApplicationShutdown).onApplicationShutdown();
    expect(closeSpy).toHaveBeenCalled();
  });
});
