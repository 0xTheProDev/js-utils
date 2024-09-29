import {
  DynamicModule,
  Module,
  ModuleMetadata,
  Provider,
} from "@nestjs/common";

import { ClientService } from "./client.service";
import { createDispatcher } from "./dispatcher";
import { HttpModuleError } from "./http.error";
import {
  HttpModuleAsyncOptions,
  HttpModuleOptions,
  HttpModuleOptionsFactory,
} from "./http.module-options";
import { DISPATCHER, HTTP_MODULE_OPTIONS } from "./http.provider-tokens";
import { HttpService } from "./http.service";

/**
 * @public
 * Http/1.1 Module. This module must be registered at each Individual Microservice Module.
 */
@Module({})
export class HttpModule {
  /**
   * @public
   * Register Http Module.
   *
   * @param options - Http Module Configuration.
   *
   * @example
   * \@Module({
   *    imports: [
   *      HttpModule.register(),
   *    ],
   *    controllers: [AppController],
   *    providers: [AppService],
   *  })
   *  export class AppModule { }
   */
  static register(options: HttpModuleOptions = {}): DynamicModule {
    const providers: Provider[] = [
      {
        provide: HTTP_MODULE_OPTIONS,
        useValue: options,
      },
    ];

    return this.defineModule(providers);
  }

  /**
   * @public
   * Register Http Module with Lazy Initialization.
   *
   * @param options - Http Module Asynchronous Configuration.
   *
   * @example
   * \@Module({
   *    imports: [
   *      ConfigModule,
   *      HttpModule.registerAsync({
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
  static registerAsync(options: HttpModuleAsyncOptions): DynamicModule {
    const providers: Provider[] = [];

    if (options.useClass && !options.useFactory) {
      providers.push(
        {
          provide: options.useClass,
          useClass: options.useClass,
        },
        {
          provide: HTTP_MODULE_OPTIONS,
          useFactory: (optsFactory: HttpModuleOptionsFactory) =>
            optsFactory.createHttpModuleOptions(),
          inject: [options.useClass],
        },
      );
    } else if (!options.useClass && options.useFactory) {
      providers.push({
        provide: HTTP_MODULE_OPTIONS,
        inject: options.inject ?? ([] as []),
        useFactory: options.useFactory,
      });
    } else {
      throw new HttpModuleError(
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
        provide: DISPATCHER,
        useFactory: createDispatcher,
        inject: [HTTP_MODULE_OPTIONS],
      },
      ClientService,
      HttpService,
    ];

    return {
      exports: extraProviders,
      imports,
      module: HttpModule,
      providers: extraProviders,
    };
  }
}
