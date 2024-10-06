import { ClassProvider, FactoryProvider, ModuleMetadata } from "@nestjs/common";
import { DistributedLockConfig } from "@theprodev/distributed-lock";

/**
 * @internal
 * Time in MilliSecond unit.
 */
type TimeInMilliSecond = number;

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
  defaultLockOptions?: {
    /** Time to live before the Lock expires (in Milliseconds). */
    ttl?: TimeInMilliSecond;
  };
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
  inject?: LockModuleFactoryProviders["inject"];
  useClass?: LockModuleClassProviders["useClass"];
  useFactory?: LockModuleFactoryProviders["useFactory"];
};
