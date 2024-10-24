import { CancelledPromiseError } from "./errors";

import type {
  BasePromiseConstructor,
  BasePromiseExecutor,
  BasePromiseRejector,
} from "./promises.types";

export const cancellable = <T>(BasePromise: BasePromiseConstructor<T>) => {
  const CancellablePromise = class extends BasePromise {
    private readonly reject: BasePromiseRejector;

    constructor(executor: BasePromiseExecutor<T>) {
      let _reject: BasePromiseRejector | null;

      super((resolve, reject) => {
        _reject = reject;
        executor(resolve, reject);
      });

      // @ts-expect-error - Promise Constructor is Synchronous in nature, so `_reject` will always have right value here.
      this.reject = _reject;
      _reject = null;
    }

    // Inherit all static properties from Promise and create chaining.
    static get [Symbol.species]() {
      return Promise;
    }

    cancel(reason?: any) {
      this.reject(new CancelledPromiseError((reason as Error).cause ?? reason));
    }
  };

  return CancellablePromise as typeof CancellablePromise & typeof Promise;
};
