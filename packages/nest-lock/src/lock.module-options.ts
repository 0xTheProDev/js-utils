import { ClassProvider, FactoryProvider, ModuleMetadata } from "@nestjs/common";
import {
  DistributedLockConfig,
  LockOptions,
} from "@theprodev/distributed-lock";

/**
 * @public
 * Configuration Options for Lock Module.
 *
 * @memberof LockModule
 *
 * @example
 * \@Injectable()
 *  export class AppService {
 *    constructor(@Inject(LOCK_MODULE_OPTIONS) private readonly options: LockModuleOptions) { }
 *  }
 */
export type LockModuleOptions = {
  /**
   * Distributed Lock Construction Options.
   */
  config: DistributedLockConfig;
  /**
   * Default Configuration Options for Distributed Lock (optional).
   */
  defaultLockOptions?: LockOptions;
};

/**
 * @public
 * Factory for creating Lock Module Configuration Options through Class Provider.
 *
 * @memberof LockModule
 */
export interface LockModuleOptionsFactory {
  /** This method must return all the necessary configuration for Lock Module. */
  createLockModuleOptions(): LockModuleOptions;
}

/**
 * @internal
 * Class Provider for creating Lock Module Configuration Options.
 */
type LockModuleClassProviders = ClassProvider<LockModuleOptionsFactory>;

/**
 * @internal
 * Factory Provider for creating Lock Module Configuration Options.
 */
type LockModuleFactoryProviders = FactoryProvider<LockModuleOptions>;

/**
 * @public
 * Asynchronous Configuration Options for Lock Module.
 *
 * @memberof LockModule
 */
export type LockModuleAsyncOptions = Pick<ModuleMetadata, "imports"> & {
  /**
   * Optional list of providers to be injected into the context of the Factory function.
   * @see [Injection scopes](https://docs.nestjs.com/fundamentals/injection-scopes)
   */
  inject?: LockModuleFactoryProviders["inject"];
  /**
   * Type (class name) of provider (instance to be injected).
   * @see [Class providers](https://docs.nestjs.com/fundamentals/custom-providers#class-providers-useclass)
   */
  useClass?: LockModuleClassProviders["useClass"];
  /**
   * Factory function that returns an instance of the provider to be injected.
   * @see [Factory providers](https://docs.nestjs.com/fundamentals/custom-providers#factory-providers-usefactory)
   */
  useFactory?: LockModuleFactoryProviders["useFactory"];
};
