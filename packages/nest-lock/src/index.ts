export { DistributedLockError as LockError } from "@theprodev/distributed-lock";

export { InjectLock } from "./inject-lock";
export { LockModuleError } from "./lock.error";
export { LockModule } from "./lock.module";

export type { DistributedLock as Lock } from "@theprodev/distributed-lock";

export type {
  LockModuleOptions,
  LockModuleOptionsFactory,
} from "./lock.module-options";
