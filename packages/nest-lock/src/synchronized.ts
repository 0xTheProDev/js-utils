import { InjectLock } from "./inject-lock";

import type { LockOptions } from "@theprodev/distributed-lock";

export function Synchronized(
  lockId?: string,
  lockOptions?: LockOptions,
): MethodDecorator {
  return function <T>(
    target: any,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    const className = (target as Function).constructor.name;
    const _lockId = lockId || `${className}.${String(propertyKey)}`;

    const originalMethod = target[propertyKey];

    if (typeof originalMethod !== "function") {
      // throw error
    }

    Object.defineProperty(target, propertyKey, {
      ...descriptor,
      value: () => {
        const lockRef =
          Reflect.getMetadata("lock:synchronized", target) ||
          Symbol.for(_lockId);
        InjectLock()(target, lockRef, 0);

        target[lockRef](lockOptions);

        Reflect.defineMetadata("lock:synchronized", lockRef, target);
      },
    });
  };
}
