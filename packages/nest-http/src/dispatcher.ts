import { Agent, Dispatcher, RetryAgent } from "undici";

import { HttpModuleOptions } from "./http.module-options";

import type { OnApplicationShutdown } from "@nestjs/common";

/**
 * @internal
 * Factory function for creating a new instance of the Dispatcher.
 *
 * @param options - Http Module Options.
 * @returns Dispatcher Instance.
 */
export function createDispatcher(options: HttpModuleOptions): Dispatcher {
  let dispatcher: Dispatcher = new Agent(options.clientOptions);

  if (options.retryOptions) {
    dispatcher = new RetryAgent(dispatcher, options.retryOptions);
  }

  /**
   * Housekeeping. Gracefully close the Dispatcher instance before starting to shutdown the server.
   */
  (dispatcher as unknown as OnApplicationShutdown).onApplicationShutdown =
    async function onApplicationShutdown(this: Dispatcher) {
      await this.close();
    };

  return dispatcher;
}
