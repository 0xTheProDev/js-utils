import { DistributedLock } from "@theprodev/distributed-lock";

import { LockModuleOptions } from "./lock.module-options";

import type { OnApplicationShutdown } from "@nestjs/common";

/**
 * @internal
 * Factory function for creating a new instance of the Distributed Lock.
 *
 * @param options - Lock Module Options.
 * @returns Distributed Lock Instance.
 */
export function createDistributedLock(
  options: LockModuleOptions,
): DistributedLock {
  const distributedLock = new DistributedLock(options.config);

  /**
   * Housekeeping. Gracefully dispose the Distributed Lock instance before starting to shutdown the server.
   */
  (distributedLock as unknown as OnApplicationShutdown).onApplicationShutdown =
    async function onApplicationShutdown(this: DistributedLock) {
      await this.dispose();
    };

  return distributedLock;
}
