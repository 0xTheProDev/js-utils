import {
  DynamicModule,
  Module,
  ModuleMetadata,
  Provider,
} from "@nestjs/common";

import { createDistributedLock } from "./distributed-lock";
import { LockModuleError } from "./lock.error";
import {
  LockModuleAsyncOptions,
  LockModuleOptions,
  LockModuleOptionsFactory,
} from "./lock.module-options";
import { LOCK, LOCK_MODULE_OPTIONS } from "./lock.provider-tokens";

/**
 * @public
 * Distributed Lock Module. This module must be registered at the root application Module.
 */
@Module({})
export class LockModule {
  /**
   * @public
   * Configure Lock Module in root App Module.
   *
   * @param options - Lock Module Configuration.
   *
   * @example
   * \@Module({
   *    imports: [
   *      LockModule.forRoot(),
   *    ],
   *    controllers: [AppController],
   *    providers: [AppService],
   *  })
   *  export class AppModule { }
   */
  static forRoot(options: LockModuleOptions): DynamicModule {
    const providers: Provider[] = [
      {
        provide: LOCK_MODULE_OPTIONS,
        useValue: options,
      },
    ];

    return this.defineModule(providers);
  }

  /**
   * @public
   * Configure Lock Module with Lazy Initialization in root App Module.
   *
   * @param options - Lock Module Asynchronous Configuration.
   *
   * @example
   * \@Module({
   *    imports: [
   *      ConfigModule,
   *      LockModule.forRootAsync({
   *        imports: [ConfigModule], // This is not required for Global Modules.
   *        inject: [ConfigService],
   *        useFactory: (config: ConfigService) => ({
   *          defaultRequestOptions: {
   *            origin: config.get('serviceBaseUrl'),
   *          },
   *        }),
   *      }),
   *    ],
   *    controllers: [AppController],
   *    providers: [AppService],
   *  })
   *  export class AppModule { }
   */
  static forRootAsync(options: LockModuleAsyncOptions): DynamicModule {
    const providers: Provider[] = [];

    if (options.useClass && !options.useFactory) {
      providers.push(
        {
          provide: options.useClass,
          useClass: options.useClass,
        },
        {
          provide: LOCK_MODULE_OPTIONS,
          useFactory: (optsFactory: LockModuleOptionsFactory) =>
            optsFactory.createLockModuleOptions(),
          inject: [options.useClass],
        },
      );
    } else if (!options.useClass && options.useFactory) {
      providers.push({
        provide: LOCK_MODULE_OPTIONS,
        inject: options.inject ?? ([] as []),
        useFactory: options.useFactory,
      });
    } else {
      throw new LockModuleError(
        `Unsupported key combination found on options. [${Object.keys(
          options,
        ).join(", ")}] cannot be used together or some keys might be missing.`,
      );
    }

    return this.defineModule(providers, options.imports);
  }

  /**
   * @private
   * Generate Dynamic Module.
   *
   * @param providers - Set of Providers to be Exported from Http Module.
   * @param imports - Set of Imports to be Injected into Http Module.
   * @returns Dynamic Module instance.
   */
  private static defineModule(
    providers: Provider[],
    imports: ModuleMetadata["imports"] = [],
  ): DynamicModule {
    const extraProviders: Provider[] = [
      ...providers,
      {
        provide: LOCK,
        useFactory: createDistributedLock,
        inject: [LOCK_MODULE_OPTIONS],
      },
    ];

    return {
      exports: extraProviders,
      imports,
      module: LockModule,
      providers: extraProviders,
    };
  }
}
