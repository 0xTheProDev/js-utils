import { Inject } from "@nestjs/common";

import { LOCK } from "./lock.provider-tokens";

/**
 * @public
 * Injects Global Lock Instance to an Injectable Class.
 *
 * @memberof LockModule
 *
 * @example
 * // app.service.ts
 * \@Injectable()
 * export class AppService {
 *   constructor(
 *     \@InjectLock() private readonly lock:Lock,
 *   ) {}
 *
 *   getItems(): Promise<unknown> {
 *     return this.lock.execute("items", () => ["Cat", "Dog", "Apple"]);
 *   }
 * }
 */
export const InjectLock = (): ParameterDecorator => Inject(LOCK);
