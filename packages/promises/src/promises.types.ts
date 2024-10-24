export type BasePromiseResolver<T> = (value: T | PromiseLike<T>) => void;

export type BasePromiseRejector = (reason?: any) => void;

export type BasePromiseExecutor<T> = (
  resolve: BasePromiseResolver<T>,
  reject: BasePromiseRejector,
) => void;

export type BasePromiseConstructor<T> = new (
  executor: BasePromiseExecutor<T>,
) => Promise<T>;
